import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
} from "react-native";
import { useTheme } from "../../theme/theme.context";

export interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}) => {
  const { isDark } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          bg: isDark ? "bg-slate-800" : "bg-slate-100",
          backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
          textColor: isDark ? "#e2e8f0" : "#1e293b",
        };
      case "outline":
        return {
          bg: isDark ? "border border-slate-700 bg-transparent" : "border border-slate-200 bg-transparent",
          backgroundColor: "transparent",
          textColor: isDark ? "#f1f5f9" : "#0f172a",
        };
      case "danger":
        return {
          bg: "bg-red-600",
          backgroundColor: "#dc2626",
          textColor: "#ffffff",
        };
      case "ghost":
        return {
          bg: "bg-transparent",
          backgroundColor: "transparent",
          textColor: isDark ? "#cbd5e1" : "#475569",
        };
      case "primary":
      default:
        return {
          bg: "bg-blue-600",
          backgroundColor: "#2563eb",
          textColor: "#ffffff",
        };
    }
  };

  const vStyles = getVariantStyles();

  const getPaddingClass = () => {
    if (size === "sm") return "px-3 py-2";
    if (size === "lg") return "px-5 py-3.5";
    return "px-4 py-3";
  };

  const getFontSizeClass = () => {
    if (size === "sm") return "text-xs";
    if (size === "lg") return "text-base";
    return "text-sm";
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      className={`flex-row items-center justify-center rounded-xl transition-all ${getPaddingClass()} ${vStyles.bg} ${
        disabled || isLoading ? "opacity-50" : ""
      }`}
      style={[{ backgroundColor: vStyles.backgroundColor }, style]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={vStyles.textColor} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {leftIcon}
          <Text
            className={`font-semibold text-center ${getFontSizeClass()}`}
            style={{ color: vStyles.textColor }}
          >
            {title}
          </Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
};
