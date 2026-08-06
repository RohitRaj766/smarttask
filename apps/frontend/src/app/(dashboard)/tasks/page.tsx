"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../../../services/task.api";
import { enumApi } from "../../../services/enum.api";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { ConfirmDialog } from "../../../components/ui/modal";
import { EmptyState } from "../../../components/ui/empty-state";
import { formatDate } from "../../../lib/utils";
import { TaskStatus, TaskPriority, TaskCategory, ITaskQueryParams } from "@/types";
import toast from "react-hot-toast";
import { Plus, Search, Edit3, Trash2, CheckCircle, Calendar, Tag } from "lucide-react";

export default function TaskListPage() {
  const queryClient = useQueryClient();
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

  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const { data: enumsData } = useQuery({
    queryKey: ["enums"],
    queryFn: () => enumApi.getAllEnums(),
  });

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ["tasks", params],
    queryFn: () => taskApi.getTasks(params),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onSuccess: () => {
      toast.success("Task deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
      setDeleteTaskId(null);
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskApi.updateTask(id, { status }),
    onSuccess: () => {
      toast.success("Task status updated");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
    },
  });

  const statuses = enumsData?.data?.statuses || Object.values(TaskStatus);
  const priorities = enumsData?.data?.priorities || Object.values(TaskPriority);
  const categories = enumsData?.data?.categories || Object.values(TaskCategory);

  const tasks = tasksData?.data?.items || [];
  const meta = tasksData?.data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Task Directory</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage, filter, and track all your tasks in one place.
          </p>
        </div>
        <Link href="/tasks/new">
          <Button variant="primary" className="gap-2">
            <Plus className="h-4 w-4" /> Add Task
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 p-4 rounded-xl border border-border bg-card shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by title or description..."
            value={params.search || ""}
            onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
            className="pl-9"
          />
        </div>

        <Select
          value={params.status || ""}
          onChange={(e) =>
            setParams((prev) => ({
              ...prev,
              status: e.target.value ? (e.target.value as TaskStatus) : undefined,
              page: 1,
            }))
          }
          options={[
            { label: "All Statuses", value: "" },
            ...statuses.map((s) => ({ label: s, value: s })),
          ]}
        />

        <Select
          value={params.priority || ""}
          onChange={(e) =>
            setParams((prev) => ({
              ...prev,
              priority: e.target.value ? (e.target.value as TaskPriority) : undefined,
              page: 1,
            }))
          }
          options={[
            { label: "All Priorities", value: "" },
            ...priorities.map((p) => ({ label: p, value: p })),
          ]}
        />

        <Select
          value={params.category || ""}
          onChange={(e) =>
            setParams((prev) => ({
              ...prev,
              category: e.target.value ? (e.target.value as TaskCategory) : undefined,
              page: 1,
            }))
          }
          options={[
            { label: "All Categories", value: "" },
            ...categories.map((c) => ({ label: c, value: c })),
          ]}
        />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks match your filter"
            description="Try clearing your search parameters or add a new task."
            actionText="Create Task"
            onAction={() => window.location.assign("/tasks/new")}
          />
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-border bg-card shadow-sm hover:border-primary/40 transition-all gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-foreground hover:text-primary">
                    {task.title}
                  </h3>
                  <Badge variant="outline">{task.category}</Badge>
                  <Badge
                    variant={
                      task.priority === TaskPriority.HIGH
                        ? "danger"
                        : task.priority === TaskPriority.MEDIUM
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {task.priority} Priority
                  </Badge>
                </div>
                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Due: {formatDate(task.dueDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" /> Created: {formatDate(task.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 justify-between sm:justify-end">
                <Button
                  size="sm"
                  variant={task.status === TaskStatus.COMPLETED ? "success" : "outline"}
                  onClick={() =>
                    updateStatusMutation.mutate({
                      id: task._id,
                      status:
                        task.status === TaskStatus.COMPLETED
                          ? TaskStatus.TODO
                          : TaskStatus.COMPLETED,
                    })
                  }
                  className="gap-1.5"
                >
                  <CheckCircle className="h-4 w-4" />
                  {task.status === TaskStatus.COMPLETED ? "Completed" : "Mark Complete"}
                </Button>

                <Link href={`/tasks/${task._id}/edit`}>
                  <Button size="sm" variant="ghost" title="Edit Task">
                    <Edit3 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeleteTaskId(task._id)}
                  title="Delete Task"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages} ({meta.total} total tasks)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => setParams((prev) => ({ ...prev, page: prev.page! - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => setParams((prev) => ({ ...prev, page: prev.page! + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTaskId}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={() => deleteTaskId && deleteMutation.mutate(deleteTaskId)}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
