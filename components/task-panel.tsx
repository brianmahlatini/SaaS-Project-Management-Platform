'use client';

import { useEffect } from 'react';
import { TaskItem } from '../lib/types';
import { useComments, useCreateComment, useRealtimeComments } from '../hooks/useComments';
import { useAttachments } from '../hooks/useAttachments';
import AttachmentUploader from './attachment-uploader';

export default function TaskPanel({ task, workspaceId }: { task: TaskItem | null; workspaceId: string }) {
  const taskId = task?.id ?? '';
  const commentsQuery = useComments(taskId);
  const createComment = useCreateComment(taskId);
  const attachmentsQuery = useAttachments(taskId);

  useRealtimeComments(taskId);

  useEffect(() => {
    if (!taskId) return;
    commentsQuery.refetch();
  }, [taskId, commentsQuery]);

  if (!task) {
    return (
      <div className="card p-6 text-sm text-ink-600">
        Select a task to see details, comments, and attachments.
      </div>
    );
  }

  async function handleComment(formData: FormData) {
    const content = String(formData.get('content'));
    if (!content) return;
    await createComment.mutateAsync({ content });
  }


  function copyLink() {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
  }

  return (
    <div className="card flex h-fit flex-col gap-4 p-6">
      <div>
        <h3 className="text-lg font-semibold text-ink-900">{task.title}</h3>
        <p className="text-sm text-ink-600">{task.description}</p>
      </div>
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-ink-500">
        <div className="flex flex-wrap items-center gap-2">
          <span>Workspace: {workspaceId}</span>
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-700">
            {task.status}
          </span>
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-700">
            Priority {task.priority}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={copyLink} className="rounded-full border border-slate-200 px-3 py-2 text-xs">
          Copy task link
        </button>
        <button className="rounded-full border border-slate-200 px-3 py-2 text-xs">Add checklist</button>
        <button className="rounded-full border border-slate-200 px-3 py-2 text-xs">Create subtask</button>
      </div>
      <div>
        <div className="text-sm font-semibold text-ink-900">Comments</div>
        <form action={handleComment} className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input name="content" placeholder="Leave a comment" className="flex-1 rounded-xl border border-slate-200 px-3 py-2" />
          <button className="rounded-full bg-brand-600 px-3 py-2 text-sm text-white">Send</button>
        </form>
        <div className="mt-4 space-y-3 text-sm text-ink-700">
          {(commentsQuery.data ?? []).map((comment) => (
            <div key={comment.id} className="rounded-xl border border-slate-100 bg-white p-3">
              <div className="text-xs text-ink-500">{comment.author?.name ?? 'User'}</div>
              <div>{comment.content}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm font-semibold text-ink-900">Attachments</div>
        <div className="mt-2">
          <AttachmentUploader taskId={taskId} />
        </div>
        <div className="mt-4 space-y-2 text-sm text-ink-700">
          {(attachmentsQuery.data ?? []).map((file) => (
            <div key={file.id} className="rounded-xl border border-slate-100 bg-white p-3">
              <div className="font-medium text-ink-900">{file.filename}</div>
              <a className="text-xs text-brand-600" href={file.url} target="_blank" rel="noreferrer">
                {file.url}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
