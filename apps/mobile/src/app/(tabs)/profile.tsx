import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/auth.context";
import { useTheme } from "../../theme/theme.context";
import { useUpdateProfile, useChangePassword } from "../../hooks/useProfile";
import { AppCard } from "../../components/ui/AppCard";
import { AppButton } from "../../components/ui/AppButton";
import { AppModal } from "../../components/ui/AppModal";
import { AppInput } from "../../components/ui/AppInput";
import { AppBadge } from "../../components/ui/AppBadge";
import { AppAlertModal } from "../../components/ui/AppAlertModal";
import {
  User,
  Mail,
  Moon,
  Sun,
  Monitor,
  Lock,
  LogOut,
  Edit3,
  ShieldCheck,
  Palette,
  ChevronRight,
} from "lucide-react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { themeMode, isDark, setThemeMode } = useTheme();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });

  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return "U";
    return nameStr
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const [passwordError, setPasswordError] = useState("");
  const [profileError, setProfileError] = useState("");

  const handleUpdateProfile = async () => {
    setProfileError("");
    if (!name.trim()) {
      setProfileError("Name cannot be empty");
      return;
    }
    try {
      await updateProfileMutation.mutateAsync({ name });
      setIsEditProfileOpen(false);
      setTimeout(() => {
        setAlertConfig({
          visible: true,
          type: "success",
          title: "Profile Updated!",
          message: "Your profile name has been saved successfully.",
        });
      }, 200);
    } catch (err: any) {
      setIsEditProfileOpen(false);
      setTimeout(() => {
        setAlertConfig({
          visible: true,
          type: "error",
          title: "Update Error",
          message: err?.response?.data?.message || err?.message || "Failed to update profile",
        });
      }, 200);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    if (!oldPassword.trim()) {
      setPasswordError("Please enter your current password");
      return;
    }
    if (!newPassword.trim()) {
      setPasswordError("Please enter a new password");
      return;
    }
    try {
      await changePasswordMutation.mutateAsync({ oldPassword, newPassword });
      setIsChangePasswordOpen(false);
      setOldPassword("");
      setNewPassword("");
      setTimeout(() => {
        setAlertConfig({
          visible: true,
          type: "success",
          title: "Password Updated!",
          message: "Your account password has been changed successfully.",
        });
      }, 200);
    } catch (err: any) {
      setIsChangePasswordOpen(false);
      setTimeout(() => {
        setAlertConfig({
          visible: true,
          type: "error",
          title: "Password Error",
          message: err?.response?.data?.message || err?.message || "Failed to change password",
        });
      }, 200);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#f8fafc" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 16, paddingTop: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "800", letterSpacing: -0.5, marginBottom: 16, color: isDark ? "#ffffff" : "#0f172a" }}>
          Account & Settings
        </Text>

        {/* Profile Details Card */}
        <AppCard style={{ alignItems: "center", paddingVertical: 24, paddingHorizontal: 16, marginBottom: 16 }}>
          <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: "#2563eb", alignItems: "center", justifyContent: "center", marginBottom: 12, borderWidth: 2, borderColor: "rgba(96, 165, 250, 0.3)" }}>
            <Text style={{ fontSize: 24, fontWeight: "800", color: "#ffffff" }}>{getInitials(user?.name)}</Text>
          </View>

          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 4, color: isDark ? "#ffffff" : "#0f172a" }}>
            {user?.name || "User Name"}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Mail size={14} color={isDark ? "#94a3b8" : "#64748b"} />
            <Text style={{ fontSize: 12, fontWeight: "500", color: isDark ? "#94a3b8" : "#64748b" }}>
              {user?.email || "user@example.com"}
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <AppBadge
              label={user?.isEmailVerified ? "Verified User" : "Unverified Account"}
              variant={user?.isEmailVerified ? "success" : "warning"}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              setName(user?.name || "");
              setIsEditProfileOpen(true);
            }}
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
              borderWidth: 1,
              borderColor: isDark ? "#334155" : "#e2e8f0",
            }}
          >
            <Edit3 size={15} color={isDark ? "#38bdf8" : "#2563eb"} />
            <Text style={{ fontSize: 12, fontWeight: "700", color: isDark ? "#ffffff" : "#0f172a" }}>
              Edit Name Profile
            </Text>
          </TouchableOpacity>
        </AppCard>

        {/* Theme Settings Section */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Palette size={16} color="#2563eb" />
            <Text style={{ fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, color: isDark ? "#94a3b8" : "#64748b" }}>
              Appearance Theme
            </Text>
          </View>

          <AppCard style={{ padding: 6, flexDirection: "row", gap: 6 }}>
            <TouchableOpacity
              onPress={() => setThemeMode("light")}
              activeOpacity={0.7}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: themeMode === "light" ? "#2563eb" : "transparent",
              }}
            >
              <Sun size={16} color={themeMode === "light" ? "#ffffff" : isDark ? "#94a3b8" : "#64748b"} />
              <Text style={{ fontSize: 12, fontWeight: "700", color: themeMode === "light" ? "#ffffff" : isDark ? "#cbd5e1" : "#334155" }}>
                Light
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setThemeMode("dark")}
              activeOpacity={0.7}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: themeMode === "dark" ? "#2563eb" : "transparent",
              }}
            >
              <Moon size={16} color={themeMode === "dark" ? "#ffffff" : isDark ? "#94a3b8" : "#64748b"} />
              <Text style={{ fontSize: 12, fontWeight: "700", color: themeMode === "dark" ? "#ffffff" : isDark ? "#cbd5e1" : "#334155" }}>
                Dark
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setThemeMode("system")}
              activeOpacity={0.7}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: themeMode === "system" ? "#2563eb" : "transparent",
              }}
            >
              <Monitor size={16} color={themeMode === "system" ? "#ffffff" : isDark ? "#94a3b8" : "#64748b"} />
              <Text style={{ fontSize: 12, fontWeight: "700", color: themeMode === "system" ? "#ffffff" : isDark ? "#cbd5e1" : "#334155" }}>
                System
              </Text>
            </TouchableOpacity>
          </AppCard>
        </View>

        {/* Security & Account Actions */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <ShieldCheck size={16} color="#2563eb" />
            <Text style={{ fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, color: isDark ? "#94a3b8" : "#64748b" }}>
              Security & Session
            </Text>
          </View>

          <View style={{ gap: 10 }}>
            {/* Change Password Card */}
            <TouchableOpacity
              onPress={() => setIsChangePasswordOpen(true)}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 14,
                borderRadius: 16,
                borderWidth: 1,
                backgroundColor: isDark ? "#0f172a" : "#ffffff",
                borderColor: isDark ? "#1e293b" : "#e2e8f0",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: isDark ? "rgba(30, 58, 138, 0.5)" : "#eff6ff", alignItems: "center", justifyContent: "center" }}>
                  <Lock size={18} color="#2563eb" />
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: isDark ? "#ffffff" : "#0f172a" }}>
                    Change Password
                  </Text>
                  <Text style={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>
                    Update your account security password
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={isDark ? "#94a3b8" : "#64748b"} />
            </TouchableOpacity>

            {/* Sign Out Card */}
            <TouchableOpacity
              onPress={() => setIsLogoutModalOpen(true)}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 14,
                borderRadius: 16,
                borderWidth: 1,
                backgroundColor: isDark ? "rgba(127, 29, 29, 0.3)" : "#fef2f2",
                borderColor: isDark ? "#991b1b" : "#fecaca",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: isDark ? "rgba(153, 27, 27, 0.5)" : "#fee2e2", alignItems: "center", justifyContent: "center" }}>
                  <LogOut size={18} color="#ef4444" />
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: "#ef4444" }}>
                    Sign Out of Account
                  </Text>
                  <Text style={{ fontSize: 12, color: isDark ? "#fca5a5" : "#b91c1c" }}>
                    Logout securely from this device
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <AppModal
          visible={isEditProfileOpen}
          onClose={() => {
            setProfileError("");
            setIsEditProfileOpen(false);
          }}
          title="Update Full Name"
        >
          <View style={{ paddingVertical: 8, gap: 12 }}>
            {profileError ? (
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#ef4444" }}>{profileError}</Text>
            ) : null}
            <AppInput
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChangeText={(t) => {
                setProfileError("");
                setName(t);
              }}
              leftIcon={<User size={18} color={isDark ? "#94a3b8" : "#64748b"} />}
            />
            <AppButton
              title="Save Name Profile"
              onPress={handleUpdateProfile}
              isLoading={updateProfileMutation.isPending}
            />
          </View>
        </AppModal>
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <AppModal
          visible={isChangePasswordOpen}
          onClose={() => {
            setPasswordError("");
            setIsChangePasswordOpen(false);
          }}
          title="Change Security Password"
        >
          <View style={{ paddingVertical: 8, gap: 12 }}>
            {passwordError ? (
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#ef4444" }}>{passwordError}</Text>
            ) : null}
            <AppInput
              label="Current Password"
              placeholder="Enter current password"
              value={oldPassword}
              onChangeText={(t) => {
                setPasswordError("");
                setOldPassword(t);
              }}
              isPassword
              leftIcon={<Lock size={18} color={isDark ? "#94a3b8" : "#64748b"} />}
            />

            <AppInput
              label="New Strong Password"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={(t) => {
                setPasswordError("");
                setNewPassword(t);
              }}
              isPassword
              leftIcon={<Lock size={18} color={isDark ? "#94a3b8" : "#64748b"} />}
            />

            <AppButton
              title="Update Password"
              onPress={handleChangePassword}
              isLoading={changePasswordMutation.isPending}
            />
          </View>
        </AppModal>
      )}

      {/* Sign Out Confirmation Modal */}
      {isLogoutModalOpen && (
        <AppAlertModal
          visible={isLogoutModalOpen}
          type="warning"
          title="Sign Out?"
          message="Are you sure you want to log out of your SmartTask account?"
          confirmText="Yes, Sign Out"
          cancelText="Cancel"
          isDestructive
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={logout}
        />
      )}

      {/* Alert Feedback Modal */}
      {alertConfig.visible && (
        <AppAlertModal
          visible={alertConfig.visible}
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        />
      )}
    </SafeAreaView>
  );
}
