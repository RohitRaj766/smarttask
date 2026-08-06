"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../../../../../services/task.api";
import { Input } from "../../../../../components/ui/input";
import { Select } from "../../../../../components/ui/select";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { TaskStatus, TaskPriority, TaskCategory } from "@/types";
import toast from "react-hot-toast";
import { ChevronRight, FileText, Sliders, Calendar, Edit3 } from "lucide-react";

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

export default function EditTaskPage() {
  const params = useParams();
  const taskId = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: taskData, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => taskApi.getTaskById(taskId),
    enabled: !!taskId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(updateTaskSchema),
  });

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
        reminderAt: task.reminderAt ? new Date(task.reminderAt).toISOString().slice(0, 16) : "",
      });
    }
  }, [taskData, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: TaskFormValues) =>
      taskApi.updateTask(taskId, {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        reminderAt: data.reminderAt ? new Date(data.reminderAt).toISOString() : null,
      }),
    onSuccess: () => {
      toast.success("Task updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
      router.push("/tasks");
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true);
    updateMutation.mutate(data, {
      onSettled: () => setIsSubmitting(false),
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-[420px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Centered Breadcrumb Navigation */}
      <nav className="flex justify-center items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Link href="/overview" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/tasks" className="hover:text-primary transition-colors">
          Tasks
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-bold">Edit Task</span>
      </nav>

      {/* Centered Modern Form Container */}
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <Edit3 className="h-3.5 w-3.5" /> Update Work Item
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Edit Task</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Modify task attributes, status progression, priority level, or due dates.
          </p>
        </div>

        <Card className="shadow-xl border-border bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Section 1: Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border text-sm font-bold text-foreground">
                  <FileText className="h-4 w-4 text-primary" /> Task Basics
                </div>
                <Input
                  label="Title *"
                  placeholder="Task title"
                  error={errors.title?.message}
                  {...register("title")}
                />

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Description
                  </label>
                  <textarea
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[110px] transition-colors"
                    placeholder="Description..."
                    {...register("description")}
                  />
                </div>
              </div>

              {/* Section 2: Classification */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border text-sm font-bold text-foreground">
                  <Sliders className="h-4 w-4 text-primary" /> Classification & Priority
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
                    label="Status"
                    options={Object.values(TaskStatus).map((s) => ({ label: s, value: s }))}
                    {...register("status")}
                  />
                  <Select
                    label="Priority"
                    options={Object.values(TaskPriority).map((p) => ({ label: p, value: p }))}
                    {...register("priority")}
                  />
                  <Select
                    label="Category"
                    options={Object.values(TaskCategory).map((c) => ({ label: c, value: c }))}
                    {...register("category")}
                  />
                </div>
              </div>

              {/* Section 3: Scheduling */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border text-sm font-bold text-foreground">
                  <Calendar className="h-4 w-4 text-primary" /> Due Date & Reminders
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Due Date"
                    type="date"
                    error={errors.dueDate?.message}
                    {...register("dueDate")}
                  />
                  <Input
                    label="Reminder Timestamp"
                    type="datetime-local"
                    error={errors.reminderAt?.message}
                    {...register("reminderAt")}
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isSubmitting} className="px-6">
                  Update Task
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
