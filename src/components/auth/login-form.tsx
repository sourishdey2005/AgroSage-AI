'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Building, Briefcase, Wheat, Info } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [activeTab, setActiveTab] = React.useState('farmer');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onLoginSubmit: SubmitHandler<LoginSchema> = (data) => {
    console.log('Login data:', data);
    // Hardcoded credential check for simulation
    if (data.email === 'agent@agrosage.in' && data.password === 'Agent@123') {
      window.location.href = '/dashboard/agent';
    } else if (data.email === 'gov@agrosage.in' && data.password === 'Gov@2025') {
      window.location.href = '/dashboard/government';
    } else {
      // Default to farmer, or can add specific farmer checks
      window.location.href = '/dashboard/farmer';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Welcome Back!</CardTitle>
        <CardDescription>
          Sign in to access your AgroSageAI dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        { (activeTab === 'agent' || activeTab === 'government') && (
            <Alert className="mb-4 bg-accent/50">
                <Info className="h-4 w-4" />
                <AlertTitle className="font-semibold">Demo Credentials</AlertTitle>
                <AlertDescription>
                  {activeTab === 'agent' ? (
                    <span>Email: <strong>agent@agrosage.in</strong><br/>Pass: <strong>Agent@123</strong></span>
                  ) : (
                    <span>Email: <strong>gov@agrosage.in</strong><br/>Pass: <strong>Gov@2025</strong></span>
                  )}
                </AlertDescription>
            </Alert>
        )}
        <Tabs defaultValue="farmer" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="farmer"><Wheat className="mr-2 h-4 w-4" />Farmer</TabsTrigger>
            <TabsTrigger value="agent"><Briefcase className="mr-2 h-4 w-4" />Agent</TabsTrigger>
            <TabsTrigger value="government"><Building className="mr-2 h-4 w-4" />Govt.</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4 pt-6">
            <TabsContent value="farmer" className="space-y-4 m-0 p-0">
                <div className="space-y-2">
                <Label htmlFor="email-farmer">Email</Label>
                <Input id="email-farmer" type="email" placeholder="farmer@example.com" {...register('email')} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password-farmer">Password</Label>
                    <Link href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                    </Link>
                </div>
                <Input id="password-farmer" type="password" {...register('password')} />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
            </TabsContent>

            <TabsContent value="agent" className="space-y-4 m-0 p-0">
                <div className="space-y-2">
                    <Label htmlFor="email-agent">Email</Label>
                    <Input id="email-agent" type="email" placeholder="agent@agrosage.in" {...register('email')} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password-agent">Password</Label>
                    <Input id="password-agent" type="password" {...register('password')} />
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
            </TabsContent>

            <TabsContent value="government" className="space-y-4 m-0 p-0">
               <div className="space-y-2">
                    <Label htmlFor="email-gov">Email</Label>
                    <Input id="email-gov" type="email" placeholder="gov@agrosage.in" {...register('email')} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password-gov">Password</Label>
                    <Input id="password-gov" type="password" {...register('password')} />
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
            </TabsContent>

            <Button className="w-full font-bold" type="submit">Sign In</Button>
            
            {activeTab === 'farmer' && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Sign in with Google</Button>
              </>
            )}
          </form>
        </Tabs>
        <div className="mt-6 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
