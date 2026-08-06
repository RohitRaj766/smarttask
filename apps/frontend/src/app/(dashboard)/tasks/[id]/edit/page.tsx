"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../../../../../services/task.api";
import { Input } from "../../../../../components/ui/input";
import { Select } from "../../../../../components/ui/select";
import { Button } from "../../../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../../components/ui/card";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { TaskStatus, TaskPriority, TaskCategory } from "@/types";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

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
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Task</h1>
      </div>

      <Card className="shadow-lg border-border">
        <CardHeader>
          <CardTitle>Update Task Info</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[100px]"
                placeholder="Description..."
                {...register("description")}
              />
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

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
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
