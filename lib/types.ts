export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

export interface TaskItem {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  order: number;
  priority: number;
  assigneeId?: string | null;
}
