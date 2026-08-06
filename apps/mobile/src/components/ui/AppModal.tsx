import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X } from "lucide-react-native";
import { useTheme } from "../../theme/theme.context";

export interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const AppModal: React.FC<AppModalProps> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  const { isDark } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/60 sm:justify-center p-0 sm:p-4">
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              className={`w-full rounded-t-3xl sm:rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800 ${
                isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"
              }`}
            >
              <View className="flex-row items-center justify-between pb-3 mb-2 border-b border-slate-200/60 dark:border-slate-800">
                <Text className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {title || ""}
                </Text>
                <TouchableOpacity onPress={onClose} className="p-1 rounded-full bg-slate-100 dark:bg-slate-800">
                  <X size={18} color={isDark ? "#cbd5e1" : "#64748b"} />
                </TouchableOpacity>
              </View>

              <View>{children}</View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};
