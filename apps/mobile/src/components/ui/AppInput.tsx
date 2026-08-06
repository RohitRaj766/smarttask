import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../theme/theme.context";
import { Eye, EyeOff } from "lucide-react-native";

export interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  leftIcon,
  isPassword = false,
  secureTextEntry,
  style,
  ...props
}) => {
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const containerBg = isDark ? "bg-slate-950/80 border-slate-700/70" : "bg-slate-50 border-slate-200";
  const textColor = isDark ? "text-slate-100" : "text-slate-900";
  const placeholderColor = isDark ? "#64748b" : "#94a3b8";

  return (
    <View className="w-full space-y-1">
      {label && (
        <Text className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          {label}
        </Text>
      )}

      <View
        className={`flex-row items-center px-3 py-2.5 rounded-xl border ${containerBg} ${
          error ? "border-red-500" : ""
        }`}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}

        <TextInput
          className={`flex-1 text-sm font-medium ${textColor}`}
          placeholderTextColor={placeholderColor}
          secureTextEntry={isPassword ? !showPassword : secureTextEntry}
          style={style}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="ml-2 p-1"
          >
            {showPassword ? (
              <EyeOff size={18} color={isDark ? "#94a3b8" : "#64748b"} />
            ) : (
              <Eye size={18} color={isDark ? "#94a3b8" : "#64748b"} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text className="text-xs font-semibold text-red-500 mt-0.5">{error}</Text>}
    </View>
  );
};
