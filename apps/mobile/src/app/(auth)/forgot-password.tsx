import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../context/auth.context";
import { useTheme } from "../../theme/theme.context";
import { AppInput } from "../../components/ui/AppInput";
import { AppButton } from "../../components/ui/AppButton";
import { Mail, HelpCircle } from "lucide-react-native";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordScreen() {
  const { forgotPassword } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotFormValues) => {
    try {
      setIsLoading(true);
      await forgotPassword(data);
      Alert.alert(
        "Reset Code Sent",
        "If an account exists with this email, a 6-digit password reset OTP has been dispatched.",
        [
          {
            text: "Reset Password",
            onPress: () =>
              router.push({
                pathname: "/(auth)/reset-password",
                params: { email: data.email },
              }),
          },
        ]
      );
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to process request";
      Alert.alert("Error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-8">
        <View className="items-center mb-8 space-y-2">
          <View className="w-16 h-16 rounded-2xl bg-blue-600 items-center justify-center shadow-lg shadow-blue-500/30 mb-2">
            <HelpCircle size={36} color="#ffffff" />
          </View>
          <Text className={`text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Forgot Password
          </Text>
          <Text className={`text-xs text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Enter your account email address to receive a password reset OTP code.
          </Text>
        </View>

        <View className="space-y-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Registered Email"
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

          <AppButton title="Send Reset OTP" onPress={handleSubmit(onSubmit)} isLoading={isLoading} size="lg" />
        </View>

        <View className="flex-row items-center justify-center gap-1.5 mt-8">
          <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Remembered your password?
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
