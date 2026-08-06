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
    <SafeAreaView edges={["top"]} style={{ backgroundColor: isDark ? "#020617" : "#f8fafc" }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#1e293b" : "#e2e8f0",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                backgroundColor: "#2563eb",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 4,
                elevation: 2,
                shadowColor: "#2563eb",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              }}
            >
              <ChevronLeft size={20} color="#ffffff" />
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                letterSpacing: -0.3,
                color: isDark ? "#ffffff" : "#0f172a",
              }}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  marginTop: 1,
                  color: isDark ? "#94a3b8" : "#64748b",
                }}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        {rightAction ? <View style={{ marginLeft: 12 }}>{rightAction}</View> : null}
      </View>
    </SafeAreaView>
  );
};
