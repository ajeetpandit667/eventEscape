import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventEaseLanding from './pages/Home';
import DiscoverPage from './pages/Discover';
import Host from './pages/Host';
import MyEventsDashboard from './pages/MyEvents';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EventEaseLanding />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/host" element={<Host />} />
        <Route path="/my-events" element={<MyEventsDashboard />} />
        <Route path="/user-login" element={<Login />} />
        <Route path="/user-SignUp" element={<SignUp/>} />
      </Routes>
    </Router>
  );
}