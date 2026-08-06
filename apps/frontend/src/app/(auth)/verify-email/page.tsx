"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../store/auth.context";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../components/ui/card";
import { CheckSquare, KeyRound, MailCheck, RotateCw } from "lucide-react";

const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const { verifyEmail, resendOtp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: emailParam,
      otp: "",
    },
  });

  const currentEmail = watch("email");

  const onSubmit = async (data: VerifyOtpValues) => {
    try {
      setIsSubmitting(true);
      await verifyEmail({ email: data.email, otp: data.otp });
    } catch {
      // Handled by context/interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!currentEmail) return;
    try {
      setIsResending(true);
      await resendOtp(currentEmail);
    } catch {
      // Handled by context
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-border">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <MailCheck className="h-8 w-8" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
        <CardDescription>
          Enter the 6-digit OTP sent to{" "}
          <span className="font-bold text-foreground">{currentEmail || "your email"}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="6-Digit OTP Code"
            type="text"
            maxLength={6}
            placeholder="123456"
            className="text-center font-mono text-lg tracking-[0.3em] font-bold"
            leftElement={<KeyRound className="h-4 w-4" />}
            error={errors.otp?.message}
            {...register("otp")}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Verify Account
          </Button>
        </form>

        <div className="flex items-center justify-between pt-4 mt-2 border-t border-border text-xs">
          <span className="text-muted-foreground">Didn't receive code?</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResend}
            isLoading={isResending}
            className="gap-1.5 text-xs text-primary"
          >
            <RotateCw className="h-3.5 w-3.5" /> Resend OTP
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          Back to{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex min-h-[75vh] items-center justify-center">
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
}
