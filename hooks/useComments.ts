'use client';

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/server-utils';

export interface CommentItem {
  id: string;
  content: string;
  createdAt: string;
  author: { name?: string | null; email?: string | null };
}

export function useComments(taskId: string) {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => apiFetch<CommentItem[]>(`/api/comments?taskId=${taskId}`),
    enabled: Boolean(taskId)
  });
}

export function useCreateComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { content: string }) =>
      apiFetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ taskId, content: payload.content })
      }),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['comments', taskId] });
      const prev = queryClient.getQueryData<CommentItem[]>(['comments', taskId]) ?? [];
      const optimistic: CommentItem = {
        id: `tmp-${Date.now()}`,
        content: payload.content,
        createdAt: new Date().toISOString(),
        author: { name: 'You' }
      };
      queryClient.setQueryData<CommentItem[]>(['comments', taskId], [optimistic, ...prev]);
      return { prev };
    },
    onError: (_error, _payload, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['comments', taskId], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
    }
  });
}

export function useRealtimeComments(taskId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!taskId) return;
    const source = new EventSource(`/api/comments/stream?taskId=${taskId}`);
    source.onmessage = (event) => {
      const payload = JSON.parse(event.data) as CommentItem;
      queryClient.setQueryData<CommentItem[]>(['comments', taskId], (items = []) => [payload, ...items]);
    };
    return () => source.close();
  }, [taskId, queryClient]);
}
