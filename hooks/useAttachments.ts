'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/server-utils';

export interface AttachmentItem {
  id: string;
  filename: string;
  url: string;
  size: number;
}

export function useAttachments(taskId: string) {
  return useQuery({
    queryKey: ['attachments', taskId],
    queryFn: () => apiFetch<AttachmentItem[]>(`/api/attachments?taskId=${taskId}`),
    enabled: Boolean(taskId)
  });
}

export function useCreateAttachment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { filename: string; url: string; size: number }) =>
      apiFetch('/api/attachments', {
        method: 'POST',
        body: JSON.stringify({ taskId, ...payload })
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', taskId] });
    }
  });
}
