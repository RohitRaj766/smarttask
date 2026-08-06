import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService, CreateTaskPayload, UpdateTaskPayload } from "../services/task.service";
import { ITaskQueryParams, TaskStatus } from "../types";

export const TASK_QUERY_KEYS = {
  tasks: (params?: ITaskQueryParams) => ["tasks", params],
  task: (id: string) => ["task", id],
  stats: ["taskStats"],
};

export const useTasks = (params?: ITaskQueryParams) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.tasks(params),
    queryFn: () => taskService.getTasks(params),
  });
};

export const useTaskDetails = (taskId: string) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.task(taskId),
    queryFn: () => taskService.getTaskById(taskId),
    enabled: !!taskId,
  });
};

export const useTaskStats = () => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.stats,
    queryFn: () => taskService.getTaskStats(),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => taskService.createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.stats });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: UpdateTaskPayload }) =>
      taskService.updateTask(taskId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.task(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.stats });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.stats });
    },
  });
};
