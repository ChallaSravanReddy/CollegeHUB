import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import SubmitPage from './pages/SubmitPage';
import PublicFeedPage from './pages/PublicFeedPage';
import InsightsPage from './pages/InsightsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SubmitPage />} />
        <Route path="/feed" element={<PublicFeedPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Layout>
  );
}
