import { NextResponse } from 'next/server';
import { subscribe } from '../../../../lib/events';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get('taskId');
  if (!taskId) return NextResponse.json({ error: 'Missing taskId' }, { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const unsubscribe = subscribe(`task:${taskId}`, (payload) => {
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      });

      controller.enqueue(encoder.encode('event: ping\ndata: keep-alive\n\n'));

      return unsubscribe;
    },
    cancel() {
      return;
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}
