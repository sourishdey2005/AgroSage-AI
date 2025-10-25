'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const signupSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required' }),
  phone: z.string().min(10, { message: 'A valid phone number is required' }),
  email: z.string().email({ message: 'A valid email is required' }),
  role: z.enum(['farmer']),
  district: z.string().min(2, { message: 'District is required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type SignupSchema = z.infer<typeof signupSchema>;

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'farmer' },
  });

  const onSubmit: SubmitHandler<SignupSchema> = (data) => {
    console.log(data);
    // Handle signup logic
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Create your Account</CardTitle>
        <CardDescription>Join AgroSageAI and revolutionize your farming.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-accent/50">
            <Info className="h-4 w-4" />
            <AlertTitle className="font-semibold">Attention Government & Agent Users</AlertTitle>
            <AlertDescription>
            No signup is required. Please <Link href="/auth/login" className="font-bold text-primary hover:underline">login</Link> with the default credentials.
            </AlertDescription>
        </Alert>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="Ram Kumar" {...register('fullName')} />
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="9876543210" {...register('phone')} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" placeholder="Pune" {...register('district')} />
                {errors.district && <p className="text-sm text-destructive">{errors.district.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="ram@example.com" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
           <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
           <div className="space-y-2">
            <Label>Role</Label>
            <Select defaultValue="farmer" disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="farmer">Farmer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full font-bold">Create Account</Button>
          
          <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">Sign up with Google</Button>
        </form>

        <div className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
