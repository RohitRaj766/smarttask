"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../store/auth.context";
import { authApi } from "../../../services/auth.api";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { formatDate } from "../../../lib/utils";
import toast from "react-hot-toast";
import { User, Mail, Calendar, ShieldCheck } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

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

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Account Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your personal details and account preferences.
        </p>
      </div>

      <Card className="shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              error={errors.name?.message}
              {...register("name")}
            />

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address (Read-only)
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border border-input rounded-lg bg-muted/40 text-muted-foreground text-sm">
                <Mail className="h-4 w-4" />
                {user?.email}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Update Profile
              </Button>
            </div>
          </form>

          <div className="border-t border-border pt-6 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Account Metadata
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card">
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="font-semibold">{formatDate(user?.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Authentication</p>
                  <p className="font-semibold">JWT HttpOnly Cookies</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
