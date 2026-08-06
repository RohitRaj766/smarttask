import React, { useEffect, useRef } from "react";
import { Animated, View, Text, TouchableOpacity } from "react-native";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react-native";
import { useTheme } from "../../theme/theme.context";

export interface AppToastProps {
  visible: boolean;
  type?: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  onClose: () => void;
  durationMs?: number;
}

export const AppToast: React.FC<AppToastProps> = ({
  visible,
  type = "success",
  title,
  message,
  onClose,
  durationMs = 3500,
}) => {
  const { isDark } = useTheme();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, durationMs);

      return () => clearTimeout(timer);
    } else {
      translateY.setValue(-100);
      opacity.setValue(0);
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  const getIconAndColors = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle2 size={20} color="#10b981" />,
          bgBadge: isDark ? "bg-emerald-950/80 border-emerald-800" : "bg-emerald-50 border-emerald-200",
          accentColor: "border-l-emerald-500",
        };
      case "error":
        return {
          icon: <AlertCircle size={20} color="#ef4444" />,
          bgBadge: isDark ? "bg-red-950/80 border-red-800" : "bg-red-50 border-red-200",
          accentColor: "border-l-red-500",
        };
      case "warning":
        return {
          icon: <AlertTriangle size={20} color="#f59e0b" />,
          bgBadge: isDark ? "bg-amber-950/80 border-amber-800" : "bg-amber-50 border-amber-200",
          accentColor: "border-l-amber-500",
        };
      case "info":
      default:
        return {
          icon: <Info size={20} color="#2563eb" />,
          bgBadge: isDark ? "bg-blue-950/80 border-blue-800" : "bg-blue-50 border-blue-200",
          accentColor: "border-l-blue-500",
        };
    }
  };

  const config = getIconAndColors();

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 50,
        left: 16,
        right: 16,
        zIndex: 9999,
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View
        className={`flex-row items-center justify-between p-3.5 rounded-2xl border border-l-4 ${config.accentColor} ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        }`}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <View className={`w-9 h-9 rounded-xl items-center justify-center border ${config.bgBadge}`}>
            {config.icon}
          </View>
          <View className="flex-1">
            <Text className={`text-sm font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
              {title}
            </Text>
            {message ? (
              <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`} numberOfLines={2}>
                {message}
              </Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity onPress={handleDismiss} className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 ml-2">
          <X size={14} color={isDark ? "#cbd5e1" : "#64748b"} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
