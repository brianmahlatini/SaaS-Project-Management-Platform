export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="card p-8 text-center">
      <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-600">{description}</p>
    </div>
  );
}
