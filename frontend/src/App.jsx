import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Emissions from './pages/Emissions';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import Simulator from './pages/Simulator';
import Opportunities from './pages/Opportunities';
import Report from './pages/Report';
import { Leaf, LayoutDashboard, Calculator, Lightbulb, Zap, FileText, Target } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  
  if (isLanding) return null;

  const isActive = (path) => location.pathname === path ? 'text-primary border-b-2 border-primary font-semibold' : 'text-slate-500 hover:text-slate-900';

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-slate-900">CarbonROI</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/setup" className={`inline-flex items-center px-1 pt-1 text-sm ${isActive('/setup')}`}>
                Setup
              </Link>
              <Link to="/emissions" className={`inline-flex items-center px-1 pt-1 text-sm ${isActive('/emissions')}`}>
                <Calculator className="w-4 h-4 mr-2" /> Emissions
              </Link>
              <Link to="/dashboard" className={`inline-flex items-center px-1 pt-1 text-sm ${isActive('/dashboard')}`}>
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </Link>
              <Link to="/recommendations" className={`inline-flex items-center px-1 pt-1 text-sm ${isActive('/recommendations')}`}>
                <Lightbulb className="w-4 h-4 mr-2" /> AI Advisor
              </Link>
              <Link to="/simulator" className={`inline-flex items-center px-1 pt-1 text-sm ${isActive('/simulator')}`}>
                <Target className="w-4 h-4 mr-2" /> Simulator
              </Link>
              <Link to="/opportunities" className={`inline-flex items-center px-1 pt-1 text-sm ${isActive('/opportunities')}`}>
                <Zap className="w-4 h-4 mr-2" /> Carbon Market
              </Link>
              <Link to="/report" className={`inline-flex items-center px-1 pt-1 text-sm ${isActive('/report')}`}>
                <FileText className="w-4 h-4 mr-2" /> Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/emissions" element={<Emissions />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
