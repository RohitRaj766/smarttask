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
import { Mail, Lock, CheckSquare } from "lucide-react-native";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      await login(data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Login failed";
      Alert.alert("Authentication Error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-6 space-y-5">
        <View className="items-center mb-2 space-y-1">
          <View className="w-12 h-12 rounded-xl bg-blue-600 items-center justify-center shadow-md shadow-blue-500/30 mb-1">
            <CheckSquare size={26} color="#ffffff" />
          </View>
          <Text className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            SmartTask
          </Text>
          <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Welcome back! Sign in to access your task dashboard.
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
            name="password"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Password"
                placeholder="Enter password"
                value={value}
                onChangeText={onChange}
                isPassword
                error={errors.password?.message}
                leftIcon={<Lock size={18} color={isDark ? "#94a3b8" : "#64748b"} />}
              />
            )}
          />

          <View className="flex-row justify-end py-1">
            <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
              <Text className="text-xs font-bold text-blue-600 dark:text-blue-400">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          <AppButton title="Sign In" onPress={handleSubmit(onSubmit)} isLoading={isLoading} size="lg" />
        </View>

        <View className="flex-row items-center justify-center gap-1.5 pt-2">
          <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text className="text-xs font-bold text-blue-600 dark:text-blue-400">
              Create account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
