import React from "react";
import { View, Text } from "react-native";
import { AppCard } from "./AppCard";
import { useTheme } from "../../theme/theme.context";

export interface AppStatCardProps {
  title: string;
  count: number;
  accentColor?: string;
  bgLight?: string;
  bgDark?: string;
  icon?: React.ReactNode;
}

export const AppStatCard: React.FC<AppStatCardProps> = ({
  title,
  count,
  accentColor = "#2563eb",
  bgLight = "#eff6ff",
  bgDark = "#1e293b",
  icon,
}) => {
  const { isDark } = useTheme();

  return (
    <AppCard
      className="p-3.5 flex-1 min-w-[140px] space-y-2 border-l-4"
      style={[
        {
          borderLeftColor: accentColor,
          backgroundColor: isDark ? bgDark : bgLight,
        },
      ]}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className="text-[11px] font-bold uppercase tracking-wider"
          style={{ color: isDark ? "#94a3b8" : "#64748b" }}
        >
          {title}
        </Text>
        {icon}
      </View>

      <Text
        className="text-2xl font-black"
        style={{ color: isDark ? "#ffffff" : "#0f172a" }}
      >
        {count}
      </Text>
    </AppCard>
  );
};
