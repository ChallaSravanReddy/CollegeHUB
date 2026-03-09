import { useEffect, useState } from 'react';
import ProblemCard from '../components/ProblemCard';
import { API_BASE_URL, supabase } from '../lib';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) {
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchAll = async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/problems`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      setError('Failed to load admin data.');
      return;
    }
    const data = await response.json();
    setItems(data || []);
  };

  useEffect(() => {
    if (session?.access_token) {
      fetchAll(session.access_token);
    }
  }, [session]);

  const login = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase env variables are missing.');
      return;
    }
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError(loginError.message);
    }
  };

  const patchProblem = async (id, payload) => {
    await fetch(`${API_BASE_URL}/api/admin/problems/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify(payload)
    });
    fetchAll(session.access_token);
  };

  if (!session) {
    return (
      <section className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-xl font-semibold">Admin Login</h2>
        <form onSubmit={login} className="space-y-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" className="w-full rounded-lg border p-3" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-lg border p-3" required />
          <button className="w-full rounded-lg bg-brand py-2 text-white">Log in</button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <button onClick={() => supabase.auth.signOut()} className="rounded-lg border px-3 py-2 text-sm">Logout</button>
      </div>
      <div className="grid gap-4">
        {items.map((item) => (
          <ProblemCard
            key={item.id}
            item={item}
            showAdmin
            onTogglePublic={(record) => patchProblem(record.id, { is_public: !record.is_public })}
            onToggleOpportunity={(record) => patchProblem(record.id, { is_opportunity: !record.is_opportunity })}
            onAddNote={(record) => {
              const note = prompt('Add admin note or startup idea', record.admin_note || '');
              if (note !== null) {
                patchProblem(record.id, { admin_note: note });
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}
