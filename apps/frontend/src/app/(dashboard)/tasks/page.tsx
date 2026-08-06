"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../../../services/task.api";
import { enumApi } from "../../../services/enum.api";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { ConfirmDialog } from "../../../components/ui/modal";
import { CustomizableTable, ColumnDef, FilterDef } from "../../../components/ui/customizable-table";
import { formatDate, formatDateTime } from "../../../lib/utils";
import { TaskStatus, TaskPriority, TaskCategory, ITaskQueryParams, ITask } from "@/types";
import toast from "react-hot-toast";
import { Plus, Edit3, Trash2, CheckCircle, Calendar, Bell } from "lucide-react";

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
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    id: string;
    title: string;
    newStatus: TaskStatus;
  } | null>(null);

  const { data: enumsData } = useQuery({
    queryKey: ["enums"],
    queryFn: () => enumApi.getAllEnums(),
  });

  const { data: tasksData, isLoading, isFetching, refetch } = useQuery({
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
      setConfirmStatusChange(null);
    },
    onError: () => {
      toast.error("Failed to update task status");
    },
  });

  const statuses = enumsData?.data?.statuses || Object.values(TaskStatus);
  const priorities = enumsData?.data?.priorities || Object.values(TaskPriority);
  const categories = enumsData?.data?.categories || Object.values(TaskCategory);

  const tasks = tasksData?.data?.items || [];
  const meta = tasksData?.data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Define Filter Controls passed to CustomizableTable
  const filters: FilterDef[] = [
    {
      key: "status",
      value: params.status || "",
      onChange: (val) =>
        setParams((prev) => ({
          ...prev,
          status: val ? (val as TaskStatus) : undefined,
          page: 1,
        })),
      options: [
        { label: "All Statuses", value: "" },
        ...statuses.map((s) => ({ label: s, value: s })),
      ],
    },
    {
      key: "priority",
      value: params.priority || "",
      onChange: (val) =>
        setParams((prev) => ({
          ...prev,
          priority: val ? (val as TaskPriority) : undefined,
          page: 1,
        })),
      options: [
        { label: "All Priorities", value: "" },
        ...priorities.map((p) => ({ label: p, value: p })),
      ],
    },
    {
      key: "category",
      value: params.category || "",
      onChange: (val) =>
        setParams((prev) => ({
          ...prev,
          category: val ? (val as TaskCategory) : undefined,
          page: 1,
        })),
      options: [
        { label: "All Categories", value: "" },
        ...categories.map((c) => ({ label: c, value: c })),
      ],
    },
  ];

  // Define Table Column Specifications
  const columns: ColumnDef<ITask>[] = [
    {
      key: "slNo",
      label: "Sl. No.",
      headerClassName: "w-16",
      cellClassName: "font-mono text-xs text-muted-foreground",
      render: (_, index) => (meta.page - 1) * meta.limit + index + 1,
    },
    {
      key: "details",
      label: "Task Details",
      cellClassName: "max-w-xs sm:max-w-md",
      render: (task) => (
        <div>
          <Link
            href={`/tasks/${task._id}/edit`}
            className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1 text-sm"
          >
            {task.title}
          </Link>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {task.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      cellClassName: "whitespace-nowrap",
      render: (task) => <Badge variant="outline">{task.category}</Badge>,
    },
    {
      key: "priority",
      label: "Priority",
      cellClassName: "whitespace-nowrap",
      render: (task) => (
        <Badge
          variant={
            task.priority === TaskPriority.HIGH
              ? "danger"
              : task.priority === TaskPriority.MEDIUM
              ? "warning"
              : "secondary"
          }
        >
          {task.priority}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      cellClassName: "whitespace-nowrap",
      render: (task) => (
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
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      cellClassName: "text-xs text-muted-foreground whitespace-nowrap",
      render: (task) => (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          {formatDate(task.dueDate)}
        </div>
      ),
    },
    {
      key: "reminderAt",
      label: "Reminder",
      cellClassName: "text-xs text-muted-foreground whitespace-nowrap",
      render: (task) => (
        <div className="flex items-center gap-1.5">
          <Bell className="h-3.5 w-3.5 text-amber-500" />
          {formatDateTime(task.reminderAt)}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      cellClassName: "text-xs text-muted-foreground whitespace-nowrap",
      render: (task) => formatDate(task.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      headerClassName: "text-right",
      cellClassName: "text-right whitespace-nowrap",
      render: (task) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant={task.status === TaskStatus.COMPLETED ? "success" : "outline"}
            onClick={() =>
              setConfirmStatusChange({
                id: task._id,
                title: task.title,
                newStatus:
                  task.status === TaskStatus.COMPLETED
                    ? TaskStatus.TODO
                    : TaskStatus.COMPLETED,
              })
            }
            className="gap-1.5 text-xs h-8 px-2.5"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            {task.status === TaskStatus.COMPLETED ? "Completed" : "Mark Complete"}
          </Button>

          <Link href={`/tasks/${task._id}/edit`}>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Edit Task">
              <Edit3 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Button>
          </Link>

          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setDeleteTaskId(task._id)}
            title="Delete Task"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 100% Self-Contained Reusable CustomizableTable */}
      <CustomizableTable<ITask>
        title="Task Directory"
        subtitle="Manage, filter, and track all your tasks in a configurable table format."
        headerActions={
          <Link href="/tasks/new">
            <Button variant="primary" className="gap-2">
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </Link>
        }
        columns={columns}
        data={tasks}
        total={meta.total}
        page={meta.page}
        limit={meta.limit}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        onLimitChange={(limit) => setParams((prev) => ({ ...prev, limit, page: 1 }))}
        search={params.search}
        onSearchChange={(search) => setParams((prev) => ({ ...prev, search, page: 1 }))}
        searchPlaceholder="Search tasks by title or description..."
        filters={filters}
        isLoading={isLoading}
        isRefreshing={isFetching}
        onRefresh={() => refetch()}
        rowKey={(task) => task._id}
        emptyTitle="No tasks match your filter"
        emptyDescription="Try clearing your search parameters or add a new task."
        emptyActionText="Create Task"
        onEmptyAction={() => window.location.assign("/tasks/new")}
      />

      {/* Confirmation Modals */}
      <ConfirmDialog
        isOpen={!!confirmStatusChange}
        onClose={() => setConfirmStatusChange(null)}
        onConfirm={() => {
          if (confirmStatusChange) {
            updateStatusMutation.mutate({
              id: confirmStatusChange.id,
              status: confirmStatusChange.newStatus,
            });
          }
        }}
        title="Confirm Task Action"
        description={`Are you sure you want to change the status of "${confirmStatusChange?.title}" to ${confirmStatusChange?.newStatus}?`}
        confirmText="Confirm Action"
        isLoading={updateStatusMutation.isPending}
      />

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
