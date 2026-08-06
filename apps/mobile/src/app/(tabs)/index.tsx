import React, { useState } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/auth.context";
import { useTheme } from "../../theme/theme.context";
import { useTaskStats, useTasks } from "../../hooks/useTasks";
import { AppStatCard } from "../../components/ui/AppStatCard";
import { AppTaskCard } from "../../components/ui/AppTaskCard";
import { AppButton } from "../../components/ui/AppButton";
import { AppSkeleton } from "../../components/ui/AppSkeleton";
import { AppCard } from "../../components/ui/AppCard";
import { TaskStatus } from "../../types";
import {
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  ListTodo,
  AlertCircle,
  FolderCheck,
} from "lucide-react-native";

export default function DashboardScreen() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();

  const { data: statsData, isLoading: isStatsLoading, refetch: refetchStats } = useTaskStats();
  const { data: recentTasksData, isLoading: isTasksLoading, refetch: refetchTasks } = useTasks({
    limit: 5,
    sortBy: "createdAt",
    order: "desc",
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchTasks()]);
    setRefreshing(false);
  };

  const stats = statsData?.data || {
    TOTAL: 0,
    [TaskStatus.BACKLOG]: 0,
    [TaskStatus.TODO]: 0,
    [TaskStatus.IN_PROGRESS]: 0,
    [TaskStatus.REVIEW]: 0,
    [TaskStatus.COMPLETED]: 0,
  };

  const statCards = [
    {
      title: "Total Tasks",
      count: stats.TOTAL,
      accent: "#2563eb",
      bgLight: "#eff6ff",
      bgDark: "#1e293b",
      icon: <Layers size={16} color="#2563eb" />,
    },
    {
      title: "Backlog",
      count: stats[TaskStatus.BACKLOG],
      accent: "#64748b",
      bgLight: "#f8fafc",
      bgDark: "#0f172a",
      icon: <Clock size={16} color="#64748b" />,
    },
    {
      title: "To Do",
      count: stats[TaskStatus.TODO],
      accent: "#0284c7",
      bgLight: "#f0f9ff",
      bgDark: "#1e293b",
      icon: <ListTodo size={16} color="#0284c7" />,
    },
    {
      title: "In Progress",
      count: stats[TaskStatus.IN_PROGRESS],
      accent: "#d97706",
      bgLight: "#fffbeb",
      bgDark: "#291e10",
      icon: <AlertCircle size={16} color="#d97706" />,
    },
    {
      title: "Review",
      count: stats[TaskStatus.REVIEW],
      accent: "#9333ea",
      bgLight: "#faf5ff",
      bgDark: "#261535",
      icon: <Sparkles size={16} color="#9333ea" />,
    },
    {
      title: "Completed",
      count: stats[TaskStatus.COMPLETED],
      accent: "#059669",
      bgLight: "#ecfdf5",
      bgDark: "#062e24",
      icon: <FolderCheck size={16} color="#059669" />,
    },
  ];

  const recentTasks = recentTasksData?.data?.items || [];

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return "U";
    return nameStr
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView edges={["top"]} className={`flex-1 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-4 py-3 space-y-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" colors={["#2563eb"]} />
        }
      >
        {/* Header Greeting Banner */}
        <View className="flex-row items-center justify-between pt-1 pb-1">
          <View className="flex-row items-center gap-3">
            <View className="w-11 h-11 rounded-xl bg-blue-600 items-center justify-center shadow-sm">
              <Text className="text-base font-black text-white">{getInitials(user?.name)}</Text>
            </View>
            <View>
              <Text className={`text-xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                Hello, {user?.name || "User"}
              </Text>
              <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Task overview & statistics
              </Text>
            </View>
          </View>

          <AppButton
            title="New Task"
            size="sm"
            leftIcon={<Plus size={16} color="#ffffff" />}
            onPress={() => router.push("/tasks/new")}
          />
        </View>

        {/* Statistics Cards Grid */}
        <View className="space-y-3">
          <Text className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Metrics Overview
          </Text>

          {isStatsLoading ? (
            <View className="flex-row flex-wrap gap-2.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <AppSkeleton key={i} width="48%" height={75} borderRadius={16} />
              ))}
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-2.5">
              {statCards.map((card) => (
                <AppStatCard
                  key={card.title}
                  title={card.title}
                  count={card.count}
                  accentColor={card.accent}
                  bgLight={card.bgLight}
                  bgDark={card.bgDark}
                  icon={card.icon}
                />
              ))}
            </View>
          )}
        </View>

        {/* Recent Activity / Tasks Section */}
        <View className="space-y-3">
          <View className="flex-row items-center justify-between">
            <Text className={`text-base font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
              Recent Tasks
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/tasks")}
              className="flex-row items-center gap-1 p-1"
            >
              <Text className="text-xs font-bold text-blue-600 dark:text-blue-400">View All</Text>
              <ArrowRight size={14} color="#2563eb" />
            </TouchableOpacity>
          </View>

          {isTasksLoading || isStatsLoading ? (
            <View className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <AppSkeleton key={i} width="100%" height={90} borderRadius={16} />
              ))}
            </View>
          ) : recentTasks.length > 0 ? (
            recentTasks.map((task) => (
              <AppTaskCard
                key={task._id}
                task={task}
                onPress={() => router.push(`/tasks/${task._id}`)}
              />
            ))
          ) : (
            <AppCard className="items-center py-6">
              <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                No recent tasks found. Tap "+ New Task" to create one.
              </Text>
            </AppCard>
          )}
        </View>

        {/* Quick Tips Box */}
        <AppCard className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-900/40 p-4 space-y-3">
          <View className="flex-row items-center gap-2">
            <Sparkles size={18} color="#f59e0b" />
            <Text className={`text-sm font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
              Productivity Tips
            </Text>
          </View>

          <View className="flex-row items-start gap-2.5">
            <CheckCircle2 size={16} color="#2563eb" className="mt-0.5" />
            <Text className={`text-xs flex-1 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Organize tasks using Category, Priority, and Status tags to maintain high focus.
            </Text>
          </View>

          <View className="flex-row items-start gap-2.5">
            <Clock size={16} color="#f59e0b" className="mt-0.5" />
            <Text className={`text-xs flex-1 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Set reminder timestamps to receive instant email notifications ahead of deadlines.
            </Text>
          </View>
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
}
