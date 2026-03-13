export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <section className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink-900 dark:text-slate-50">Settings</h1>
            <p className="mt-2 text-sm text-ink-600 dark:text-slate-300">
              Manage profile, security, roles, and workspace defaults.
            </p>
          </div>
          <button className="rounded-full bg-brand-600 px-4 py-2 text-sm text-white">Save changes</button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card space-y-6 p-6">
          <div>
            <h2 className="text-lg font-semibold text-ink-900 dark:text-slate-50">Profile</h2>
            <p className="text-sm text-ink-600 dark:text-slate-300">Update your identity and personal workspace defaults.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input placeholder="Full name" className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900" />
            <input placeholder="Role title" className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900" />
            <input placeholder="Email" className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900" />
            <input placeholder="Time zone" className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900" />
          </div>
        </div>

        <div className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold text-ink-900 dark:text-slate-50">Security</h2>
          <div className="grid gap-3 text-sm text-ink-600 dark:text-slate-300">
            <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <span>Two-factor authentication</span>
              <input type="checkbox" className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <span>Session timeout</span>
              <select className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
              </select>
            </label>
            <button className="rounded-full border border-ink-300 px-3 py-2 text-xs dark:border-slate-600">Rotate API key</button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold text-ink-900 dark:text-slate-50">Workspace Defaults</h2>
          <div className="grid gap-3 text-sm text-ink-600 dark:text-slate-300">
            <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <span>Default task status</span>
              <select className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900">
                <option>Backlog</option>
                <option>To do</option>
                <option>In progress</option>
              </select>
            </label>
            <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <span>Auto-assign tasks to creator</span>
              <input type="checkbox" className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <span>Enable task templates</span>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </label>
          </div>
        </div>

        <div className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold text-ink-900 dark:text-slate-50">Notifications</h2>
          <div className="grid gap-3 text-sm text-ink-600 dark:text-slate-300">
            <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <span>Daily activity digest</span>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <span>Mentions and comments</span>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <span>Slack alerts</span>
              <input type="checkbox" className="h-4 w-4" />
            </label>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold text-ink-900 dark:text-slate-50">Roles & Access</h2>
          <div className="grid gap-3 text-sm text-ink-600 dark:text-slate-300">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <div>
                <div className="font-semibold text-ink-900 dark:text-slate-50">Admin</div>
                <div className="text-xs">Manage billing, roles, and all projects</div>
              </div>
              <button className="rounded-full border border-ink-300 px-3 py-2 text-xs dark:border-slate-600">Edit</button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <div>
                <div className="font-semibold text-ink-900 dark:text-slate-50">Member</div>
                <div className="text-xs">Create and manage tasks, comment, upload files</div>
              </div>
              <button className="rounded-full border border-ink-300 px-3 py-2 text-xs dark:border-slate-600">Edit</button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <div>
                <div className="font-semibold text-ink-900 dark:text-slate-50">Viewer</div>
                <div className="text-xs">Read-only access to projects and reports</div>
              </div>
              <button className="rounded-full border border-ink-300 px-3 py-2 text-xs dark:border-slate-600">Edit</button>
            </div>
          </div>
        </div>

        <div className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold text-ink-900 dark:text-slate-50">Integrations</h2>
          <div className="grid gap-3 text-sm text-ink-600 dark:text-slate-300">
            <button className="rounded-xl border border-slate-200 px-4 py-3 text-left dark:border-slate-700">
              Connect Slack
            </button>
            <button className="rounded-xl border border-slate-200 px-4 py-3 text-left dark:border-slate-700">
              Connect GitHub
            </button>
            <button className="rounded-xl border border-slate-200 px-4 py-3 text-left dark:border-slate-700">
              Connect Google Calendar
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-3 p-6">
          <h2 className="text-lg font-semibold text-ink-900 dark:text-slate-50">Billing</h2>
          <p className="text-sm text-ink-600 dark:text-slate-300">Current plan: Pro • 12 seats used</p>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900">Manage plan</button>
            <button className="rounded-full border border-ink-300 px-4 py-2 text-xs dark:border-slate-600">View invoices</button>
          </div>
        </div>
        <div className="card space-y-3 border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
          <h2 className="text-lg font-semibold">Danger Zone</h2>
          <p className="text-sm">Disable workspace access or transfer ownership.</p>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full border border-red-400 px-4 py-2 text-xs">Deactivate workspace</button>
            <button className="rounded-full border border-red-400 px-4 py-2 text-xs">Transfer ownership</button>
          </div>
        </div>
      </section>
    </div>
  );
}
