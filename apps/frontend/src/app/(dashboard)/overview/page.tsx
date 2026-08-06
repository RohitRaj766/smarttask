"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../../../services/task.api";
import { useAuth } from "../../../store/auth.context";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { Badge } from "../../../components/ui/badge";
import { formatDate } from "../../../lib/utils";
import { TaskStatus } from "@/types";
import {
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["taskStats"],
    queryFn: () => taskApi.getTaskStats(),
  });

  const { data: recentTasksData, isLoading: isTasksLoading } = useQuery({
    queryKey: ["recentTasks"],
    queryFn: () => taskApi.getTasks({ limit: 5, sortBy: "createdAt", order: "desc" }),
  });

  const stats = statsData?.data || {
    TOTAL: 0,
    [TaskStatus.BACKLOG]: 0,
    [TaskStatus.TODO]: 0,
    [TaskStatus.IN_PROGRESS]: 0,
    [TaskStatus.REVIEW]: 0,
    [TaskStatus.COMPLETED]: 0,
  };

  const statCards = [
    { title: "Total Tasks", count: stats.TOTAL, color: "border-l-primary text-primary" },
    { title: "Backlog", count: stats[TaskStatus.BACKLOG], color: "border-l-slate-500 text-slate-500" },
    { title: "To Do", count: stats[TaskStatus.TODO], color: "border-l-blue-500 text-blue-500" },
    { title: "In Progress", count: stats[TaskStatus.IN_PROGRESS], color: "border-l-amber-500 text-amber-500" },
    { title: "Review", count: stats[TaskStatus.REVIEW], color: "border-l-purple-500 text-purple-500" },
    { title: "Completed", count: stats[TaskStatus.COMPLETED], color: "border-l-emerald-500 text-emerald-500" },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            Hello, {isAuthLoading ? <Skeleton className="h-8 w-40 rounded-lg inline-block" /> : (user?.name || "User")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here's an overview of your task statistics and recent activity.
          </p>
        </div>
        <Link href="/tasks/new">
          <Button variant="primary" className="gap-2">
            <Plus className="h-4 w-4" /> Create Task
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
        {statCards.map((card) => (
          <Card
            key={card.title}
            className={`border-l-4 shadow-sm hover:shadow-md transition-all ${card.color}`}
          >
            <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                {card.title}
              </p>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              {isStatsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-xl sm:text-2xl font-extrabold">{card.count}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Recent Tasks</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Your latest created tasks</p>
            </div>
            <Link href="/tasks">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {isTasksLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))
            ) : recentTasksData?.data?.items?.length ? (
              recentTasksData.data.items.map((task) => (
                <div
                  key={task._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-card/50 hover:bg-accent/40 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <Link
                      href={`/tasks/${task._id}/edit`}
                      className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1"
                    >
                      {task.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <Badge variant="outline">{task.category}</Badge>
                      <span>•</span>
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                  <div className="self-start sm:self-auto shrink-0">
                    <Badge
                      variant={
                        task.status === TaskStatus.COMPLETED
                          ? "success"
                          : task.status === TaskStatus.IN_PROGRESS
                          ? "warning"
                          : "default"
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No tasks available yet. Create one!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" /> Quick Tips & Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <CheckCircle2 className="h-4 w-4" /> Task Management
              </div>
              <p className="text-xs text-muted-foreground">
                Filter your tasks by status, priority, and category on the Tasks page to stay focused on high-priority items.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400">
                <Clock className="h-4 w-4" /> Set Reminders
              </div>
              <p className="text-xs text-muted-foreground">
                Add due dates and reminder timestamps to ensure deadlines are never missed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
