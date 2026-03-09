import { useEffect, useState } from 'react';
import ProblemCard from '../components/ProblemCard';
import { API_BASE_URL } from '../lib';

export default function PublicFeedPage() {
  const [items, setItems] = useState([]);

  const fetchPublic = async () => {
    const response = await fetch(`${API_BASE_URL}/api/problems/public`);
    const data = await response.json();
    setItems(data || []);
  };

  useEffect(() => {
    fetchPublic();
  }, []);

  const upvote = async (id) => {
    await fetch(`${API_BASE_URL}/api/problems/${id}/upvote`, { method: 'POST' });
    fetchPublic();
  };

  return (
    <section>
      <h2 className="mb-5 text-2xl font-semibold">Public Problem Feed</h2>
      <div className="grid gap-4">
        {items.map((item) => (
          <ProblemCard key={item.id} item={item} onUpvote={upvote} />
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">No public problems yet.</p>}
      </div>
    </section>
  );
}
