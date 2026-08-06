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

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: "success" | "error" | "info";
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
      setAlertConfig({
        visible: true,
        type: "success",
        title: "Email Verified!",
        message: "Your email address has been verified successfully. Welcome to SmartTask!",
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Invalid OTP code";
      setAlertConfig({
        visible: true,
        type: "error",
        title: "Verification Error",
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    const email = getValues("email");
    if (!email) {
      setAlertConfig({
        visible: true,
        type: "error",
        title: "Email Required",
        message: "Please enter your email address to resend the verification code.",
      });
      return;
    }
    try {
      setIsResending(true);
      await resendOtp(email);
      setAlertConfig({
        visible: true,
        type: "info",
        title: "OTP Resent",
        message: "A new 6-digit verification code has been sent to your email address.",
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to resend OTP";
      setAlertConfig({
        visible: true,
        type: "error",
        title: "Resend Error",
        message: msg,
      });
    } finally {
      setIsResending(false);
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
            <KeyRound size={28} color="#ffffff" />
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
            Verify Email
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
            Enter the 6-digit verification code sent to your email address.
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

            <AppButton
              title="Verify & Continue"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              size="lg"
              style={{ marginTop: 4 }}
            />

            <TouchableOpacity
              onPress={handleResend}
              disabled={isResending}
              activeOpacity={0.7}
              style={{ alignItems: "center", paddingVertical: 6 }}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#2563eb" }}>
                {isResending ? "Sending new code..." : "Resend Verification OTP"}
              </Text>
            </TouchableOpacity>
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
          onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
