export function StatCard({ label, value, trend }: { label: string; value: string | number; trend?: string }) {
  return (
    <div className="card p-6">
      <div className="text-sm text-ink-600">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-ink-900">{value}</div>
      {trend ? <div className="mt-2 text-xs text-ink-500">{trend}</div> : null}
    </div>
  );
}
