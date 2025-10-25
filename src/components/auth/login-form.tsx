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
import { Switch } from '@/components/ui/switch';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

const otpSchema = z.object({
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
});

type LoginSchema = z.infer<typeof loginSchema>;
type OTPSchema = z.infer<typeof otpSchema>;

export function LoginForm() {
  const [useOtp, setUseOtp] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('farmer');

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    setValue: setLoginValue,
    formState: { errors: loginErrors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OTPSchema>({
    resolver: zodResolver(otpSchema),
  });

  const onLoginSubmit: SubmitHandler<LoginSchema> = (data) => {
    console.log('Login data:', data);
    // Handle email/password login
  };

  const onOtpSubmit: SubmitHandler<OTPSchema> = (data) => {
    console.log('OTP data:', data);
    // Handle OTP login
  };

  const handleAgentLogin = () => {
    setLoginValue('email', 'agent@agrosage.in');
    setLoginValue('password', 'Agent@123');
  };

  const handleGovLogin = () => {
    setLoginValue('email', 'gov@agrosage.in');
    setLoginValue('password', 'Gov@2025');
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
                <AlertTitle className="font-semibold">Special Login</AlertTitle>
                <AlertDescription>
                Use the pre-registered credentials by clicking the button below.
                </AlertDescription>
            </Alert>
        )}
        <Tabs defaultValue="farmer" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="farmer"><Wheat className="mr-2 h-4 w-4" />Farmer</TabsTrigger>
            <TabsTrigger value="agent"><Briefcase className="mr-2 h-4 w-4" />Agent</TabsTrigger>
            <TabsTrigger value="government"><Building className="mr-2 h-4 w-4" />Govt.</TabsTrigger>
          </TabsList>
          <div className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="farmer@example.com" {...registerLogin('email')} />
              {loginErrors.email && <p className="text-sm text-destructive">{loginErrors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" {...registerLogin('password')} />
              {loginErrors.password && <p className="text-sm text-destructive">{loginErrors.password.message}</p>}
            </div>
          </div>
          <TabsContent value="farmer">
            <div className="space-y-4 mt-4">
               <Button className="w-full font-bold" onClick={handleLoginSubmit(onLoginSubmit)}>Sign In</Button>
               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Sign in with Google</Button>
            </div>
          </TabsContent>
          <TabsContent value="agent">
            <div className="space-y-4 mt-4">
              <Button className="w-full font-bold" onClick={handleAgentLogin}>Login as Agent</Button>
              <Button className="w-full font-bold" onClick={handleLoginSubmit(onLoginSubmit)}>Sign In</Button>
            </div>
          </TabsContent>
          <TabsContent value="government">
            <div className="space-y-4 mt-4">
              <Button className="w-full font-bold" onClick={handleGovLogin}>Login as Government</Button>
               <Button className="w-full font-bold" onClick={handleLoginSubmit(onLoginSubmit)}>Sign In</Button>
            </div>
          </TabsContent>
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
