import React from "react";
import { View, Text } from "react-native";
import { Inbox } from "lucide-react-native";
import { AppButton } from "./AppButton";
import { useTheme } from "../../theme/theme.context";

export interface AppEmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionTitle?: string;
  onAction?: () => void;
}

export const AppEmptyState: React.FC<AppEmptyStateProps> = ({
  title = "No Tasks Available",
  description = "Get started by creating your first task or clearing active search filters.",
  icon,
  actionTitle,
  onAction,
}) => {
  const { isDark } = useTheme();

  return (
    <View className="items-center justify-center py-10 px-6 space-y-3 text-center">
      <View className="p-4 rounded-full bg-blue-50 dark:bg-blue-950/50 mb-2">
        {icon || <Inbox size={36} color="#2563eb" />}
      </View>

      <Text className={`text-base font-bold text-center ${isDark ? "text-white" : "text-slate-900"}`}>
        {title}
      </Text>

      <Text className={`text-xs text-center max-w-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        {description}
      </Text>

      {actionTitle && onAction && (
        <View className="pt-2">
          <AppButton title={actionTitle} onPress={onAction} size="sm" />
        </View>
      )}
    </View>
  );
};
