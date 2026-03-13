'use client';

import { useState } from 'react';
import { useAttachments } from '../hooks/useAttachments';

export default function AttachmentUploader({ taskId }: { taskId: string }) {
  const [uploading, setUploading] = useState(false);
  const { refetch } = useAttachments(taskId);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('taskId', taskId);

    await fetch('/api/uploads', { method: 'POST', body: form });
    await refetch();
    setUploading(false);
  }

  return (
    <div className="flex items-center gap-3">
      <input type="file" onChange={handleUpload} />
      {uploading ? <span className="text-xs text-ink-500">Uploading...</span> : null}
    </div>
  );
}
