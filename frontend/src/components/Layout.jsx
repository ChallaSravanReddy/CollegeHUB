import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-brand text-white' : 'text-slate-700 hover:bg-slate-200'
  }`;

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Campus Problem Hub</h1>
            <p className="text-xs text-slate-500">Anonymous issues. Shared solutions. Real opportunities.</p>
          </div>
          <nav className="flex gap-2">
            <NavLink className={linkClass} to="/">Submit</NavLink>
            <NavLink className={linkClass} to="/feed">Public Feed</NavLink>
            <NavLink className={linkClass} to="/insights">Insights</NavLink>
            <NavLink className={linkClass} to="/admin">Admin</NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
