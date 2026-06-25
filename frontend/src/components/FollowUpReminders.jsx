import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function FollowUpReminders({ onReminderDone }) {
  const [followUps, setFollowUps] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    try {
      const res = await api.get("/applications");

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dueApplications = res.data.applications.filter((app) => {
        if (!app.followUpDate) return false;

        const followUpDate = new Date(app.followUpDate);
        followUpDate.setHours(0, 0, 0, 0);

        return (
          followUpDate <= today &&
          app.status !== "Offer" &&
          app.status !== "Rejected"
        );
      });

      setFollowUps(dueApplications);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkDone = async (id) => {
    try {
      setUpdatingId(id);

      await api.put(`/applications/${id}`, {
        followUpDate: null,
      });

      setFollowUps((prev) => prev.filter((app) => app._id !== id));

      if (onReminderDone) {
        onReminderDone();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Follow-up Reminders
          </h2>
          <p className="text-sm text-slate-500">
            Applications that need your attention today.
          </p>
        </div>

        <Link
          to="/applications"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          View all
        </Link>
      </div>

      {followUps.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-6 text-center border border-dashed border-slate-300">
          <p className="text-3xl mb-2">✅</p>
          <h3 className="font-bold text-slate-800">
            No follow-ups due
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            You are up to date with your applications.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {followUps.slice(0, 5).map((app) => (
            <div
              key={app._id}
              className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-slate-100 transition"
            >
              <div>
                <h3 className="font-bold text-slate-900">
                  {app.company}
                </h3>

                <p className="text-sm text-slate-500">
                  {app.role}
                </p>

                <p className="text-xs text-red-500 mt-1 font-medium">
                  Follow-up due:{" "}
                  {new Date(app.followUpDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
                  {app.status}
                </span>

                <button
                  onClick={() => handleMarkDone(app._id)}
                  disabled={updatingId === app._id}
                  className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition"
                >
                  {updatingId === app._id ? "Updating..." : "Mark Done"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FollowUpReminders;