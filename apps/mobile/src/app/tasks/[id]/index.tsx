import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../../theme/theme.context";
import { useTaskDetails, useDeleteTask, useUpdateTask } from "../../../hooks/useTasks";
import { AppHeader } from "../../../components/ui/AppHeader";
import { AppBadge } from "../../../components/ui/AppBadge";
import { AppCard } from "../../../components/ui/AppCard";
import { AppButton } from "../../../components/ui/AppButton";
import { AppAlertModal } from "../../../components/ui/AppAlertModal";
import { TaskPriority, TaskStatus } from "../../../types";
import { FileText, Calendar, Bell, Clock, Edit3, Trash2, CheckCircle, Tag } from "lucide-react-native";

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const taskId = id as string;
  const { isDark } = useTheme();
  const router = useRouter();

  const { data: taskData, isLoading } = useTaskDetails(taskId);
  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState<string | null>(null);

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

  const confirmToggleStatus = async () => {
    if (!task) return;
    setIsStatusModalOpen(false);
    const newStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED;
    try {
      await updateTaskMutation.mutateAsync({ taskId: task._id, payload: { status: newStatus } });
    } catch {
      setErrorAlertMessage("Failed to update task status");
    }
  };

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false);
    try {
      await deleteTaskMutation.mutateAsync(taskId);
      router.back();
    } catch {
      setErrorAlertMessage("Failed to delete task");
    }
  };

  if (isLoading || !task) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const isCompleted = task.status === TaskStatus.COMPLETED;

  return (
    <View className={`flex-1 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <AppHeader
        title="Task Overview"
        subtitle="Detailed metadata & schedule"
        showBack
        rightAction={
          <TouchableOpacity
            onPress={() => setIsDeleteModalOpen(true)}
            className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200/50 dark:border-red-900/40"
          >
            <Trash2 size={18} color="#ef4444" />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 50 }} className="px-4 py-4">
        {/* Title & Badges Section */}
        <View className="mb-5">
          <View className="flex-row items-center gap-2 mb-2.5">
            <Tag size={16} color="#2563eb" />
            <Text className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Task Info & Classification
            </Text>
          </View>

          <AppCard className="p-5 space-y-4">
            <View className="mb-3">
              <Text className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Task Title
              </Text>
              <Text className={`text-2xl font-extrabold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                {task.title}
              </Text>
            </View>

            <View className="pt-3 border-t border-slate-100 dark:border-slate-800 flex-row flex-wrap items-center justify-between gap-y-3">
              <View>
                <Text className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Category
                </Text>
                <AppBadge label={task.category} variant="outline" />
              </View>

              <View>
                <Text className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Priority
                </Text>
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
              </View>

              <View>
                <Text className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Status
                </Text>
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
            </View>
          </AppCard>
        </View>

        {/* Description Section */}
        <View className="mb-5">
          <View className="flex-row items-center gap-2 mb-2.5">
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
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-2.5">
            <Clock size={16} color="#2563eb" />
            <Text className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Schedule & Timestamps
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-3">
            <AppCard className="w-[48%] p-3.5 space-y-1">
              <View className="flex-row items-center gap-1.5 mb-1">
                <Calendar size={14} color="#64748b" />
                <Text className={`text-[10px] font-bold uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Due Date
                </Text>
              </View>
              <Text className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {formatDate(task.dueDate)}
              </Text>
            </AppCard>

            <AppCard className="w-[48%] p-3.5 space-y-1">
              <View className="flex-row items-center gap-1.5 mb-1">
                <Bell size={14} color="#f59e0b" />
                <Text className={`text-[10px] font-bold uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Reminder
                </Text>
              </View>
              <Text className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {formatDateTime(task.reminderAt)}
              </Text>
            </AppCard>

            <AppCard className="w-[48%] p-3.5 space-y-1">
              <View className="flex-row items-center gap-1.5 mb-1">
                <Clock size={14} color="#64748b" />
                <Text className={`text-[10px] font-bold uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Created At
                </Text>
              </View>
              <Text className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {formatDateTime(task.createdAt)}
              </Text>
            </AppCard>

            <AppCard className="w-[48%] p-3.5 space-y-1">
              <View className="flex-row items-center gap-1.5 mb-1">
                <Clock size={14} color="#64748b" />
                <Text className={`text-[10px] font-bold uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
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
        <View className="pt-2 gap-3">
          <AppButton
            title={isCompleted ? "Mark as Pending" : "Mark as Completed"}
            variant="outline"
            leftIcon={<CheckCircle size={18} color={isDark ? "#e2e8f0" : "#0f172a"} />}
            onPress={() => setIsStatusModalOpen(true)}
            isLoading={updateTaskMutation.isPending}
          />

          <AppButton
            title="Edit Task Attributes"
            leftIcon={<Edit3 size={18} color="#ffffff" />}
            onPress={() => router.push(`/tasks/${task._id}/edit`)}
          />
        </View>
      </ScrollView>

      {/* Confirmation Modal for Status Toggle */}
      <AppAlertModal
        visible={isStatusModalOpen}
        type={isCompleted ? "warning" : "success"}
        title={isCompleted ? "Mark as Pending?" : "Complete Task?"}
        message={
          isCompleted
            ? "Are you sure you want to revert this task status back to pending?"
            : "Are you sure you want to mark this task as completed?"
        }
        confirmText={isCompleted ? "Revert to Pending" : "Yes, Mark Completed"}
        cancelText="Cancel"
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={confirmToggleStatus}
      />

      {/* Confirmation Modal for Delete */}
      <AppAlertModal
        visible={isDeleteModalOpen}
        type="warning"
        title="Delete Task?"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDestructive
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      {/* Error Alert Modal */}
      <AppAlertModal
        visible={!!errorAlertMessage}
        type="error"
        title="Action Error"
        message={errorAlertMessage || ""}
        onClose={() => setErrorAlertMessage(null)}
      />
    </View>
  );
}
