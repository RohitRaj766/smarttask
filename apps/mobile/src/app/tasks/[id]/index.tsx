import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../../theme/theme.context";
import { useTaskDetails, useDeleteTask, useUpdateTask } from "../../../hooks/useTasks";
import { AppHeader } from "../../../components/ui/AppHeader";
import { AppBadge } from "../../../components/ui/AppBadge";
import { AppCard } from "../../../components/ui/AppCard";
import { AppButton } from "../../../components/ui/AppButton";
import { TaskPriority, TaskStatus } from "../../../types";
import { FileText, Calendar, Bell, Clock, Edit3, Trash2, CheckCircle } from "lucide-react-native";

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const taskId = id as string;
  const { isDark } = useTheme();
  const router = useRouter();

  const { data: taskData, isLoading } = useTaskDetails(taskId);
  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();

  const task = taskData?.data;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleToggleStatus = async () => {
    if (!task) return;
    const newStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED;
    try {
      await updateTaskMutation.mutateAsync({ taskId: task._id, payload: { status: newStatus } });
      Alert.alert("Success", "Task status updated!");
    } catch {
      Alert.alert("Error", "Failed to update status");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTaskMutation.mutateAsync(taskId);
            router.back();
          } catch {
            Alert.alert("Error", "Failed to delete task");
          }
        },
      },
    ]);
  };

  if (isLoading || !task) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <AppHeader
        title="Task Overview"
        subtitle="Detailed metadata & schedule"
        showBack
        rightAction={
          <TouchableOpacity onPress={handleDelete} className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50">
            <Trash2 size={18} color="#ef4444" />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-4 py-4 space-y-6">
        {/* Title Card */}
        <AppCard className="space-y-3 p-5">
          <Text className={`text-2xl font-extrabold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            {task.title}
          </Text>

          <View className="flex-row flex-wrap items-center gap-2 pt-1">
            <AppBadge label={task.category} variant="outline" />
            <AppBadge
              label={task.priority}
              variant={
                task.priority === TaskPriority.HIGH
                  ? "danger"
                  : task.priority === TaskPriority.MEDIUM
                  ? "warning"
                  : "secondary"
              }
            />
            <AppBadge
              label={task.status}
              variant={
                task.status === TaskStatus.COMPLETED
                  ? "success"
                  : task.status === TaskStatus.IN_PROGRESS
                  ? "warning"
                  : "default"
              }
            />
          </View>
        </AppCard>

        {/* Description Section */}
        <View className="space-y-2">
          <View className="flex-row items-center gap-2">
            <FileText size={16} color="#2563eb" />
            <Text className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Task Description
            </Text>
          </View>

          <AppCard className="p-4">
            <Text className={`text-sm leading-relaxed ${isDark ? "text-slate-200" : "text-slate-700"}`}>
              {task.description || "No description provided for this task."}
            </Text>
          </AppCard>
        </View>

        {/* Scheduling & Timestamps Section */}
        <View className="space-y-2">
          <View className="flex-row items-center gap-2">
            <Clock size={16} color="#2563eb" />
            <Text className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Schedule & Timestamps
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-2.5">
            <AppCard className="w-[48%] p-3 space-y-1">
              <View className="flex-row items-center gap-1.5">
                <Calendar size={14} color="#64748b" />
                <Text className={`text-[10px] font-bold uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Due Date
                </Text>
              </View>
              <Text className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {formatDate(task.dueDate)}
              </Text>
            </AppCard>

            <AppCard className="w-[48%] p-3 space-y-1">
              <View className="flex-row items-center gap-1.5">
                <Bell size={14} color="#f59e0b" />
                <Text className={`text-[10px] font-bold uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Reminder
                </Text>
              </View>
              <Text className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {formatDateTime(task.reminderAt)}
              </Text>
            </AppCard>

            <AppCard className="w-[48%] p-3 space-y-1">
              <View className="flex-row items-center gap-1.5">
                <Clock size={14} color="#64748b" />
                <Text className={`text-[10px] font-bold uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Created At
                </Text>
              </View>
              <Text className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {formatDateTime(task.createdAt)}
              </Text>
            </AppCard>

            <AppCard className="w-[48%] p-3 space-y-1">
              <View className="flex-row items-center gap-1.5">
                <Clock size={14} color="#64748b" />
                <Text className={`text-[10px] font-bold uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Updated At
                </Text>
              </View>
              <Text className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {formatDateTime(task.updatedAt)}
              </Text>
            </AppCard>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-2 pt-2">
          <AppButton
            title={task.status === TaskStatus.COMPLETED ? "Mark as Pending" : "Mark as Completed"}
            variant="outline"
            leftIcon={<CheckCircle size={18} color={isDark ? "#e2e8f0" : "#0f172a"} />}
            onPress={handleToggleStatus}
            isLoading={updateTaskMutation.isPending}
          />

          <AppButton
            title="Edit Task Attributes"
            leftIcon={<Edit3 size={18} color="#ffffff" />}
            onPress={() => router.push(`/tasks/${task._id}/edit`)}
          />
        </View>
      </ScrollView>
    </View>
  );
}
