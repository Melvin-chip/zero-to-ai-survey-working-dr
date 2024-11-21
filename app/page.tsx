'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const signupSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  company: yup.string().required('Company is required'),
  role: yup.string().required('Role is required'),
});

type SignupFormData = yup.InferType<typeof signupSchema>;

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
  });

  const onSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const result = await response.json();
      router.push(`/survey?uuid=${result.uuid}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to login');
      }

      const result = await response.json();
      router.push(`/survey?uuid=${result.uuid}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      {/* Flowing Lines Background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <g className="flowing-lines">
            {[...Array(20)].map((_, i) => (
              <path
                key={i}
                d={`M0 ${80 + i * 1} Q ${30 + i * 2} ${70 - i * 2}, 100 ${
                  85 + i * 1
                }`}
                className="flowing-line"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0.1 - i * 0.005,
                }}
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-4 flex flex-col items-center">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] mb-4">
            Zero to A I
          </h1>
          <div className="w-24 h-0.5 bg-black mx-auto mb-4"></div>
          <p className="text-sm tracking-[0.3em] uppercase">
            Experience Matters
          </p>
        </div>

        {/* Auth Card */}
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-light tracking-wide text-center">
              Welcome
            </CardTitle>
            <CardDescription className="text-center">
              Sign in or create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login" className="text-sm tracking-wider">
                  LOGIN
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-sm tracking-wider">
                  SIGN UP
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={onLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="login-email"
                      className="text-xs uppercase tracking-wide"
                    >
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="bg-transparent border-b border-t-0 border-x-0 rounded-none focus:ring-0 px-0"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Continue'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSubmit(onSignup)} className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-xs uppercase tracking-wide"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      {...register('fullName')}
                      placeholder="Enter your full name"
                      className="bg-transparent border-b border-t-0 border-x-0 rounded-none focus:ring-0 px-0"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs uppercase tracking-wide"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="Enter your email"
                      className="bg-transparent border-b border-t-0 border-x-0 rounded-none focus:ring-0 px-0"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="company"
                      className="text-xs uppercase tracking-wide"
                    >
                      Company
                    </Label>
                    <Input
                      id="company"
                      {...register('company')}
                      placeholder="Enter your company name"
                      className="bg-transparent border-b border-t-0 border-x-0 rounded-none focus:ring-0 px-0"
                    />
                    {errors.company && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.company.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className="text-xs uppercase tracking-wide"
                    >
                      Role
                    </Label>
                    <Input
                      id="role"
                      {...register('role')}
                      placeholder="Enter your role"
                      className="bg-transparent border-b border-t-0 border-x-0 rounded-none focus:ring-0 px-0"
                    />
                    {errors.role && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.role.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
