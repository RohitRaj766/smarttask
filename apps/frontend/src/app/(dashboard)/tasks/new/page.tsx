"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../../../../services/task.api";
import { Input } from "../../../../components/ui/input";
import { Select } from "../../../../components/ui/select";
import { Button } from "../../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/ui/card";
import { TaskStatus, TaskPriority, TaskCategory } from "@/types";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title must be under 150 characters"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  category: z.nativeEnum(TaskCategory),
  dueDate: z.string().optional(),
  reminderAt: z.string().optional(),
});

type TaskFormValues = z.infer<typeof createTaskSchema>;

export default function CreateTaskPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      category: TaskCategory.WORK,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: TaskFormValues) =>
      taskApi.createTask({
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        reminderAt: data.reminderAt ? new Date(data.reminderAt).toISOString() : null,
      }),
    onSuccess: () => {
      toast.success("Task created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
      router.push("/tasks");
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true);
    createMutation.mutate(data, {
      onSettled: () => setIsSubmitting(false),
    });
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Create New Task</h1>
      </div>

      <Card className="shadow-lg border-border">
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Title *"
              placeholder="e.g. Implement user authentication flow"
              error={errors.title?.message}
              {...register("title")}
            />

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </label>
              <textarea
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[100px]"
                placeholder="Provide detailed instructions or context..."
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
                Save Task
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
