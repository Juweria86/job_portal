import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import "./App.css"
import HomePage from './pages/home';
import JobsPage from './pages/jobs';
import ApplyPage from './pages/apply_job';
import ApplicantDetail from './pages/admin/applicants';
import AdminDashboard from './pages/admin/dashboard';
import CreateJob from './pages/admin/create_job';
import EditJob from './pages/admin/edit_job';
import { LogIn } from 'lucide-react';
import AdminLogin from './pages/admin/login';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // simulate admin login session
    const stored = localStorage.getItem('isAdmin');
    setIsAdmin(stored === 'true');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/apply/:id" element={<ApplyPage />} />
        <Route path="/applicants" element={<ApplicantDetail />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="/edit-job" element={<EditJob />} />
        <Route path="/login" element={<AdminLogin />} />





        
      </Routes>
    </Router>
  );
}

export default App;
