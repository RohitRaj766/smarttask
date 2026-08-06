import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { X } from "lucide-react-native";
import { useTheme } from "../../theme/theme.context";

export interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const AppModal: React.FC<AppModalProps> = ({
  visible,
  onClose,
  title,
  isLoading = false,
  children,
}) => {
  const { isDark } = useTheme();

  if (!visible) return null;

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!isLoading) onClose();
      }}
    >
      <View style={StyleSheet.absoluteFillObject}>
        {/* Dark Backdrop */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (!isLoading) onClose();
          }}
          style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0, 0, 0, 0.65)" }]}
        />

        {/* Bottom Sheet Container */}
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{
              width: "100%",
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: 20,
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: isDark ? "#1e293b" : "#f1f5f9",
              elevation: 12,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: -5 },
              shadowOpacity: 0.25,
              shadowRadius: 15,
              position: "relative",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: isDark ? "#1e293b" : "#f1f5f9" }}>
              <Text style={{ flex: 1, fontSize: 18, fontWeight: "800", color: isDark ? "#ffffff" : "#0f172a" }} numberOfLines={1}>
                {title || ""}
              </Text>
              {!isLoading ? (
                <TouchableOpacity onPress={onClose} style={{ padding: 6, borderRadius: 20, backgroundColor: isDark ? "#1e293b" : "#f1f5f9" }}>
                  <X size={18} color={isDark ? "#cbd5e1" : "#64748b"} />
                </TouchableOpacity>
              ) : null}
            </View>

            <View>{children}</View>

            {/* Loading Overlay */}
            {isLoading ? (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)",
                  borderTopLeftRadius: 28,
                  borderTopRightRadius: 28,
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 200,
                  gap: 10,
                }}
              >
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={{ fontSize: 13, fontWeight: "700", color: isDark ? "#ffffff" : "#0f172a" }}>
                  Processing...
                </Text>
              </View>
            ) : null}
          </KeyboardAvoidingView>
        </View>
      </View>
    </RNModal>
  );
};
