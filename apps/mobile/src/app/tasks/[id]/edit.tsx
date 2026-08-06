import React, { useEffect } from "react";
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
      Alert.alert("Success", "Task updated successfully!");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Failed to update task");
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

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-4 py-4 space-y-6">
        {/* Section 1: Basic Details */}
        <View className="space-y-3">
          <View className="flex-row items-center gap-2 pb-1 border-b border-slate-200/50 dark:border-slate-800">
            <FileText size={16} color="#2563eb" />
            <Text className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-slate-900"}`}>
              Task Basics
            </Text>
          </View>

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Task Title *"
                placeholder="Task title"
                value={value}
                onChangeText={onChange}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Description"
                placeholder="Description..."
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={4}
                style={{ height: 90, textAlignVertical: "top" }}
              />
            )}
          />
        </View>

        {/* Section 2: Classification */}
        <View className="space-y-3">
          <View className="flex-row items-center gap-2 pb-1 border-b border-slate-200/50 dark:border-slate-800">
            <Sliders size={16} color="#2563eb" />
            <Text className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-slate-900"}`}>
              Classification & Priority
            </Text>
          </View>

          <Text className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Status
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {Object.values(TaskStatus).map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setValue("status", s)}
                className={`px-3 py-1.5 rounded-full border ${
                  selectedStatus === s
                    ? "bg-blue-600 border-blue-600"
                    : isDark
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <Text className={`text-xs font-bold ${selectedStatus === s ? "text-white" : isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className={`text-xs font-bold uppercase tracking-wider pt-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Priority
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {Object.values(TaskPriority).map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setValue("priority", p)}
                className={`px-3 py-1.5 rounded-full border ${
                  selectedPriority === p
                    ? "bg-amber-600 border-amber-600"
                    : isDark
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <Text className={`text-xs font-bold ${selectedPriority === p ? "text-white" : isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className={`text-xs font-bold uppercase tracking-wider pt-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Category
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {Object.values(TaskCategory).map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setValue("category", c)}
                className={`px-3 py-1.5 rounded-full border ${
                  selectedCategory === c
                    ? "bg-blue-600 border-blue-600"
                    : isDark
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <Text className={`text-xs font-bold ${selectedCategory === c ? "text-white" : isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section 3: Scheduling */}
        <View className="space-y-3">
          <View className="flex-row items-center gap-2 pb-1 border-b border-slate-200/50 dark:border-slate-800">
            <Calendar size={16} color="#2563eb" />
            <Text className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-slate-900"}`}>
              Schedule & Reminders
            </Text>
          </View>

          <Controller
            control={control}
            name="dueDate"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Due Date (YYYY-MM-DD)"
                placeholder="2026-08-15"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="reminderAt"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Reminder Timestamp (YYYY-MM-DD HH:mm)"
                placeholder="2026-08-15 09:30"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        <AppButton
          title="Update Task"
          onPress={handleSubmit(onSubmit)}
          isLoading={updateTaskMutation.isPending}
          size="lg"
          className="mt-4"
        />
      </ScrollView>
    </View>
  );
}
