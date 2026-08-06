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
          backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
          textColor: isDark ? "#e2e8f0" : "#1e293b",
          borderColor: isDark ? "#334155" : "#e2e8f0",
          borderWidth: 1,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          textColor: isDark ? "#f1f5f9" : "#0f172a",
          borderColor: isDark ? "#334155" : "#cbd5e1",
          borderWidth: 1,
        };
      case "danger":
        return {
          backgroundColor: "#dc2626",
          textColor: "#ffffff",
          borderColor: "#dc2626",
          borderWidth: 0,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          textColor: isDark ? "#cbd5e1" : "#475569",
          borderColor: "transparent",
          borderWidth: 0,
        };
      case "primary":
      default:
        return {
          backgroundColor: "#2563eb",
          textColor: "#ffffff",
          borderColor: "#2563eb",
          borderWidth: 0,
        };
    }
  };

  const vStyles = getVariantStyles();

  const getPadding = () => {
    if (size === "sm") return { paddingHorizontal: 12, paddingVertical: 8 };
    if (size === "lg") return { paddingHorizontal: 20, paddingVertical: 14 };
    return { paddingHorizontal: 16, paddingVertical: 12 };
  };

  const getFontSize = () => {
    if (size === "sm") return 12;
    if (size === "lg") return 16;
    return 14;
  };

  const pad = getPadding();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          paddingHorizontal: pad.paddingHorizontal,
          paddingVertical: pad.paddingVertical,
          backgroundColor: vStyles.backgroundColor,
          borderColor: vStyles.borderColor,
          borderWidth: vStyles.borderWidth,
          opacity: disabled || isLoading ? 0.5 : 1,
        },
        style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={vStyles.textColor} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {leftIcon}
          <Text
            style={{
              fontSize: getFontSize(),
              fontWeight: "600",
              textAlign: "center",
              color: vStyles.textColor,
            }}
          >
            {title}
          </Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
};
