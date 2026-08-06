import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "../../../theme/theme.context";
import { useTaskDetails, useUpdateTask } from "../../../hooks/useTasks";
import { AppHeader } from "../../../components/ui/AppHeader";
import { AppInput } from "../../../components/ui/AppInput";
import { AppButton } from "../../../components/ui/AppButton";
import { AppCard } from "../../../components/ui/AppCard";
import { AppDatePicker } from "../../../components/ui/AppDatePicker";
import { AppAlertModal } from "../../../components/ui/AppAlertModal";
import { TaskStatus, TaskPriority, TaskCategory } from "../../../types";
import { Edit3, FileText, Sliders, Calendar } from "lucide-react-native";

const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title must be under 150 characters"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  category: z.nativeEnum(TaskCategory),
  dueDate: z.string().optional(),
  reminderAt: z.string().optional(),
});

type TaskFormValues = z.infer<typeof updateTaskSchema>;

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const taskId = id as string;
  const { isDark } = useTheme();
  const router = useRouter();

  const { data: taskData, isLoading: isFetching } = useTaskDetails(taskId);
  const updateTaskMutation = useUpdateTask();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(updateTaskSchema),
  });

  const selectedStatus = watch("status");
  const selectedPriority = watch("priority");
  const selectedCategory = watch("category");

  useEffect(() => {
    if (taskData?.data) {
      const task = taskData.data;
      reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
        reminderAt: task.reminderAt ? new Date(task.reminderAt).toISOString().slice(0, 16).replace("T", " ") : "",
      });
    }
  }, [taskData, reset]);

  const formatLabel = (str: string) => {
    return str
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });

  const onSubmit = async (data: TaskFormValues) => {
    try {
      await updateTaskMutation.mutateAsync({
        taskId,
        payload: {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
          reminderAt: data.reminderAt ? new Date(data.reminderAt).toISOString() : null,
        },
      });
      router.replace("/(tabs)/tasks");
    } catch (err: any) {
      setAlertConfig({
        visible: true,
        type: "error",
        title: "Update Error",
        message: err?.response?.data?.message || err?.message || "Failed to update task",
      });
    }
  };

  if (isFetching) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <AppHeader title="Edit Task" subtitle="Update task attributes & schedule" showBack />

      <ScrollView contentContainerStyle={{ paddingBottom: 50 }} className="px-4 py-4 space-y-4">
        {/* Section 1: Basic Details Card */}
        <AppCard className="p-4 mb-4">
          <View className="flex-row items-center gap-2.5 pb-2.5 mb-4 border-b border-slate-100 dark:border-slate-800">
            <View className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60">
              <FileText size={16} color="#2563eb" />
            </View>
            <Text className={`text-sm font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
              Task Details
            </Text>
          </View>

          <View className="space-y-4">
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <View className="mb-3">
                  <AppInput
                    label="Task Title *"
                    placeholder="Task title"
                    value={value}
                    onChangeText={onChange}
                    error={errors.title?.message}
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <View className="mb-1">
                  <AppInput
                    label="Description"
                    placeholder="Description..."
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                    style={{ height: 85, textAlignVertical: "top" }}
                  />
                </View>
              )}
            />
          </View>
        </AppCard>

        {/* Section 2: Classification & Priority Card */}
        <AppCard className="p-4 mb-4">
          <View className="flex-row items-center gap-2.5 pb-2.5 mb-4 border-b border-slate-100 dark:border-slate-800">
            <View className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60">
              <Sliders size={16} color="#d97706" />
            </View>
            <Text className={`text-sm font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
              Status & Classification
            </Text>
          </View>

          {/* Status Selection */}
          <View className="mb-4">
            <Text className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Status
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {Object.values(TaskStatus).map((s) => {
                const isActive = selectedStatus === s;
                let bgActive = "bg-blue-600 border-blue-600";
                if (s === TaskStatus.COMPLETED) bgActive = "bg-emerald-600 border-emerald-600";
                if (s === TaskStatus.IN_PROGRESS) bgActive = "bg-amber-600 border-amber-600";

                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setValue("status", s)}
                    className={`px-3 py-2 rounded-xl border ${
                      isActive
                        ? bgActive
                        : isDark
                        ? "bg-slate-800/80 border-slate-700/80"
                        : "bg-slate-100/70 border-slate-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isActive ? "text-white" : isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      {formatLabel(s)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Priority Selection */}
          <View className="mb-4">
            <Text className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Priority Level
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {Object.values(TaskPriority).map((p) => {
                const isActive = selectedPriority === p;
                let bgActive = "bg-slate-600 border-slate-600";
                if (p === TaskPriority.HIGH) bgActive = "bg-red-600 border-red-600";
                if (p === TaskPriority.MEDIUM) bgActive = "bg-amber-600 border-amber-600";

                return (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setValue("priority", p)}
                    className={`px-3.5 py-2 rounded-xl border ${
                      isActive
                        ? bgActive
                        : isDark
                        ? "bg-slate-800/80 border-slate-700/80"
                        : "bg-slate-100/70 border-slate-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isActive ? "text-white" : isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      {formatLabel(p)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Category Selection */}
          <View className="mb-1">
            <Text className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Category
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {Object.values(TaskCategory).map((c) => {
                const isActive = selectedCategory === c;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setValue("category", c)}
                    className={`px-3 py-2 rounded-xl border ${
                      isActive
                        ? "bg-blue-600 border-blue-600"
                        : isDark
                        ? "bg-slate-800/80 border-slate-700/80"
                        : "bg-slate-100/70 border-slate-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isActive ? "text-white" : isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      {formatLabel(c)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </AppCard>

        {/* Section 3: Schedule & Reminders Card */}
        <AppCard className="p-4 mb-4">
          <View className="flex-row items-center gap-2.5 pb-2.5 mb-4 border-b border-slate-100 dark:border-slate-800">
            <View className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60">
              <Calendar size={16} color="#10b981" />
            </View>
            <Text className={`text-sm font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
              Schedule & Reminders
            </Text>
          </View>

          <Controller
            control={control}
            name="dueDate"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <AppDatePicker
                  label="Due Date"
                  placeholder="Select due date"
                  mode="date"
                  value={value}
                  onChange={onChange}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="reminderAt"
            render={({ field: { onChange, value } }) => (
              <View className="mb-1">
                <AppDatePicker
                  label="Reminder Timestamp"
                  placeholder="Select reminder date & time"
                  mode="datetime"
                  value={value}
                  onChange={onChange}
                />
              </View>
            )}
          />
        </AppCard>

        {/* Submit Button */}
        <View className="pt-2">
          <AppButton
            title="Update Task"
            onPress={handleSubmit(onSubmit)}
            isLoading={updateTaskMutation.isPending}
            size="lg"
            leftIcon={<Edit3 size={18} color="#ffffff" />}
          />
        </View>
      </ScrollView>

      {/* Modern Alert Modal */}
      {alertConfig.visible && (
        <AppAlertModal
          visible={alertConfig.visible}
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
          onConfirm={() => {
            if (alertConfig.onConfirm) {
              alertConfig.onConfirm();
            } else {
              setAlertConfig((prev) => ({ ...prev, visible: false }));
            }
          }}
        />
      )}
    </View>
  );
}
