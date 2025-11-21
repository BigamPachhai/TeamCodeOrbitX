import { Routes, Route } from "react-router-dom";

import Hero from "../pages/Hero";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Feed from "../pages/Feed";
import ReportIssue from "../pages/ReportIssue";
import IssueDetails from "../pages/IssueDetails";
import Profile from "../pages/Profile";
import Leaderboard from "../pages/Leaderboard";
import Heatmap from "../pages/Heatmap";
import FAQ from "../pages/FAQ";
import About from "../pages/About";
import ContactGov from "../pages/ContactGov";
import Statistics from "../pages/Statistics";
import AdminDashboard from "../pages/AdminDashboard";
import AdminIssueDetails from "../pages/AdminIssueDetails";

import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Hero />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<ContactGov />} />
      <Route path="/stats" element={<Statistics />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
      />

      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <ReportIssue />
          </ProtectedRoute>
        }
      />

      <Route path="/issue/:id" element={<IssueDetails />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* General but public */}
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/heatmap" element={<Heatmap />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/issue/:id" element={<AdminIssueDetails />} />
    </Routes>
  );
}
