import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  Plus,
  FileText,
  Send,
  Target,
  Trophy,
  XCircle,
  Clock,
  Sparkles,
  BarChart3,
  Mail,
  Bot,
  ClipboardList,
  Bell,
  List,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import DashboardCharts from "../components/DashboardCharts";
import FollowUpReminders from "../components/FollowUpReminders";
import RecentApplications from "../components/RecentApplications";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, setUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/dashboard/stats");
        setStats(res.data);
      } catch (error) {
        console.log(error);
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const statsData = [
    {
      title: "Total",
      value: stats?.totalApplications || 0,
      icon: <FileText size={16} />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Applied",
      value: stats?.applied || 0,
      icon: <Send size={16} />,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Interviews",
      value: stats?.interview || 0,
      icon: <Target size={16} />,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Offers",
      value: stats?.offer || 0,
      icon: <Trophy size={16} />,
      iconBg: "bg-green-50",
      iconColor: "text-green-700",
    },
    {
      title: "Rejected",
      value: stats?.rejected || 0,
      icon: <XCircle size={16} />,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      title: "Follow-ups due",
      value: stats?.followUpsDue || 0,
      icon: <Clock size={16} />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-7 border border-slate-200 text-center max-w-xs w-full">
            <div className="w-11 h-11 mx-auto rounded-xl bg-slate-100 flex items-center justify-center mb-4">
              <BarChart3 size={20} className="text-slate-500 animate-pulse" />
            </div>
            <p className="font-medium text-slate-800 text-sm">Loading dashboard…</p>
            <p className="text-xs text-slate-400 mt-1">Preparing your job search overview.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">

        {/* Hero */}
        <div className="bg-slate-900 rounded-2xl p-7 text-white mb-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-indigo-500/10 pointer-events-none" />
          <div className="absolute -bottom-14 right-20 w-36 h-36 rounded-full bg-emerald-500/10 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/50 mb-4">
                <Sparkles size={11} />
                Career command center
              </div>

              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back, {user?.name || "User"} 👋
              </h1>

              <p className="text-sm text-white/50 mt-2 leading-relaxed max-w-md">
                Track your applications, follow-ups, interviews, resume score,
                and AI-powered tools from one place.
              </p>

              <div className="flex flex-wrap gap-3 mt-5">
                <Link
                  to="/applications"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 transition-colors"
                >
                  <Plus size={15} />
                  Manage applications
                </Link>
                <Link
                  to="/resume-analyzer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/15 transition-colors"
                >
                  <FileText size={15} />
                  Analyze resume
                </Link>
              </div>
            </div>

            <div className="bg-white/8 border border-white/10 rounded-2xl p-5 min-w-[192px] flex-shrink-0">
              <p className="text-[11px] text-white/40 mb-2">Current progress</p>
              <p className="text-5xl font-semibold text-white leading-none">
                {stats?.totalApplications || 0}
              </p>
              <p className="text-xs text-white/40 mt-2">Total applications tracked</p>
              <button
                onClick={handleLogout}
                className="mt-5 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/25 transition-colors"
              >
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Quick Actions */}
        <SectionLabel>Quick actions</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <QuickAction
            to="/cold-email"
            icon={<Mail size={18} />}
            title="Cold email generator"
            description="Create recruiter outreach emails powered by AI."
          />
          <QuickAction
            to="/interview-assistant"
            icon={<Bot size={18} />}
            title="Interview assistant"
            description="Generate HR, DSA, technical and project questions."
          />
          <QuickAction
            to="/applications"
            icon={<ClipboardList size={18} />}
            title="Application tracker"
            description="Manage your jobs with table and Kanban views."
          />
        </div>

        {/* Stats */}
        <SectionLabel>Overview</SectionLabel>
<div className="grid grid-cols-6 gap-3 mb-6">
  {statsData.map((item) => (
    <StatCard key={item.title} {...item} />
  ))}
</div>

        {/* Charts + Follow-ups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {stats && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
                <BarChart3 size={15} className="text-slate-400" />
                Application activity
              </p>
              <DashboardCharts stats={stats} />
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
              <Bell size={15} className="text-slate-400" />
              Follow-up reminders
            </p>
            <FollowUpReminders
              onReminderDone={() =>
                setStats((prev) => ({
                  ...prev,
                  followUpsDue: Math.max((prev?.followUpsDue || 0) - 1, 0),
                }))
              }
            />
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
            <List size={15} className="text-slate-400" />
            Recent applications
          </p>
          <RecentApplications />
        </div>

      </main>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
      {children}
    </p>
  );
}

function StatCard({ title, value, icon, iconBg, iconColor }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-semibold text-slate-900 leading-none">{value}</p>
      <p className="text-[11px] text-slate-400 mt-1">{title}</p>
    </div>
  );
}

function QuickAction({ to, icon, title, description }) {
  return (
    <Link
      to={to}
      className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-150"
    >
      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-150">
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-800">{title}</p>
      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{description}</p>
    </Link>
  );
}

export default Dashboard;