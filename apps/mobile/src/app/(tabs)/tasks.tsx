import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../theme/theme.context";
import { useTasks, useDeleteTask, useUpdateTask } from "../../hooks/useTasks";
import { AppSearchBar } from "../../components/ui/AppSearchBar";
import { AppTaskCard } from "../../components/ui/AppTaskCard";
import { AppSkeleton } from "../../components/ui/AppSkeleton";
import { AppEmptyState } from "../../components/ui/AppEmptyState";
import { AppModal } from "../../components/ui/AppModal";
import { AppButton } from "../../components/ui/AppButton";
import { ITask, TaskStatus, TaskPriority, TaskCategory, ITaskQueryParams } from "../../types";
import { Plus, Eye, Edit3, Trash2, CheckCircle, SlidersHorizontal } from "lucide-react-native";

export default function TasksScreen() {
  const { isDark } = useTheme();
  const router = useRouter();

  const [params, setParams] = useState<ITaskQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    status: undefined,
    priority: undefined,
    category: undefined,
    sortBy: "createdAt",
    order: "desc",
  });

  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const { data: tasksData, isLoading, isFetching, refetch } = useTasks(params);
  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();

  const tasks = tasksData?.data?.items || [];
  const meta = tasksData?.data?.meta || { total: 0, page: 1, totalPages: 1 };

  const handleSearchChange = (text: string) => {
    setParams((prev) => ({ ...prev, search: text, page: 1 }));
  };

  const handleStatusFilter = (status?: TaskStatus) => {
    setParams((prev) => ({ ...prev, status: prev.status === status ? undefined : status, page: 1 }));
  };

  const handlePriorityFilter = (priority?: TaskPriority) => {
    setParams((prev) => ({ ...prev, priority: prev.priority === priority ? undefined : priority, page: 1 }));
  };

  const handleToggleTaskStatus = async (task: ITask) => {
    const newStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED;
    try {
      await updateTaskMutation.mutateAsync({ taskId: task._id, payload: { status: newStatus } });
      setIsActionModalOpen(false);
    } catch {
      Alert.alert("Error", "Failed to update task status");
    }
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTaskMutation.mutateAsync(taskId);
            setIsActionModalOpen(false);
          } catch {
            Alert.alert("Error", "Failed to delete task");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={["top"]} className={`flex-1 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      {/* Top Search & Filter Bar */}
      <View className="px-4 pt-3 pb-2 space-y-3">
        <View className="flex-row items-center justify-between">
          <Text className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Task Directory
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/tasks/new")}
            className="w-10 h-10 rounded-full bg-blue-600 items-center justify-center shadow-md shadow-blue-500/30"
          >
            <Plus size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <AppSearchBar
          value={params.search || ""}
          onChangeText={handleSearchChange}
          placeholder="Search by title or description..."
        />

        {/* Horizontal Status Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 pt-1 pb-1">
          <TouchableOpacity
            onPress={() => setParams((prev) => ({ ...prev, status: undefined, priority: undefined }))}
            className={`px-3.5 py-1.5 rounded-full border ${
              !params.status && !params.priority
                ? "bg-blue-600 border-blue-600"
                : isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                !params.status && !params.priority
                  ? "text-white"
                  : isDark
                  ? "text-slate-300"
                  : "text-slate-700"
              }`}
            >
              All Tasks
            </Text>
          </TouchableOpacity>

          {Object.values(TaskStatus).map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => handleStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-full border ${
                params.status === s
                  ? "bg-blue-600 border-blue-600"
                  : isDark
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  params.status === s ? "text-white" : isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}

          {Object.values(TaskPriority).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => handlePriorityFilter(p)}
              className={`px-3.5 py-1.5 rounded-full border ${
                params.priority === p
                  ? "bg-amber-600 border-amber-600"
                  : isDark
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  params.priority === p ? "text-white" : isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Task List */}
      {isLoading ? (
        <View className="px-4 py-3 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <AppSkeleton key={i} width="100%" height={95} borderRadius={16} />
          ))}
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80, paddingTop: 6 }}
          refreshing={isFetching}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <AppTaskCard
              task={item}
              onPress={() => router.push(`/tasks/${item._id}`)}
              onMorePress={() => {
                setSelectedTask(item);
                setIsActionModalOpen(true);
              }}
            />
          )}
          ListEmptyComponent={
            <AppEmptyState
              title="No Tasks Found"
              description="Try adjusting your active search keywords or status/priority filters."
              actionTitle="Clear Filters"
              onAction={() =>
                setParams((prev) => ({
                  ...prev,
                  search: "",
                  status: undefined,
                  priority: undefined,
                  category: undefined,
                }))
              }
            />
          }
        />
      )}

      {/* Task Actions Bottom Sheet Modal */}
      {selectedTask && (
        <AppModal
          visible={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          title={selectedTask.title}
        >
          <View className="space-y-2 py-2">
            <TouchableOpacity
              onPress={() => {
                setIsActionModalOpen(false);
                router.push(`/tasks/${selectedTask._id}`);
              }}
              className="flex-row items-center gap-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              <Eye size={18} color="#2563eb" />
              <Text className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                View Details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleToggleTaskStatus(selectedTask)}
              className="flex-row items-center gap-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              <CheckCircle size={18} color="#10b981" />
              <Text className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {selectedTask.status === TaskStatus.COMPLETED ? "Mark as Pending" : "Mark as Completed"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsActionModalOpen(false);
                router.push(`/tasks/${selectedTask._id}/edit`);
              }}
              className="flex-row items-center gap-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              <Edit3 size={18} color="#f59e0b" />
              <Text className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Edit Task Attributes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDeleteTask(selectedTask._id)}
              className="flex-row items-center gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40"
            >
              <Trash2 size={18} color="#ef4444" />
              <Text className="text-sm font-bold text-red-600 dark:text-red-400">
                Delete Task
              </Text>
            </TouchableOpacity>
          </View>
        </AppModal>
      )}
    </SafeAreaView>
  );
}
