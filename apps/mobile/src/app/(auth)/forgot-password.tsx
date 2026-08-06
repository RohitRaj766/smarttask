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
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotFormValues) => {
    try {
      setIsLoading(true);
      await forgotPassword(data);
      setAlertConfig({
        visible: true,
        type: "success",
        title: "Reset Code Sent",
        message: "If an account exists with this email, a 6-digit password reset OTP code has been dispatched.",
        targetEmail: data.email,
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to process request";
      setAlertConfig({
        visible: true,
        type: "error",
        title: "Request Error",
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertClose = () => {
    const isSuccess = alertConfig.type === "success";
    const emailToReset = alertConfig.targetEmail;
    setAlertConfig((prev) => ({ ...prev, visible: false }));
    if (isSuccess && emailToReset) {
      router.push({
        pathname: "/(auth)/reset-password",
        params: { email: emailToReset },
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#f8fafc" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 20, paddingVertical: 28 }}>
        {/* Logo & Header Header */}
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
            <HelpCircle size={28} color="#ffffff" />
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
            Forgot Password
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
            Enter your account email address to receive a password reset OTP code.
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

            <AppButton
              title="Send Reset OTP"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              size="lg"
              style={{ marginTop: 4 }}
            />
          </View>
        </AppCard>

        {/* Footer Link */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 24 }}>
          <Text style={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>
            Remembered your password?
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
          confirmText={alertConfig.type === "success" ? "Reset Password" : "OK"}
          onClose={handleAlertClose}
          onConfirm={handleAlertClose}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
