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
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} className="mb-3">
      <AppCard className="p-4 space-y-3">
        <View className="flex-row items-start justify-between gap-2">
          <View className="flex-1 pr-2 space-y-1">
            <Text
              className={`text-base font-bold leading-snug ${
                isDark ? "text-white" : "text-slate-900"
              }`}
              numberOfLines={2}
            >
              {task.title}
            </Text>

            {task.description ? (
              <Text
                className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
                numberOfLines={2}
              >
                {task.description}
              </Text>
            ) : null}
          </View>

          {onMorePress && (
            <TouchableOpacity onPress={onMorePress} className="p-1 rounded-lg">
              <MoreVertical size={18} color={isDark ? "#94a3b8" : "#64748b"} />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <View className="flex-row items-center gap-1.5">
            <AppBadge label={task.category} variant="outline" size="sm" />
            <AppBadge label={task.priority} variant={getPriorityVariant(task.priority)} size="sm" />
            <AppBadge label={task.status} variant={getStatusVariant(task.status)} size="sm" />
          </View>

          <View className="flex-row items-center gap-3">
            {task.dueDate && (
              <View className="flex-row items-center gap-1">
                <Calendar size={12} color={isDark ? "#94a3b8" : "#64748b"} />
                <Text className={`text-[11px] font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {formatDate(task.dueDate)}
                </Text>
              </View>
            )}

            {task.reminderAt && (
              <View className="flex-row items-center gap-1">
                <Bell size={12} color="#f59e0b" />
              </View>
            )}
          </View>
        </View>
      </AppCard>
    </TouchableOpacity>
  );
};
