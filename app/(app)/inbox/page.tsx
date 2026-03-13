import NotificationCenter from '../../../components/notifications/notification-center';

export default function InboxPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900 dark:text-slate-50">Notifications</h1>
        <p className="text-sm text-ink-600 dark:text-slate-300">In-app alerts, mentions, and system updates.</p>
      </div>
      <NotificationCenter />
    </div>
  );
}
