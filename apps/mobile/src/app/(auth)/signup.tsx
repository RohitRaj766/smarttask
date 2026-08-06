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
import { User, Mail, Lock, CheckSquare } from "lucide-react-native";

const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character (!@#$%^&*)");

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const { signup } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setIsLoading(true);
      await signup({ name: data.name, email: data.email, password: data.password });
      Alert.alert(
        "Verification Required",
        "Registration successful! Please check your email for the 6-digit OTP code.",
        [
          {
            text: "Verify Email",
            onPress: () =>
              router.push({
                pathname: "/(auth)/verify-email",
                params: { email: data.email },
              }),
          },
        ]
      );
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Registration failed";
      Alert.alert("Registration Error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-6 space-y-5">
        <View className="items-center mb-1 space-y-1">
          <View className="w-12 h-12 rounded-xl bg-blue-600 items-center justify-center shadow-md shadow-blue-500/30 mb-1">
            <CheckSquare size={26} color="#ffffff" />
          </View>
          <Text className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Create Account
          </Text>
          <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Join SmartTask to streamline your daily workflow.
          </Text>
        </View>

        <View className="space-y-3">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Full Name"
                placeholder="John Doe"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
                leftIcon={<User size={18} color={isDark ? "#94a3b8" : "#64748b"} />}
              />
            )}
          />

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
                placeholder="Strong password"
                value={value}
                onChangeText={onChange}
                isPassword
                error={errors.password?.message}
                leftIcon={<Lock size={18} color={isDark ? "#94a3b8" : "#64748b"} />}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Confirm Password"
                placeholder="Re-enter password"
                value={value}
                onChangeText={onChange}
                isPassword
                error={errors.confirmPassword?.message}
                leftIcon={<Lock size={18} color={isDark ? "#94a3b8" : "#64748b"} />}
              />
            )}
          />

          <View className="pt-2">
            <AppButton
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              size="lg"
            />
          </View>
        </View>

        <View className="flex-row items-center justify-center gap-1.5 pt-2">
          <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Already have an account?
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
