import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function FollowUpReminders({ onReminderDone }) {
  const [followUps, setFollowUps] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowUps();
  }, []);

 const fetchFollowUps = async () => {
  try {
    const res = await api.get("/applications");

    const dueApplications = res.data.applications.filter((app) => {
      if (!app.followUpDate) return false;

      return (
        app.status !== "Offer" &&
        app.status !== "Rejected"
      );
    });

    // Sort by follow-up date ascending (soonest first)
    dueApplications.sort(
      (a, b) => new Date(a.followUpDate) - new Date(b.followUpDate)
    );

    setFollowUps(dueApplications);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
  const handleMarkDone = async (id) => {
    try {
      setUpdatingId(id);
      await api.put(`/applications/${id}`, { followUpDate: null });
      setFollowUps((prev) => prev.filter((app) => app._id !== id));
      if (onReminderDone) onReminderDone();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-8">
      <p className="text-sm text-slate-400">Loading…</p>
    </div>
  );

  if (followUps.length === 0) return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
        <span className="text-lg">🔔</span>
      </div>
      <p className="text-sm font-medium text-slate-500">No reminders</p>
      <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-slate-400">
          {followUps.length} application{followUps.length > 1 ? "s" : ""} need attention
        </p>
        <Link to="/applications" className="text-xs font-medium text-blue-600 hover:underline">
          View all
        </Link>
      </div>

      {followUps.slice(0, 5).map((app) => (
        <div
          key={app._id}
          className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-xl p-3.5 hover:bg-slate-100 transition"
        >
          <div>
            <p className="text-sm font-medium text-slate-800">{app.company}</p>
            <p className="text-xs text-slate-400">{app.role}</p>
            <p className="text-xs text-red-400 mt-0.5">
              Due: {new Date(app.followUpDate).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
              {app.status}
            </span>
            <button
              onClick={() => handleMarkDone(app._id)}
              disabled={updatingId === app._id}
              className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-60 transition"
            >
              {updatingId === app._id ? "Updating…" : "Mark done"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FollowUpReminders;