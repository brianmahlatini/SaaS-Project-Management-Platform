'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/server-utils';
import { TaskItem, TaskStatus } from '../lib/types';

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => apiFetch<TaskItem[]>(`/api/tasks?projectId=${projectId}`)
  });
}

export function useTaskMutation(projectId: string) {
  const queryClient = useQueryClient();

  const updateTask = useMutation({
    mutationFn: (payload: { id: string; status?: TaskStatus; order?: number }) =>
      apiFetch(`/api/tasks/${payload.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      }),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });
      const prev = queryClient.getQueryData<TaskItem[]>(['tasks', projectId]) ?? [];

      queryClient.setQueryData<TaskItem[]>(['tasks', projectId], (items = []) =>
        items.map((task) =>
          task.id === payload.id
            ? { ...task, status: payload.status ?? task.status, order: payload.order ?? task.order }
            : task
        )
      );

      return { prev };
    },
    onError: (_error, _payload, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['tasks', projectId], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    }
  });

  return updateTask;
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { title: string; description?: string }) =>
      apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ projectId, ...payload })
      }),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });
      const prev = queryClient.getQueryData<TaskItem[]>(['tasks', projectId]) ?? [];
      const optimistic: TaskItem = {
        id: `tmp-${Date.now()}`,
        title: payload.title,
        description: payload.description,
        status: 'TODO',
        order: prev.length,
        priority: 2
      };
      queryClient.setQueryData<TaskItem[]>(['tasks', projectId], [optimistic, ...prev]);
      return { prev };
    },
    onError: (_error, _payload, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['tasks', projectId], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    }
  });
}
