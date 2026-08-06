"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../store/auth.context";
import { authApi } from "../../../services/auth.api";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import toast from "react-hot-toast";
import { User, Mail, ChevronRight, Lock } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isLoading, refreshProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  useEffect(() => {
    if (user?.name) {
      setValue("name", user.name);
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSubmitting(true);
      await authApi.updateProfile(data);
      await refreshProfile();
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-10 w-56 mx-auto" />
          <Skeleton className="h-[280px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Centered Breadcrumb Navigation */}
      <nav className="flex justify-center items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Link href="/overview" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-bold">Profile</span>
      </nav>

      {/* Centered Modern Form Container */}
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">{user?.name || "Account Profile"}</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Manage your personal profile details and credentials.
          </p>
        </div>

        <Card className="shadow-xl border-border bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border text-sm font-bold text-foreground">
                  <User className="h-4 w-4 text-primary" /> Personal Information
                </div>

                <Input
                  label="Full Name"
                  placeholder="Your full name"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email Address
                    </label>
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                      <Lock className="h-3 w-3" /> Verified & Locked
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5 border border-input rounded-lg bg-muted/40 text-muted-foreground text-sm font-medium">
                    <Mail className="h-4 w-4 text-primary/70" />
                    {user?.email}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" isLoading={isSubmitting} className="px-6">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
