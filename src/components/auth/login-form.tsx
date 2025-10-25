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
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    setValue: setLoginValue,
    trigger,
    formState: { errors: loginErrors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onLoginSubmit: SubmitHandler<LoginSchema> = (data) => {
    console.log('Login data:', data);
    // Handle email/password login
    // For demo purposes, we can redirect based on role
    if (data.email.startsWith('agent')) {
      window.location.href = '/dashboard/agent';
    } else if (data.email.startsWith('gov')) {
      window.location.href = '/dashboard/government';
    } else {
      window.location.href = '/dashboard/farmer';
    }
  };

  const handleSpecialLogin = async (email: string, pass: string) => {
    setLoginValue('email', email);
    setLoginValue('password', pass);
    const isValid = await trigger(); // Manually trigger validation
    if (isValid) {
      onLoginSubmit({ email, password: pass });
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
          
          <TabsContent value="farmer">
             <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4 pt-6">
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
                <Button className="w-full font-bold" type="submit">Sign In</Button>
                 <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                    </div>
                <Button variant="outline" className="w-full">Sign in with Google</Button>
            </form>
          </TabsContent>
          <TabsContent value="agent">
            <div className="space-y-4 pt-6">
                 {/* This form is just for structure, the button has its own logic */}
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <Label htmlFor="agent-email">Email</Label>
                        <Input id="agent-email" type="email" placeholder="agent@agrosage.in" {...registerLogin('email')} disabled />
                    </div>
                    <div className="space-y-2 mt-4">
                        <Label htmlFor="agent-password">Password</Label>
                        <Input id="agent-password" type="password" {...registerLogin('password')} disabled />
                    </div>
                    <Button className="w-full font-bold mt-4" onClick={() => handleSpecialLogin('agent@agrosage.in', 'Agent@123')}>Login as Agent</Button>
                </form>
            </div>
          </TabsContent>
          <TabsContent value="government">
            <div className="space-y-4 pt-6">
                 {/* This form is just for structure, the button has its own logic */}
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <Label htmlFor="gov-email">Email</Label>
                        <Input id="gov-email" type="email" placeholder="gov@agrosage.in" {...registerLogin('email')} disabled />
                    </div>
                    <div className="space-y-2 mt-4">
                        <Label htmlFor="gov-password">Password</Label>
                        <Input id="gov-password" type="password" {...registerLogin('password')} disabled />
                    </div>
                    <Button className="w-full font-bold mt-4" onClick={() => handleSpecialLogin('gov@agrosage.in', 'Gov@2025')}>Login as Government</Button>
                </form>
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
