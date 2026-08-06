import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../theme/theme.context";

export interface AppBadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "danger" | "secondary" | "outline";
  size?: "sm" | "md";
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  label,
  variant = "default",
  size = "md",
}) => {
  const { isDark } = useTheme();

  const getStyles = () => {
    switch (variant) {
      case "success":
        return {
          bg: isDark ? "#064e3b" : "#ecfdf5",
          text: isDark ? "#a7f3d0" : "#047857",
          border: isDark ? "#047857" : "#a7f3d0",
        };
      case "warning":
        return {
          bg: isDark ? "#78350f" : "#fffbeb",
          text: isDark ? "#fde68a" : "#b45309",
          border: isDark ? "#b45309" : "#fde68a",
        };
      case "danger":
        return {
          bg: isDark ? "#7f1d1d" : "#fef2f2",
          text: isDark ? "#fca5a5" : "#b91c1c",
          border: isDark ? "#b91c1c" : "#fca5a5",
        };
      case "secondary":
        return {
          bg: isDark ? "#1e293b" : "#f1f5f9",
          text: isDark ? "#cbd5e1" : "#475569",
          border: isDark ? "#334155" : "#e2e8f0",
        };
      case "outline":
        return {
          bg: isDark ? "#0f172a" : "#f8fafc",
          text: isDark ? "#94a3b8" : "#475569",
          border: isDark ? "#334155" : "#cbd5e1",
        };
      case "default":
      default:
        return {
          bg: isDark ? "#1e3a8a" : "#eff6ff",
          text: isDark ? "#bfdbfe" : "#1d4ed8",
          border: isDark ? "#1d4ed8" : "#bfdbfe",
        };
    }
  };

  const st = getStyles();
  const padding = size === "sm" ? "px-2 py-0.5" : "px-2.5 py-1";
  const fontSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <View
      className={`rounded-lg border self-start items-center justify-center ${padding}`}
      style={{ backgroundColor: st.bg, borderColor: st.border }}
    >
      <Text
        className={`font-bold uppercase tracking-wider ${fontSize}`}
        style={{ color: st.text }}
      >
        {label}
      </Text>
    </View>
  );
};
