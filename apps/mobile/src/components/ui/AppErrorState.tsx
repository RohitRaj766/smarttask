import React from "react";
import { View, Text } from "react-native";
import { WifiOff, RefreshCw } from "lucide-react-native";
import { AppButton } from "./AppButton";
import { useTheme } from "../../theme/theme.context";

export interface AppErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const AppErrorState: React.FC<AppErrorStateProps> = ({
  title = "Connection Error",
  message = "Unable to connect to SmartTask servers. Please check your internet connection and try again.",
  onRetry,
}) => {
  const { isDark } = useTheme();

  return (
    <View className="flex-1 items-center justify-center py-12 px-6 space-y-3">
      <View className="p-4 rounded-full bg-red-50 dark:bg-red-950/50 mb-2">
        <WifiOff size={36} color="#ef4444" />
      </View>

      <Text className={`text-lg font-bold text-center ${isDark ? "text-white" : "text-slate-900"}`}>
        {title}
      </Text>

      <Text className={`text-xs text-center max-w-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        {message}
      </Text>

      {onRetry && (
        <View className="pt-3">
          <AppButton
            title="Retry Connection"
            onPress={onRetry}
            variant="outline"
            leftIcon={<RefreshCw size={16} color={isDark ? "#e2e8f0" : "#0f172a"} />}
          />
        </View>
      )}
    </View>
  );
};
