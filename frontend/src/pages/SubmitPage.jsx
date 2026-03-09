import { useState } from 'react';
import { API_BASE_URL } from '../lib';

const categories = ['Academics', 'Coding', 'Internships', 'Campus Life', 'Startups', 'Facilities', 'Other'];

export default function SubmitPage() {
  const [form, setForm] = useState({ title: '', description: '', category: categories[0], email: '', screenshotUrl: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitProblem = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');
    const response = await fetch(`${API_BASE_URL}/api/problems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        category: form.category,
        contact_email: form.email || null,
        screenshot_url: form.screenshotUrl || null
      })
    });

    if (!response.ok) {
      setMessage('Unable to submit problem right now. Please try again.');
      return;
    }

    setForm({ title: '', description: '', category: categories[0], email: '', screenshotUrl: '' });
    setMessage('Thanks! Your anonymous problem is submitted.');
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <form onSubmit={submitProblem} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-1 text-2xl font-semibold">Anonymous Problem Submission</h2>
        <p className="mb-6 text-sm text-slate-600">Share what you’re facing in college—no name required.</p>
        <div className="space-y-4">
          <input name="title" value={form.title} onChange={handleChange} required placeholder="Problem Title" className="w-full rounded-lg border p-3" />
          <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Problem Description" className="h-36 w-full rounded-lg border p-3" />
          <select name="category" value={form.category} onChange={handleChange} className="w-full rounded-lg border p-3">
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <input
            name="screenshotUrl"
            value={form.screenshotUrl}
            onChange={handleChange}
            placeholder="Optional Screenshot URL"
            className="w-full rounded-lg border p-3"
          />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Optional Email" type="email" className="w-full rounded-lg border p-3" />
          <button className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white hover:bg-blue-600">Submit Problem</button>
        </div>
        {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
      </form>

      <aside className="space-y-4 rounded-2xl bg-slate-900 p-6 text-slate-100 shadow-sm">
        <h3 className="text-xl font-semibold">Why Campus Problem Hub?</h3>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>Capture real, unfiltered student pain points.</li>
          <li>Spot trends that can turn into startup ideas.</li>
          <li>Build a transparent feedback loop with admin support.</li>
        </ul>
      </aside>
    </section>
  );
}
