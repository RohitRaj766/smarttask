import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme } from "../../theme/theme.context";

export interface AppCardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "flat" | "bordered";
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  variant = "default",
  style,
  className = "",
  ...props
}) => {
  const { isDark } = useTheme();

  let bg = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80";
  let shadow = variant === "default" ? "shadow-sm" : "";

  return (
    <View
      className={`rounded-2xl border p-4 ${bg} ${shadow} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
};
