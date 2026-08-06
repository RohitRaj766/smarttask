import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../theme/theme.context";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react-native";

export interface AppAlertModalProps {
  visible: boolean;
  onClose: () => void;
  type?: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const AppAlertModal: React.FC<AppAlertModalProps> = ({
  visible,
  onClose,
  type = "info",
  title,
  message,
  confirmText = "OK",
  cancelText,
  onConfirm,
  onCancel,
  isDestructive = false,
  isLoading = false,
}) => {
  const { isDark } = useTheme();
  const [internalLoading, setInternalLoading] = useState(false);

  if (!visible) return null;

  const loadingState = isLoading || internalLoading;

  const getIconAndColors = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle2 size={32} color="#10b981" />,
          badgeBg: isDark ? "rgba(6, 78, 59, 0.5)" : "#ecfdf5",
          badgeBorder: isDark ? "#065f46" : "#a7f3d0",
          btnBg: "#059669",
        };
      case "error":
        return {
          icon: <AlertCircle size={32} color="#ef4444" />,
          badgeBg: isDark ? "rgba(127, 29, 29, 0.5)" : "#fef2f2",
          badgeBorder: isDark ? "#991b1b" : "#fecaca",
          btnBg: "#dc2626",
        };
      case "warning":
        return {
          icon: <AlertTriangle size={32} color="#f59e0b" />,
          badgeBg: isDark ? "rgba(120, 53, 15, 0.5)" : "#fffbeb",
          badgeBorder: isDark ? "#92400e" : "#fde68a",
          btnBg: "#d97706",
        };
      case "info":
      default:
        return {
          icon: <Info size={32} color="#2563eb" />,
          badgeBg: isDark ? "rgba(30, 58, 138, 0.5)" : "#eff6ff",
          badgeBorder: isDark ? "#1e40af" : "#bfdbfe",
          btnBg: "#2563eb",
        };
    }
  };

  const config = getIconAndColors();

  const handleConfirm = async () => {
    if (loadingState) return;
    if (onConfirm) {
      try {
        setInternalLoading(true);
        await onConfirm();
      } finally {
        setInternalLoading(false);
      }
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    if (loadingState) return;
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!loadingState) onClose();
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          paddingHorizontal: 20,
        }}
      >
        {/* Backdrop Dismiss Overlay */}
        <Pressable
          onPress={() => {
            if (!loadingState) onClose();
          }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Modal Card Container */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 340,
            borderRadius: 24,
            padding: 24,
            alignItems: "center",
            backgroundColor: isDark ? "#0f172a" : "#ffffff",
            borderWidth: 1,
            borderColor: isDark ? "#1e293b" : "#f1f5f9",
            elevation: 20,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.35,
            shadowRadius: 20,
            zIndex: 100,
          }}
        >
          {/* Icon Badge */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              marginBottom: 16,
              backgroundColor: config.badgeBg,
              borderColor: config.badgeBorder,
            }}
          >
            {config.icon}
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              textAlign: "center",
              marginBottom: 8,
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            {title}
          </Text>

          {/* Message */}
          {message ? (
            <Text
              style={{
                fontSize: 13,
                lineHeight: 18,
                textAlign: "center",
                marginBottom: 24,
                color: isDark ? "#94a3b8" : "#64748b",
              }}
            >
              {message}
            </Text>
          ) : (
            <View style={{ marginBottom: 16 }} />
          )}

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, width: "100%" }}>
            {cancelText ? (
              <TouchableOpacity
                onPress={handleCancel}
                disabled={loadingState}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: isDark ? "#1e293b" : "#e2e8f0",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: loadingState ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: isDark ? "#cbd5e1" : "#334155",
                  }}
                >
                  {cancelText}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={loadingState}
              activeOpacity={0.7}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 16,
                backgroundColor: isDestructive ? "#dc2626" : config.btnBg,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
                opacity: loadingState ? 0.8 : 1,
              }}
            >
              {loadingState ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : null}
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                {loadingState ? "Processing..." : confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
};
