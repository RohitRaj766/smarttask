"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "../../../services/auth.api";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../components/ui/card";
import { KeyRound, Mail } from "lucide-react";
import toast from "react-hot-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      setIsSubmitting(true);
      const res = await authApi.forgotPassword({ email: data.email });
      toast.success(res.message || "Password reset OTP sent to your email.");
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to process request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex min-h-[75vh] items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-border">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <KeyRound className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address to receive a 6-digit OTP code to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                leftElement={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register("email")}
              />

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Send Reset OTP
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
