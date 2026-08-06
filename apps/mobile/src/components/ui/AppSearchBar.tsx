import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Search, X } from "lucide-react-native";
import { useTheme } from "../../theme/theme.context";

export interface AppSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const AppSearchBar: React.FC<AppSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search tasks...",
  onClear,
}) => {
  const { isDark } = useTheme();

  return (
    <View
      className={`flex-row items-center px-3.5 py-2.5 rounded-xl border ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200/80"
      }`}
    >
      <Search size={18} color={isDark ? "#94a3b8" : "#64748b"} className="mr-2" />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
        className={`flex-1 text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText("");
            onClear?.();
          }}
          className="p-1 rounded-full bg-slate-200 dark:bg-slate-800"
        >
          <X size={14} color={isDark ? "#cbd5e1" : "#64748b"} />
        </TouchableOpacity>
      )}
    </View>
  );
};
