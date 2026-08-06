import React, { useEffect, useRef } from "react";
import { Animated, View, ViewStyle } from "react-native";
import { useTheme } from "../../theme/theme.context";
import { AppCard } from "./AppCard";

export interface AppSkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const AppSkeleton: React.FC<AppSkeletonProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const { isDark } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius,
          backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
          opacity,
        },
        style,
      ]}
    />
  );
};

export const AppTaskCardSkeleton: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <View style={{ marginBottom: 12 }}>
      <AppCard style={{ padding: 16 }}>
        {/* Header Title & Description Skeleton */}
        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <View style={{ flex: 1, paddingRight: 16, gap: 8 }}>
            <AppSkeleton width="72%" height={18} borderRadius={6} />
            <AppSkeleton width="48%" height={14} borderRadius={4} />
          </View>
          <AppSkeleton width={22} height={22} borderRadius={11} />
        </View>

        {/* Divider & Chips Footer Skeleton */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 12,
            marginTop: 4,
            borderTopWidth: 1,
            borderTopColor: isDark ? "#1e293b" : "#f1f5f9",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <AppSkeleton width={56} height={22} borderRadius={8} />
            <AppSkeleton width={56} height={22} borderRadius={8} />
            <AppSkeleton width={56} height={22} borderRadius={8} />
          </View>

          <AppSkeleton width={68} height={14} borderRadius={4} />
        </View>
      </AppCard>
    </View>
  );
};
