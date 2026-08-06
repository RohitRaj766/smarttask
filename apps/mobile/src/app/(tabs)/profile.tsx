import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/auth.context";
import { useTheme } from "../../theme/theme.context";
import { useUpdateProfile, useChangePassword } from "../../hooks/useProfile";
import { AppCard } from "../../components/ui/AppCard";
import { AppButton } from "../../components/ui/AppButton";
import { AppModal } from "../../components/ui/AppModal";
import { AppInput } from "../../components/ui/AppInput";
import { AppBadge } from "../../components/ui/AppBadge";
import {
  User,
  Mail,
  Moon,
  Sun,
  Monitor,
  Lock,
  LogOut,
  Edit3,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { themeMode, isDark, setThemeMode } = useTheme();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

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

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Name cannot be empty");
      return;
    }
    try {
      await updateProfileMutation.mutateAsync({ name });
      Alert.alert("Success", "Profile updated successfully");
      setIsEditProfileOpen(false);
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert("Validation Error", "Please enter a new password");
      return;
    }
    try {
      await changePasswordMutation.mutateAsync({ oldPassword, newPassword });
      Alert.alert("Success", "Password changed successfully");
      setIsChangePasswordOpen(false);
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Failed to change password");
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to log out of SmartTask?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <SafeAreaView edges={["top"]} className={`flex-1 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-4 py-4 space-y-6">
        <Text className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          Account & Settings
        </Text>

        {/* Profile Card */}
        <AppCard className="items-center py-6 space-y-3">
          <View className="w-20 h-20 rounded-full bg-blue-600 items-center justify-center shadow-lg shadow-blue-500/30 mb-1">
            <Text className="text-2xl font-extrabold text-white">{getInitials(user?.name)}</Text>
          </View>

          <Text className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {user?.name || "User Name"}
          </Text>

          <View className="flex-row items-center gap-1.5">
            <Mail size={14} color={isDark ? "#94a3b8" : "#64748b"} />
            <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {user?.email || "user@example.com"}
            </Text>
          </View>

          <View className="flex-row items-center gap-2 pt-1">
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
            className="flex-row items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 mt-2"
          >
            <Edit3 size={14} color={isDark ? "#e2e8f0" : "#0f172a"} />
            <Text className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Edit Name Profile
            </Text>
          </TouchableOpacity>
        </AppCard>

        {/* Theme Settings Section */}
        <View className="space-y-3">
          <Text className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Appearance Theme
          </Text>

          <AppCard className="p-2 flex-row gap-2">
            <TouchableOpacity
              onPress={() => setThemeMode("light")}
              className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${
                themeMode === "light" ? "bg-blue-600" : "bg-transparent"
              }`}
            >
              <Sun size={16} color={themeMode === "light" ? "#ffffff" : isDark ? "#94a3b8" : "#64748b"} />
              <Text
                className={`text-xs font-bold ${
                  themeMode === "light" ? "text-white" : isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Light
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setThemeMode("dark")}
              className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${
                themeMode === "dark" ? "bg-blue-600" : "bg-transparent"
              }`}
            >
              <Moon size={16} color={themeMode === "dark" ? "#ffffff" : isDark ? "#94a3b8" : "#64748b"} />
              <Text
                className={`text-xs font-bold ${
                  themeMode === "dark" ? "text-white" : isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Dark
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setThemeMode("system")}
              className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${
                themeMode === "system" ? "bg-blue-600" : "bg-transparent"
              }`}
            >
              <Monitor size={16} color={themeMode === "system" ? "#ffffff" : isDark ? "#94a3b8" : "#64748b"} />
              <Text
                className={`text-xs font-bold ${
                  themeMode === "system" ? "text-white" : isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                System
              </Text>
            </TouchableOpacity>
          </AppCard>
        </View>

        {/* Security & Account Actions */}
        <View className="space-y-3">
          <Text className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Security & Session
          </Text>

          <AppCard className="p-0 overflow-hidden">
            <TouchableOpacity
              onPress={() => setIsChangePasswordOpen(true)}
              className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800"
            >
              <View className="flex-row items-center gap-3">
                <Lock size={18} color="#2563eb" />
                <Text className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Change Password
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center justify-between p-4 bg-red-50/50 dark:bg-red-950/20"
            >
              <View className="flex-row items-center gap-3">
                <LogOut size={18} color="#ef4444" />
                <Text className="text-sm font-bold text-red-600 dark:text-red-400">
                  Sign Out of Account
                </Text>
              </View>
            </TouchableOpacity>
          </AppCard>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <AppModal
        visible={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Update Full Name"
      >
        <View className="space-y-4 py-2">
          <AppInput
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            leftIcon={<User size={18} color={isDark ? "#94a3b8" : "#64748b"} />}
          />
          <AppButton
            title="Save Name Profile"
            onPress={handleUpdateProfile}
            isLoading={updateProfileMutation.isPending}
          />
        </View>
      </AppModal>

      {/* Change Password Modal */}
      <AppModal
        visible={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        title="Change Security Password"
      >
        <View className="space-y-3 py-2">
          <AppInput
            label="Current Password (Optional)"
            placeholder="Enter current password"
            value={oldPassword}
            onChangeText={setOldPassword}
            isPassword
            leftIcon={<Lock size={18} color={isDark ? "#94a3b8" : "#64748b"} />}
          />

          <AppInput
            label="New Strong Password"
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
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
    </SafeAreaView>
  );
}
