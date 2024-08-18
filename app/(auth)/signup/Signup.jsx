"use client"
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signup } from '../login/action';
export default function Signup() {

  return (
    <div className='flex flex-col h-screen items-center justify-center'>
          <Card className="w-[350px] ">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Plan and Discuss Your Travels</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
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
          <Button formAction={signup} type="submit" className="w-full">
              Signup
          </Button>
        </form>
      </CardContent>
    </Card>
      </div>

  );
}