import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import { useAuth } from "../context/AuthContext";
import DashboardCharts from "../components/DashboardCharts";
import FollowUpReminders from "../components/FollowUpReminders";
import RecentApplications from "../components/RecentApplications";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
  try {
    await api.post("/auth/logout");
    navigate("/login");
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold text-slate-900">
      Welcome back, {user?.name} 👋
    </h1>

    <p className="text-slate-500 mt-2">
      Here's your job application overview.
    </p>
  </div>

  <button
    onClick={handleLogout}
    className="px-5 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
  >
    Logout
  </button>
</div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <StatsCard title="Total Applications" value={stats?.totalApplications || 0} icon="📄" />
          <StatsCard title="Applied" value={stats?.applied || 0} icon="🚀" />
          <StatsCard title="Interviews" value={stats?.interview || 0} icon="🎯" />
          <StatsCard title="Offers" value={stats?.offer || 0} icon="🏆" />
          <StatsCard title="Rejected" value={stats?.rejected || 0} icon="❌" />
          <StatsCard title="Follow-ups Due" value={stats?.followUpsDue || 0} icon="⏰" />
        </div>
        {stats && <DashboardCharts stats={stats} />}
        <FollowUpReminders
  onReminderDone={() =>
    setStats((prev) => ({
      ...prev,
      followUpsDue: Math.max((prev?.followUpsDue || 0) - 1, 0),
    }))
  }
/>
    <RecentApplications />
      </main>
    </div>
  );
}

export default Dashboard;