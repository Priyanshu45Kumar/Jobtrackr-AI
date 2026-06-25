import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function FollowUpReminders() {
  const [followUps, setFollowUps] = useState([]);

  useEffect(() => {
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

    fetchFollowUps();
  }, []);

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
              className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-slate-100 transition"
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

              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FollowUpReminders;