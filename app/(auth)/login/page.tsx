'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { registerUser } from './actions';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    if (mode === 'register') {
      const result = await registerUser({ email, password, name: String(formData.get('name')) });
      if (!result.ok) {
        setError(result.message ?? 'Registration failed.');
        return;
      }
    }

    const res = await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: '/dashboard'
    });

    if (res?.error) setError(res.error);
  }

  return (
    <main className="page-gradient flex min-h-screen items-center justify-center px-6">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-ink-900">{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
        <p className="mt-2 text-sm text-ink-600">Start managing workspaces and projects in minutes.</p>
        <form action={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' ? (
            <input
              name="name"
              placeholder="Full name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          ) : null}
          <input
            name="email"
            type="email"
            placeholder="Email address"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          />
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <button className="w-full rounded-full bg-brand-600 px-6 py-3 text-white">Continue</button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="mt-4 text-sm text-ink-600"
        >
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Sign in'}
        </button>
      </div>
    </main>
  );
}
