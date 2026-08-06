"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../../../services/task.api";
import { enumApi } from "../../../services/enum.api";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Modal, ConfirmDialog } from "../../../components/ui/modal";
import { CustomizableTable, ColumnDef, FilterDef } from "../../../components/ui/customizable-table";
import { formatDate, formatDateTime } from "../../../lib/utils";
import { TaskStatus, TaskPriority, TaskCategory, ITaskQueryParams, ITask } from "@/types";
import toast from "react-hot-toast";
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Calendar,
  Bell,
  Eye,
  MoreVertical,
  FileText,
  Clock,
} from "lucide-react";

interface TaskActionsDropdownProps {
  task: ITask;
  onView: (task: ITask) => void;
  onToggleStatus: (task: ITask) => void;
  onDelete: (taskId: string) => void;
}

const TaskActionsDropdown: React.FC<TaskActionsDropdownProps> = ({
  task,
  onView,
  onToggleStatus,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.right - 176,
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={() => onView(task)}
        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
        title="View Task Details"
      >
        <Eye className="h-4 w-4 text-primary" />
      </button>

      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        title="More Actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
          className="fixed w-44 rounded-xl border border-border bg-card shadow-2xl p-1.5 z-[9999] animate-in fade-in-50 zoom-in-95 duration-100 text-left"
        >
          <button
            onClick={() => {
              setIsOpen(false);
              onView(task);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
          >
            <Eye className="h-4 w-4 text-primary" />
            <span>View Details</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onToggleStatus(task);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
          >
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span>{task.status === TaskStatus.COMPLETED ? "Mark Pending" : "Mark Complete"}</span>
          </button>

          <Link
            href={`/tasks/${task._id}/edit`}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
          >
            <Edit3 className="h-4 w-4 text-amber-500" />
            <span>Edit Task</span>
          </Link>

          <div className="my-1 border-t border-border" />

          <button
            onClick={() => {
              setIsOpen(false);
              onDelete(task._id);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
            <span>Delete Task</span>
          </button>
        </div>
      )}
    </div>
  );
};

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

  const [viewingTask, setViewingTask] = useState<ITask | null>(null);
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
          <button
            onClick={() => setViewingTask(task)}
            className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1 text-sm text-left"
          >
            {task.title}
          </button>
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
      headerClassName: "text-right w-24",
      cellClassName: "text-right whitespace-nowrap",
      render: (task) => (
        <TaskActionsDropdown
          task={task}
          onView={(t) => setViewingTask(t)}
          onToggleStatus={(t) =>
            setConfirmStatusChange({
              id: t._id,
              title: t.title,
              newStatus:
                t.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED,
            })
          }
          onDelete={(id) => setDeleteTaskId(id)}
        />
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

      {/* Modernized View Task Details Modal */}
      {viewingTask && (
        <Modal
          isOpen={!!viewingTask}
          onClose={() => setViewingTask(null)}
          title={viewingTask.title}
          description="Task Details & Metadata Overview"
        >
          <div className="space-y-5 pt-2">
            {/* Labeled Attributes Grid */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-accent/40 border border-border">
              <div className="space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  Category
                </p>
                <Badge variant="outline" className="font-semibold text-xs">
                  {viewingTask.category}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  Priority
                </p>
                <Badge
                  variant={
                    viewingTask.priority === TaskPriority.HIGH
                      ? "danger"
                      : viewingTask.priority === TaskPriority.MEDIUM
                      ? "warning"
                      : "secondary"
                  }
                  className="font-semibold text-xs"
                >
                  {viewingTask.priority}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant={
                    viewingTask.status === TaskStatus.COMPLETED
                      ? "success"
                      : viewingTask.status === TaskStatus.IN_PROGRESS
                      ? "warning"
                      : "default"
                  }
                  className="font-semibold text-xs"
                >
                  {viewingTask.status}
                </Badge>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-1.5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-primary" /> Task Description
              </p>
              {viewingTask.description ? (
                <div className="p-3.5 rounded-xl border border-border bg-card text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {viewingTask.description}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-dashed border-border text-xs text-muted-foreground italic">
                  No detailed description provided for this task.
                </div>
              )}
            </div>

            {/* Scheduling & Timestamps Card */}
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" /> Schedule & Timestamps
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border bg-card">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Due Date
                    </p>
                    <p className="font-bold text-foreground">{formatDate(viewingTask.dueDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border bg-card">
                  <Bell className="h-4 w-4 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Reminder
                    </p>
                    <p className="font-bold text-foreground">{formatDateTime(viewingTask.reminderAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border bg-card">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Created At
                    </p>
                    <p className="font-bold text-foreground">{formatDateTime(viewingTask.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border bg-card">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Updated At
                    </p>
                    <p className="font-bold text-foreground">{formatDateTime(viewingTask.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Link href={`/tasks/${viewingTask._id}/edit`}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Edit3 className="h-4 w-4" /> Edit Task
                </Button>
              </Link>
              <Button variant="primary" size="sm" onClick={() => setViewingTask(null)} className="px-5">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

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
