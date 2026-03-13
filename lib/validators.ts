import { z } from 'zod';

export const workspaceSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2)
});

export const projectSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().min(2),
  description: z.string().optional()
});

export const taskSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.number().min(1).max(3).optional(),
  order: z.number().optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional()
});

export const commentSchema = z.object({
  taskId: z.string().min(1),
  content: z.string().min(1)
});
