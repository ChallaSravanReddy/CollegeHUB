import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { supabaseAdmin } from './supabase.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const adminEmail = process.env.ADMIN_EMAIL;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (adminEmail && data.user.email !== adminEmail) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  req.user = data.user;
  next();
};

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/problems', async (req, res) => {
  const { title, description, category, screenshot_url, contact_email } = req.body;
  const payload = { title, description, category, screenshot_url, contact_email };

  const { data, error } = await supabaseAdmin.from('problems').insert([payload]).select().single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
});

app.get('/api/problems/public', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('problems')
    .select('*')
    .eq('is_public', true)
    .order('votes', { ascending: false });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

app.post('/api/problems/:id/upvote', async (req, res) => {
  const { id } = req.params;
  const { data: current, error: fetchError } = await supabaseAdmin.from('problems').select('votes').eq('id', id).single();
  if (fetchError || !current) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  const { data, error } = await supabaseAdmin
    .from('problems')
    .update({ votes: current.votes + 1 })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

app.get('/api/admin/problems', verifyAdmin, async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('problems').select('*').order('created_at', { ascending: false });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

app.patch('/api/admin/problems/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { is_public, is_opportunity, admin_note, solution_comment, tags } = req.body;

  const updates = { is_public, is_opportunity, admin_note, solution_comment, tags };
  Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

  const { data, error } = await supabaseAdmin.from('problems').update(updates).eq('id', id).select().single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

app.get('/api/insights', async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('problems').select('id,title,category,votes,created_at');

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const categoryMap = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.entries(categoryMap).map(([category, count]) => ({ category, count }));
  const topVoted = [...data].sort((a, b) => b.votes - a.votes).slice(0, 5);
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const trending = data
    .filter((item) => new Date(item.created_at).getTime() >= oneWeekAgo)
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5);

  res.json({ categories, topVoted, trending });
});

app.listen(port, () => {
  console.log(`Campus Problem Hub backend running on http://localhost:${port}`);
});
