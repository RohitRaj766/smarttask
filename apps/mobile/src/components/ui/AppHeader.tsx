import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useTheme } from "../../theme/theme.context";

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  rightAction,
}) => {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <SafeAreaView edges={["top"]} className={isDark ? "bg-slate-950" : "bg-slate-50"}>
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80">
        <View className="flex-row items-center gap-2 flex-1">
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-1.5 rounded-lg bg-slate-200/50 dark:bg-slate-800 mr-1"
            >
              <ChevronLeft size={20} color={isDark ? "#f1f5f9" : "#0f172a"} />
            </TouchableOpacity>
          )}

          <View className="flex-1">
            <Text className={`text-xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {title}
            </Text>
            {subtitle && (
              <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {rightAction && <View className="ml-3">{rightAction}</View>}
      </View>
    </SafeAreaView>
  );
};
