type Listener = (payload: string) => void;

const channels = new Map<string, Set<Listener>>();

export function publish(channel: string, payload: string) {
  const listeners = channels.get(channel);
  if (!listeners) return;
  for (const listener of listeners) listener(payload);
}

export function subscribe(channel: string, listener: Listener) {
  const listeners = channels.get(channel) ?? new Set();
  listeners.add(listener);
  channels.set(channel, listeners);

  return () => {
    const current = channels.get(channel);
    if (!current) return;
    current.delete(listener);
  };
}
