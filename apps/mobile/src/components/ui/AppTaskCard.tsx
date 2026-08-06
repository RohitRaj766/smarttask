import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ITask, TaskPriority, TaskStatus } from "../../types";
import { AppCard } from "./AppCard";
import { AppBadge } from "./AppBadge";
import { Calendar, Bell, MoreVertical } from "lucide-react-native";
import { useTheme } from "../../theme/theme.context";

export interface AppTaskCardProps {
  task: ITask;
  onPress?: () => void;
  onMorePress?: () => void;
}

export const AppTaskCard: React.FC<AppTaskCardProps> = ({
  task,
  onPress,
  onMorePress,
}) => {
  const { isDark } = useTheme();

  const getPriorityVariant = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "danger";
      case TaskPriority.MEDIUM:
        return "warning";
      case TaskPriority.LOW:
      default:
        return "secondary";
    }
  };

  const getStatusVariant = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return "success";
      case TaskStatus.IN_PROGRESS:
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={{ marginBottom: 12 }}>
      <AppCard style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 16,
                fontWeight: "700",
                lineHeight: 22,
                color: isDark ? "#ffffff" : "#0f172a",
                marginBottom: task.description ? 4 : 0,
              }}
            >
              {task.title}
            </Text>

            {task.description ? (
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 12,
                  color: isDark ? "#94a3b8" : "#64748b",
                }}
              >
                {task.description}
              </Text>
            ) : null}
          </View>

          {onMorePress && (
            <TouchableOpacity onPress={onMorePress} activeOpacity={0.7} style={{ padding: 4, borderRadius: 8 }}>
              <MoreVertical size={18} color={isDark ? "#94a3b8" : "#64748b"} />
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            paddingTop: 10,
            marginTop: 10,
            borderTopWidth: 1,
            borderTopColor: isDark ? "#1e293b" : "#f1f5f9",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <AppBadge label={task.category} variant="outline" size="sm" />
            <AppBadge label={task.priority} variant={getPriorityVariant(task.priority)} size="sm" />
            <AppBadge label={task.status} variant={getStatusVariant(task.status)} size="sm" />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            {task.dueDate && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Calendar size={12} color={isDark ? "#94a3b8" : "#64748b"} />
                <Text style={{ fontSize: 11, fontWeight: "500", color: isDark ? "#94a3b8" : "#64748b" }}>
                  {formatDate(task.dueDate)}
                </Text>
              </View>
            )}

            {task.reminderAt && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Bell size={12} color="#f59e0b" />
              </View>
            )}
          </View>
        </View>
      </AppCard>
    </TouchableOpacity>
  );
};
