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
import { User, Mail, ChevronRight, Lock, KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character (!@#$%^&*)");

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function ProfilePage() {
  const { user, isLoading, refreshProfile } = useAuth();
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    setValue: setProfileValue,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user?.name) {
      setProfileValue("name", user.name);
    }
  }, [user, setProfileValue]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSubmittingProfile(true);
      await authApi.updateProfile(data);
      await refreshProfile();
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordValues) => {
    try {
      setIsSubmittingPassword(true);
      const res = await authApi.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success(res.message || "Password changed successfully!");
      resetPasswordForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-10 w-56 mx-auto" />
          <Skeleton className="h-[280px] w-full rounded-2xl" />
          <Skeleton className="h-[320px] w-full rounded-2xl" />
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
            Manage your personal profile details and security credentials.
          </p>
        </div>

        {/* Personal Information Card */}
        <Card className="shadow-xl border-border bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border text-sm font-bold text-foreground">
                  <User className="h-4 w-4 text-primary" /> Personal Information
                </div>

                <Input
                  label="Full Name"
                  placeholder="Your full name"
                  error={profileErrors.name?.message}
                  {...registerProfile("name")}
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
                <Button type="submit" variant="primary" isLoading={isSubmittingProfile} className="px-6">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security & Change Password Card */}
        <Card className="shadow-xl border-border bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <KeyRound className="h-4 w-4 text-primary" /> Security & Password
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> End-to-End Encrypted
                  </span>
                </div>

                <Input
                  label="Current Password"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  error={passwordErrors.oldPassword?.message}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      tabIndex={-1}
                      className="focus:outline-none"
                      aria-label="Toggle current password visibility"
                    >
                      {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  {...registerPassword("oldPassword")}
                />

                <Input
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new strong password"
                  error={passwordErrors.newPassword?.message}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      tabIndex={-1}
                      className="focus:outline-none"
                      aria-label="Toggle new password visibility"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  {...registerPassword("newPassword")}
                />

                <Input
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  error={passwordErrors.confirmPassword?.message}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      className="focus:outline-none"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  {...registerPassword("confirmPassword")}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" isLoading={isSubmittingPassword} className="px-6">
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

