import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../context/auth.context";
import { useTheme } from "../../theme/theme.context";
import { AppInput } from "../../components/ui/AppInput";
import { AppButton } from "../../components/ui/AppButton";
import { Mail, KeyRound, Lock } from "lucide-react-native";

const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character (!@#$%^&*)");

const resetSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be exactly 6 digits"),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const { resetPassword } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: params.email || "", otp: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetFormValues) => {
    try {
      setIsLoading(true);
      await resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      Alert.alert(
        "Password Reset Successful",
        "Your password has been reset successfully. Please log in with your new password.",
        [{ text: "Sign In", onPress: () => router.push("/(auth)/login") }]
      );
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Password reset failed";
      Alert.alert("Reset Error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-8">
        <View className="items-center mb-6 space-y-2">
          <View className="w-16 h-16 rounded-2xl bg-blue-600 items-center justify-center shadow-lg shadow-blue-500/30 mb-2">
            <Lock size={36} color="#ffffff" />
          </View>
          <Text className={`text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Reset Password
          </Text>
          <Text className={`text-xs text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Provide the 6-digit OTP code and set a new strong password.
          </Text>
        </View>

        <View className="space-y-3">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Email Address"
                placeholder="name@example.com"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
                leftIcon={<Mail size={18} color={isDark ? "#94a3b8" : "#64748b"} />}
              />
            )}
          />

          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="6-Digit OTP Code"
                placeholder="123456"
                value={value}
                onChangeText={onChange}
                keyboardType="number-pad"
                maxLength={6}
                error={errors.otp?.message}
                leftIcon={<KeyRound size={18} color={isDark ? "#94a3b8" : "#64748b"} />}
              />
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="New Password"
                placeholder="Strong password"
                value={value}
                onChangeText={onChange}
                isPassword
                error={errors.newPassword?.message}
                leftIcon={<Lock size={18} color={isDark ? "#94a3b8" : "#64748b"} />}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={value}
                onChangeText={onChange}
                isPassword
                error={errors.confirmPassword?.message}
                leftIcon={<Lock size={18} color={isDark ? "#94a3b8" : "#64748b"} />}
              />
            )}
          />

          <AppButton title="Set New Password" onPress={handleSubmit(onSubmit)} isLoading={isLoading} size="lg" className="mt-2" />
        </View>

        <View className="flex-row items-center justify-center gap-1.5 mt-8">
          <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Back to
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text className="text-xs font-bold text-blue-600 dark:text-blue-400">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
