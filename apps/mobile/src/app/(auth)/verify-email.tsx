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
import { Mail, KeyRound } from "lucide-react-native";

const verifySchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const { verifyEmail, resendOtp } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { email: params.email || "", otp: "" },
  });

  const onSubmit = async (data: VerifyFormValues) => {
    try {
      setIsLoading(true);
      await verifyEmail(data);
      Alert.alert("Success", "Email verified successfully! Welcome aboard.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Invalid OTP code";
      Alert.alert("Verification Error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    const email = getValues("email");
    if (!email) {
      Alert.alert("Error", "Please enter your email address to resend OTP.");
      return;
    }
    try {
      setIsResending(true);
      await resendOtp(email);
      Alert.alert("OTP Sent", "A new 6-digit verification code has been sent to your email.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to resend OTP";
      Alert.alert("Resend Error", msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-8">
        <View className="items-center mb-8 space-y-2">
          <View className="w-16 h-16 rounded-2xl bg-blue-600 items-center justify-center shadow-lg shadow-blue-500/30 mb-2">
            <KeyRound size={36} color="#ffffff" />
          </View>
          <Text className={`text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Verify Email
          </Text>
          <Text className={`text-xs text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Enter the 6-digit verification code sent to your email address.
          </Text>
        </View>

        <View className="space-y-4">
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

          <AppButton title="Verify & Continue" onPress={handleSubmit(onSubmit)} isLoading={isLoading} size="lg" />

          <TouchableOpacity
            onPress={handleResend}
            disabled={isResending}
            className="items-center py-2"
          >
            <Text className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {isResending ? "Sending new code..." : "Resend Verification OTP"}
            </Text>
          </TouchableOpacity>
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
