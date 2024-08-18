import { login } from './action';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
export default function LoginForm() {


  return (
    <div className='flex flex-col h-screen items-center justify-center'>
          <Card className="w-[350px] ">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Plan and Discuss Your Travels</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={login}>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <Button  type="submit" className="w-full" >
Login
          </Button>
        </form>
      </CardContent>
    </Card>
      </div>

  );
}