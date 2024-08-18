import { createBrowserClient } from "@supabase/ssr";
import { Stripe } from "stripe";
import { stripe } from "../stripe/config";
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '' ;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createBrowserClient(supabaseUrl, supabaseKey);
}
const supabaseAdmin = createAdminClient()

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
  const { error: upsertError } = await supabaseAdmin
    .from('customers')
    .upsert([{ user_id: uuid, stripe_customer_id: customerId }]);

  if (upsertError)
    throw new Error(`Supabase customer record creation failed: ${upsertError.message}`);

  return customerId;
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error('Stripe customer creation failed.');

  return newCustomer.id;
};

const createOrRetrieveCustomer = async ({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) => {
  // Check if the customer already exists in Supabase
  const { data: existingSupabaseCustomer, error: queryError } =
    await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('user_id', uuid)
      .maybeSingle();

  if (queryError) {
    throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
  }

  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  let stripeCustomerId: string | undefined;
  if (existingSupabaseCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.stripe_customer_id
    );
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);
  if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');

  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from('customers')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('user_id', uuid);

      if (updateError)
        throw new Error(
          `Supabase customer record update failed: ${updateError.message}`
        );
      console.warn(
        `Supabase customer record mismatched Stripe ID. Supabase record updated.`
      );
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
  } else {
    console.warn(
      `Supabase customer record was missing. A new record was created.`
    );

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert
    );
    if (!upsertedStripeCustomer)
      throw new Error('Supabase customer record creation failed.');

    return upsertedStripeCustomer;
  }
};

const manageSubscriptions = async (
  subscriptionId: string,
  customerId: string,
  type: string,
) => {
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
  .from('customers')
  .select('user_id')
  .eq('stripe_customer_id', customerId)
  .single();
  if (noCustomerError)
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`);
 const { user_id: uuid } = customerData!;
  try {
    if (!subscriptionId) {
      console.error("Subscription ID is undefined");
      return;
    }

    try {
      const subscription: Stripe.Subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const updateData: any = {
        user_id: uuid,
        customer_id: customerId,
        subscription_id: subscription.id,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
        product_id: subscription.items.data[0].plan.product,
      };

      // Update message_limit only when type is "subscription_cycle"
      if (type === "subscription_cycle") {
        updateData.message_limit = 50;
        console.log("Monthly recurring payment received, updating message limit");
      } else {
        console.log(`Subscription event type: ${type}, not changing message limit`);
      }

      const { error } = await supabaseAdmin
        .from("subscriptions")
        .upsert([updateData], { onConflict: 'user_id' });

      if (error) {
        console.error("❌ Supabase Error: ", error?.message);
      } else {
        console.log("🔔 Successfully Inserted Subscription", type);
      }
    } catch (err) {
      console.error("Error managing subscription:", (err as Error).message);
    }
  } catch (err) {
    console.error("Unexpected error in manageSubscriptions:", err);
  }
};

export {
  createOrRetrieveCustomer,
  manageSubscriptions
};