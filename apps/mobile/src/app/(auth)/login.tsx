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

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: "",
    message: "",
  });

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
      setAlertConfig({
        visible: true,
        title: "Authentication Error",
        message: msg,
      });
    } finally {
      setIsLoading(false);
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
            SmartTask
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
            Welcome back! Sign in to access your task dashboard.
          </Text>
        </View>

        {/* Modern Form Card */}
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

            <View style={{ alignItems: "flex-end", marginTop: -2, marginBottom: 2 }}>
              <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")} activeOpacity={0.7}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#2563eb" }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            <AppButton
              title="Sign In"
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
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")} activeOpacity={0.7}>
            <Text style={{ fontSize: 13, fontWeight: "800", color: "#2563eb" }}>
              Create account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Alert Feedback Modal */}
        <AppAlertModal
          visible={alertConfig.visible}
          type="error"
          title={alertConfig.title}
          message={alertConfig.message}
          onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
