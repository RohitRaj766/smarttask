import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../context/auth.context";
import { useTheme } from "../../theme/theme.context";
import { AppInput } from "../../components/ui/AppInput";
import { AppButton } from "../../components/ui/AppButton";
import { AppCard } from "../../components/ui/AppCard";
import { AppAlertModal } from "../../components/ui/AppAlertModal";
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

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    targetEmail?: string;
  }>({
    visible: false,
    type: "error",
    title: "",
    message: "",
  });

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
      setAlertConfig({
        visible: true,
        type: "success",
        title: "Verification Required",
        message: "Registration successful! Please check your email for the 6-digit verification OTP code.",
        targetEmail: data.email,
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Registration failed";
      setAlertConfig({
        visible: true,
        type: "error",
        title: "Registration Error",
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertClose = () => {
    const isSuccess = alertConfig.type === "success";
    const emailToVerify = alertConfig.targetEmail;
    setAlertConfig((prev) => ({ ...prev, visible: false }));
    if (isSuccess && emailToVerify) {
      router.push({
        pathname: "/(auth)/verify-email",
        params: { email: emailToVerify },
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#f8fafc" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 20, paddingVertical: 28 }}>
        {/* Logo & Header */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              backgroundColor: "#2563eb",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
              elevation: 6,
              shadowColor: "#2563eb",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 10,
            }}
          >
            <CheckSquare size={28} color="#ffffff" />
          </View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "800",
              letterSpacing: -0.5,
              color: isDark ? "#ffffff" : "#0f172a",
              marginBottom: 4,
            }}
          >
            Create Account
          </Text>
          <Text
            style={{
              fontSize: 13,
              lineHeight: 18,
              color: isDark ? "#94a3b8" : "#64748b",
              textAlign: "center",
              maxWidth: 280,
            }}
          >
            Join SmartTask to streamline your daily workflow.
          </Text>
        </View>

        {/* Form Card */}
        <AppCard style={{ padding: 22, borderRadius: 24 }}>
          <View style={{ gap: 14 }}>
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

            <AppButton
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              size="lg"
              style={{ marginTop: 6 }}
            />
          </View>
        </AppCard>

        {/* Footer Link */}
        <View style={{ flexDirection: "row", items: "center", justifyContent: "center", gap: 6, marginTop: 24 }}>
          <Text style={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")} activeOpacity={0.7}>
            <Text style={{ fontSize: 13, fontWeight: "800", color: "#2563eb" }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Alert Feedback Modal */}
        <AppAlertModal
          visible={alertConfig.visible}
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          confirmText={alertConfig.type === "success" ? "Verify Email" : "OK"}
          onClose={handleAlertClose}
          onConfirm={handleAlertClose}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
