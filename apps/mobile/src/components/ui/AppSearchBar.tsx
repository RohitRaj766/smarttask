import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Search, X } from "lucide-react-native";
import { useTheme } from "../../theme/theme.context";

export interface AppSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  debounceMs?: number;
}

export const AppSearchBar: React.FC<AppSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search tasks...",
  onClear,
  debounceMs = 400,
}) => {
  const { isDark } = useTheme();
  const [internalValue, setInternalValue] = useState(value);
  const isFirstRender = useRef(true);

  // Sync internal value if external value changes (e.g., reset filters)
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounce API calls on keystrokes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (internalValue !== value) {
        onChangeText(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, debounceMs, onChangeText, value]);

  const handleClear = () => {
    setInternalValue("");
    onChangeText("");
    onClear?.();
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: isDark ? "#0f172a" : "#f1f5f9",
        borderColor: isDark ? "#1e293b" : "#e2e8f0",
      }}
    >
      <Search size={18} color={isDark ? "#94a3b8" : "#64748b"} style={{ marginRight: 8 }} />

      <TextInput
        value={internalValue}
        onChangeText={setInternalValue}
        placeholder={placeholder}
        placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: "500",
          color: isDark ? "#ffffff" : "#0f172a",
        }}
      />

      {internalValue.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          activeOpacity={0.7}
          style={{
            padding: 4,
            borderRadius: 20,
            backgroundColor: isDark ? "#1e293b" : "#cbd5e1",
          }}
        >
          <X size={14} color={isDark ? "#cbd5e1" : "#475569"} />
        </TouchableOpacity>
      )}
    </View>
  );
};
