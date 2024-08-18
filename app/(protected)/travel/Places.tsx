import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/server';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import Chat from '@/components/chat/Chat';
import { MapPin, User } from 'lucide-react';

export default async function Places() {
  const supabase = createClient();
  const { data, error } = await supabase.from("locations").select("*");
  if (error) {
    console.log(error);
  }
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100'>
      <header className='bg-white shadow-md p-6'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <h1 className='text-3xl font-bold'>Explore Places</h1>
          <div className='flex items-center space-x-2'>
            <User className='text-gray-600' />
            <p className='text-gray-600'>{user?.email}</p>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {data?.map((place) => (
            <Drawer key={place.id}>
              <DrawerTrigger asChild>
              <Card className='hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden'>
              <CardHeader className='bg-white border-b p-4'>
                <CardTitle className='text-xl font-semibold text-gray-800 flex items-center'>
                  <MapPin className='mr-2 text-primary' size={20} />
                  {place.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4'>
                <CardDescription className='text-gray-600'>{place.description}</CardDescription>
              </CardContent>
            </Card>
              </DrawerTrigger>
              <DrawerContent className='h-screen top-0 right-0 left-auto mt-0 w-[400px] sm:w-[500px]'>
                <Chat prompt={place.title} />
              </DrawerContent>
            </Drawer>
          ))}
        </div>
      </main>
    </div>
  );
}