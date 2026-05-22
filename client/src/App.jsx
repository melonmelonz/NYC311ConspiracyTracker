import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import MapPage from './pages/MapPage';
import Analytics from './pages/Analytics';

export default function App() {
  const location = useLocation();

  return (
    <div className="app-shell min-h-screen bg-matte text-aged">
      <div className="film-grain" />
      <div className="vignette" />
      <Sidebar />
      <main className="relative z-10 min-h-screen lg:pl-[18rem]">
        <TopBar />
        <section key={location.pathname} className="page-transition px-4 pb-10 pt-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </section>
      </main>
    </div>
  );
}
