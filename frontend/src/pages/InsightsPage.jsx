import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { API_BASE_URL } from '../lib';

export default function InsightsPage() {
  const [insights, setInsights] = useState({ categories: [], topVoted: [], trending: [] });

  useEffect(() => {
    const fetchInsights = async () => {
      const response = await fetch(`${API_BASE_URL}/api/insights`);
      const data = await response.json();
      setInsights(data);
    };
    fetchInsights();
  }, []);

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-semibold">Insights</h2>
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h3 className="mb-4 font-semibold">Most Common Categories</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <BarChart data={insights.categories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="mb-3 font-semibold">Most Upvoted Problems</h3>
          <ul className="space-y-2 text-sm">
            {insights.topVoted.map((item) => (
              <li key={item.id} className="rounded bg-slate-50 p-2">{item.title} ({item.votes} votes)</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="mb-3 font-semibold">Trending Issues</h3>
          <ul className="space-y-2 text-sm">
            {insights.trending.map((item) => (
              <li key={item.id} className="rounded bg-slate-50 p-2">{item.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
