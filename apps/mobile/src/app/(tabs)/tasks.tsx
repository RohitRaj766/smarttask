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
import { AppSkeleton, AppTaskCardSkeleton } from "../../components/ui/AppSkeleton";
import { AppEmptyState } from "../../components/ui/AppEmptyState";
import { AppModal } from "../../components/ui/AppModal";
import { AppButton } from "../../components/ui/AppButton";
import { AppAlertModal } from "../../components/ui/AppAlertModal";
import { ITask, TaskStatus, TaskPriority, TaskCategory, ITaskQueryParams } from "../../types";
import {
  Plus,
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
} from "lucide-react-native";

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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const { data: tasksData, isLoading, isFetching, refetch } = useTasks(params);
  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();

  const tasks = tasksData?.data?.items || [];
  const meta = tasksData?.data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };
  const currentPage = params.page || 1;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setParams((prev) => ({ ...prev, page: currentPage - 1 }));
    }
  };

  const handleNextPage = () => {
    if (currentPage < meta.totalPages) {
      setParams((prev) => ({ ...prev, page: currentPage + 1 }));
    }
  };

  const formatLabel = (str: string) => {
    return str
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleSearchChange = (text: string) => {
    setParams((prev) => ({ ...prev, search: text, page: 1 }));
  };

  const handleStatusFilter = (status?: TaskStatus) => {
    setParams((prev) => ({
      ...prev,
      status: prev.status === status ? undefined : status,
      page: 1,
    }));
  };

  const handlePriorityFilter = (priority?: TaskPriority) => {
    setParams((prev) => ({
      ...prev,
      priority: prev.priority === priority ? undefined : priority,
      page: 1,
    }));
  };

  const handleCategoryFilter = (category?: TaskCategory) => {
    setParams((prev) => ({
      ...prev,
      category: prev.category === category ? undefined : category,
      page: 1,
    }));
  };

  const activeFiltersCount = [
    params.status,
    params.priority,
    params.category,
    params.search ? "search" : null,
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setParams({
      page: 1,
      limit: 10,
      search: "",
      status: undefined,
      priority: undefined,
      category: undefined,
      sortBy: "createdAt",
      order: "desc",
    });
  };

  const [deleteConfirmTaskId, setDeleteConfirmTaskId] = useState<string | null>(null);
  const [errorAlertMessage, setErrorAlertMessage] = useState<string | null>(null);

  const handleToggleTaskStatus = async (task: ITask) => {
    const newStatus =
      task.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED;
    try {
      await updateTaskMutation.mutateAsync({
        taskId: task._id,
        payload: { status: newStatus },
      });
      setIsActionModalOpen(false);
    } catch {
      setErrorAlertMessage("Failed to update task status");
    }
  };

  const confirmDeleteTask = async () => {
    if (!deleteConfirmTaskId) return;
    try {
      await deleteTaskMutation.mutateAsync(deleteConfirmTaskId);
      setIsActionModalOpen(false);
      setDeleteConfirmTaskId(null);
    } catch {
      setDeleteConfirmTaskId(null);
      setErrorAlertMessage("Failed to delete task");
    }
  };

  return (
    <SafeAreaView edges={["top"]} className={`flex-1 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      {/* Header & Filter Controls Section */}
      <View className="px-4 pt-4 pb-3 space-y-4">
        {/* Title Bar */}
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Task Directory
            </Text>
            <Text className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Search, filter & manage all tasks
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/tasks/new")}
            className="w-11 h-11 rounded-2xl bg-blue-600 items-center justify-center"
          >
            <Plus size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar & Filter Modal Toggle Row */}
        <View className="flex-row items-center gap-2.5 mt-1 mb-2">
          <View className="flex-1">
            <AppSearchBar
              value={params.search || ""}
              onChangeText={handleSearchChange}
              placeholder="Search tasks..."
            />
          </View>

          <TouchableOpacity
            onPress={() => setIsFilterModalOpen(true)}
            className={`px-3.5 py-3 rounded-xl border flex-row items-center gap-1.5 ${
              activeFiltersCount > 0
                ? "bg-blue-600 border-blue-600"
                : isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            <SlidersHorizontal size={18} color={activeFiltersCount > 0 ? "#ffffff" : isDark ? "#94a3b8" : "#64748b"} />
            {activeFiltersCount > 0 ? (
              <View className="w-5 h-5 rounded-full bg-white items-center justify-center">
                <Text className="text-[10px] font-black text-blue-600">{activeFiltersCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>

        {/* Horizontal Quick Status Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 pt-1 pb-1">
          <TouchableOpacity
            onPress={() => setParams((prev) => ({ ...prev, status: undefined }))}
            className={`px-3.5 py-2 rounded-xl border ${
              !params.status
                ? "bg-blue-600 border-blue-600"
                : isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                !params.status ? "text-white" : isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              All Statuses
            </Text>
          </TouchableOpacity>

          {Object.values(TaskStatus).map((s) => {
            const isActive = params.status === s;
            return (
              <TouchableOpacity
                key={s}
                onPress={() => handleStatusFilter(s)}
                className={`px-3.5 py-2 rounded-xl border ${
                  isActive
                    ? "bg-blue-600 border-blue-600"
                    : isDark
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
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
        </ScrollView>
      </View>

      {isLoading ? (
        <View className="px-4 py-1">
          <AppTaskCardSkeleton />
          <AppTaskCardSkeleton />
          <AppTaskCardSkeleton />
          <AppTaskCardSkeleton />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 90, paddingTop: 4 }}
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
              description="Try adjusting your active search keywords or filter selections."
              actionTitle="Clear All Filters"
              onAction={handleResetFilters}
            />
          }
          ListFooterComponent={
            meta.total > 0 ? (
              <View className={`mt-6 p-4 rounded-3xl border ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80"} space-y-4`}>
                {/* Header row: Status & Prev/Next */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <View className="w-2 h-2 rounded-full bg-blue-600" />
                    <Text className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Page <Text className="font-black text-blue-600">{meta.page}</Text> of {meta.totalPages}
                    </Text>
                    <Text className={`text-[11px] font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      ({meta.total} tasks)
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      onPress={handlePrevPage}
                      disabled={currentPage <= 1}
                      activeOpacity={0.7}
                      className={`flex-row items-center gap-1 px-3 py-2 rounded-2xl border ${
                        currentPage <= 1
                          ? "opacity-30 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
                          : isDark
                          ? "bg-slate-800 border-slate-700 active:bg-slate-700"
                          : "bg-slate-100 border-slate-200 active:bg-slate-200"
                      }`}
                    >
                      <ChevronLeft size={16} color={isDark ? "#e2e8f0" : "#334155"} />
                      <Text className={`text-xs font-bold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                        Prev
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleNextPage}
                      disabled={currentPage >= meta.totalPages}
                      activeOpacity={0.7}
                      className={`flex-row items-center gap-1 px-3 py-2 rounded-2xl border ${
                        currentPage >= meta.totalPages
                          ? "opacity-30 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
                          : isDark
                          ? "bg-slate-800 border-slate-700 active:bg-slate-700"
                          : "bg-slate-100 border-slate-200 active:bg-slate-200"
                      }`}
                    >
                      <Text className={`text-xs font-bold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                        Next
                      </Text>
                      <ChevronRight size={16} color={isDark ? "#e2e8f0" : "#334155"} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Direct Page Number Quick Selector (if more than 1 page) */}
                {meta.totalPages > 1 ? (
                  <View className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className={`text-[10px] font-extrabold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Jump to Page
                      </Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-1">
                      <View className="flex-row items-center gap-2">
                        {Array.from({ length: meta.totalPages }).map((_, idx) => {
                          const pageNum = idx + 1;
                          const isCurrent = pageNum === currentPage;
                          return (
                            <TouchableOpacity
                              key={`page-${pageNum}`}
                              onPress={() => setParams((prev) => ({ ...prev, page: pageNum }))}
                              activeOpacity={0.7}
                              className={`w-10 h-10 rounded-2xl items-center justify-center border transition-all ${
                                isCurrent
                                  ? "bg-blue-600 border-blue-600"
                                  : isDark
                                  ? "bg-slate-950 border-slate-800 active:bg-slate-800"
                                  : "bg-slate-50 border-slate-200 active:bg-slate-100"
                              }`}
                            >
                              <Text
                                className={`text-xs font-black ${
                                  isCurrent ? "text-white" : isDark ? "text-slate-300" : "text-slate-700"
                                }`}
                              >
                                {pageNum}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </ScrollView>
                  </View>
                ) : null}
              </View>
            ) : null
          }
        />
      )}

      {/* Advanced Filter Sheet Modal */}
      <AppModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter & Sort Tasks"
      >
        <ScrollView style={{ maxHeight: 440, paddingVertical: 8 }} showsVerticalScrollIndicator={false}>
          {/* Status Options */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, color: isDark ? "#94a3b8" : "#64748b" }}>
              Status
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              <TouchableOpacity
                onPress={() => handleStatusFilter(undefined)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 12,
                  borderWidth: 1,
                  backgroundColor: !params.status ? "#2563eb" : isDark ? "#020617" : "#f8fafc",
                  borderColor: !params.status ? "#2563eb" : isDark ? "#1e293b" : "#e2e8f0",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: !params.status ? "#ffffff" : isDark ? "#cbd5e1" : "#334155" }}>
                  All
                </Text>
              </TouchableOpacity>
              {Object.values(TaskStatus).map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => handleStatusFilter(s)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                    borderRadius: 12,
                    borderWidth: 1,
                    backgroundColor: params.status === s ? "#2563eb" : isDark ? "#020617" : "#f8fafc",
                    borderColor: params.status === s ? "#2563eb" : isDark ? "#1e293b" : "#e2e8f0",
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "700", color: params.status === s ? "#ffffff" : isDark ? "#cbd5e1" : "#334155" }}>
                    {formatLabel(s)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Priority Options */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, color: isDark ? "#94a3b8" : "#64748b" }}>
              Priority Level
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              <TouchableOpacity
                onPress={() => handlePriorityFilter(undefined)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 12,
                  borderWidth: 1,
                  backgroundColor: !params.priority ? "#2563eb" : isDark ? "#020617" : "#f8fafc",
                  borderColor: !params.priority ? "#2563eb" : isDark ? "#1e293b" : "#e2e8f0",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: !params.priority ? "#ffffff" : isDark ? "#cbd5e1" : "#334155" }}>
                  All
                </Text>
              </TouchableOpacity>
              {Object.values(TaskPriority).map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => handlePriorityFilter(p)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                    borderRadius: 12,
                    borderWidth: 1,
                    backgroundColor: params.priority === p ? "#d97706" : isDark ? "#020617" : "#f8fafc",
                    borderColor: params.priority === p ? "#d97706" : isDark ? "#1e293b" : "#e2e8f0",
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "700", color: params.priority === p ? "#ffffff" : isDark ? "#cbd5e1" : "#334155" }}>
                    {formatLabel(p)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category Options */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, color: isDark ? "#94a3b8" : "#64748b" }}>
              Category
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              <TouchableOpacity
                onPress={() => handleCategoryFilter(undefined)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 12,
                  borderWidth: 1,
                  backgroundColor: !params.category ? "#2563eb" : isDark ? "#020617" : "#f8fafc",
                  borderColor: !params.category ? "#2563eb" : isDark ? "#1e293b" : "#e2e8f0",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: !params.category ? "#ffffff" : isDark ? "#cbd5e1" : "#334155" }}>
                  All
                </Text>
              </TouchableOpacity>
              {Object.values(TaskCategory).map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => handleCategoryFilter(c)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                    borderRadius: 12,
                    borderWidth: 1,
                    backgroundColor: params.category === c ? "#2563eb" : isDark ? "#020617" : "#f8fafc",
                    borderColor: params.category === c ? "#2563eb" : isDark ? "#1e293b" : "#e2e8f0",
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "700", color: params.category === c ? "#ffffff" : isDark ? "#cbd5e1" : "#334155" }}>
                    {formatLabel(c)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort By & Order Options */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, color: isDark ? "#94a3b8" : "#64748b" }}>
              Sort Order
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={() =>
                  setParams((prev) => ({
                    ...prev,
                    order: prev.order === "desc" ? "asc" : "desc",
                  }))
                }
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: isDark ? "#020617" : "#f8fafc",
                  borderColor: isDark ? "#1e293b" : "#e2e8f0",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <ArrowUpDown size={16} color="#2563eb" />
                  <Text style={{ fontSize: 12, fontWeight: "700", color: isDark ? "#ffffff" : "#0f172a" }}>
                    {params.order === "desc" ? "Newest / High First" : "Oldest / Low First"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Items Per Page Option */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, color: isDark ? "#94a3b8" : "#64748b" }}>
              Tasks Per Page
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {[10, 20, 50].map((limitVal) => (
                <TouchableOpacity
                  key={`limit-${limitVal}`}
                  onPress={() => setParams((prev) => ({ ...prev, limit: limitVal, page: 1 }))}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 12,
                    alignItems: "center",
                    borderWidth: 1,
                    backgroundColor: params.limit === limitVal ? "#2563eb" : isDark ? "#020617" : "#f8fafc",
                    borderColor: params.limit === limitVal ? "#2563eb" : isDark ? "#1e293b" : "#e2e8f0",
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "700", color: params.limit === limitVal ? "#ffffff" : isDark ? "#cbd5e1" : "#334155" }}>
                    {limitVal} per page
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Actions */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 8, paddingBottom: 8 }}>
            <TouchableOpacity
              onPress={handleResetFilters}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                borderWidth: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                backgroundColor: isDark ? "#020617" : "#f8fafc",
                borderColor: isDark ? "#1e293b" : "#e2e8f0",
              }}
            >
              <RotateCcw size={16} color={isDark ? "#94a3b8" : "#64748b"} />
              <Text style={{ fontSize: 12, fontWeight: "700", color: isDark ? "#cbd5e1" : "#334155" }}>
                Reset All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsFilterModalOpen(false)}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#2563eb", alignItems: "center" }}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </AppModal>

      {/* Task Actions Bottom Sheet Modal */}
      {selectedTask && (
        <AppModal
          visible={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          title={selectedTask.title}
        >
          <View style={{ paddingVertical: 8 }}>
            {/* View Details Action */}
            <TouchableOpacity
              onPress={() => {
                setIsActionModalOpen(false);
                router.push(`/tasks/${selectedTask._id}`);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 14,
                marginBottom: 10,
                borderRadius: 16,
                borderWidth: 1,
                backgroundColor: isDark ? "#020617" : "#f8fafc",
                borderColor: isDark ? "#1e293b" : "#e2e8f0",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: isDark ? "rgba(30, 58, 138, 0.5)" : "#eff6ff" }}>
                  <Eye size={20} color="#2563eb" />
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: isDark ? "#ffffff" : "#0f172a" }}>
                    View Full Details
                  </Text>
                  <Text style={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>
                    Inspect complete task notes & metadata
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={isDark ? "#94a3b8" : "#64748b"} />
            </TouchableOpacity>

            {/* Toggle Status Action */}
            <TouchableOpacity
              onPress={() => handleToggleTaskStatus(selectedTask)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 14,
                marginBottom: 10,
                borderRadius: 16,
                borderWidth: 1,
                backgroundColor: isDark ? "#020617" : "#f8fafc",
                borderColor: isDark ? "#1e293b" : "#e2e8f0",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: isDark ? "rgba(6, 78, 59, 0.5)" : "#ecfdf5" }}>
                  <CheckCircle size={20} color="#10b981" />
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: isDark ? "#ffffff" : "#0f172a" }}>
                    {selectedTask.status === TaskStatus.COMPLETED ? "Mark as Pending" : "Mark as Completed"}
                  </Text>
                  <Text style={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>
                    {selectedTask.status === TaskStatus.COMPLETED ? "Move back to To-Do status" : "Finish & mark completed"}
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={isDark ? "#94a3b8" : "#64748b"} />
            </TouchableOpacity>

            {/* Edit Attributes Action */}
            <TouchableOpacity
              onPress={() => {
                setIsActionModalOpen(false);
                router.push(`/tasks/${selectedTask._id}/edit`);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 14,
                marginBottom: 10,
                borderRadius: 16,
                borderWidth: 1,
                backgroundColor: isDark ? "#020617" : "#f8fafc",
                borderColor: isDark ? "#1e293b" : "#e2e8f0",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: isDark ? "rgba(120, 53, 15, 0.5)" : "#fffbeb" }}>
                  <Edit3 size={20} color="#d97706" />
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: isDark ? "#ffffff" : "#0f172a" }}>
                    Edit Task Attributes
                  </Text>
                  <Text style={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>
                    Update title, priority, category & dates
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={isDark ? "#94a3b8" : "#64748b"} />
            </TouchableOpacity>

            {/* Delete Task Action */}
            <TouchableOpacity
              onPress={() => setDeleteConfirmTaskId(selectedTask._id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 14,
                borderRadius: 16,
                borderWidth: 1,
                backgroundColor: isDark ? "rgba(127, 29, 29, 0.3)" : "#fef2f2",
                borderColor: isDark ? "#991b1b" : "#fecaca",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: isDark ? "rgba(153, 27, 27, 0.5)" : "#fee2e2" }}>
                  <Trash2 size={20} color="#ef4444" />
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: "#ef4444" }}>
                    Delete Task
                  </Text>
                  <Text style={{ fontSize: 12, color: isDark ? "#fca5a5" : "#b91c1c" }}>
                    Permanently remove this task
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </AppModal>
      )}
      {/* Delete Confirmation Alert Modal */}
      <AppAlertModal
        visible={!!deleteConfirmTaskId}
        type="warning"
        title="Delete Task?"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDestructive
        onClose={() => setDeleteConfirmTaskId(null)}
        onConfirm={confirmDeleteTask}
      />

      {/* Error Alert Modal */}
      <AppAlertModal
        visible={!!errorAlertMessage}
        type="error"
        title="Action Error"
        message={errorAlertMessage || ""}
        onClose={() => setErrorAlertMessage(null)}
      />
    </SafeAreaView>
  );
}
