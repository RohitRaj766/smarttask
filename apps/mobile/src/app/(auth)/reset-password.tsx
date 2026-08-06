import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../context/auth.context";
import { useTheme } from "../../theme/theme.context";
import { AppInput } from "../../components/ui/AppInput";
import { AppButton } from "../../components/ui/AppButton";
import { AppCard } from "../../components/ui/AppCard";
import { AppAlertModal } from "../../components/ui/AppAlertModal";
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

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: "success" | "error";
    title: string;
    message: string;
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
      setAlertConfig({
        visible: true,
        type: "success",
        title: "Password Reset Successful",
        message: "Your password has been reset successfully. Please log in with your new password.",
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Password reset failed";
      setAlertConfig({
        visible: true,
        type: "error",
        title: "Reset Error",
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertClose = () => {
    const isSuccess = alertConfig.type === "success";
    setAlertConfig((prev) => ({ ...prev, visible: false }));
    if (isSuccess) {
      router.push("/(auth)/login");
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
              shadowOpacity: 0.35,
              shadowRadius: 10,
            }}
          >
            <Lock size={28} color="#ffffff" />
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
            Reset Password
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
            Provide the 6-digit OTP code and set a new strong password.
          </Text>
        </View>

        {/* Form Card */}
        <AppCard style={{ padding: 22, borderRadius: 24 }}>
          <View style={{ gap: 14 }}>
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

            <AppButton
              title="Set New Password"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              size="lg"
              style={{ marginTop: 6 }}
            />
          </View>
        </AppCard>

        {/* Footer Link */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 24 }}>
          <Text style={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>
            Back to
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
          confirmText={alertConfig.type === "success" ? "Sign In" : "OK"}
          onClose={handleAlertClose}
          onConfirm={handleAlertClose}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
