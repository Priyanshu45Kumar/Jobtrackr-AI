import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function RecentApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchRecentApplications = async () => {
      try {
        const res = await api.get("/applications");
        setApplications(res.data.applications.slice(0, 5));
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecentApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Saved":
        return "bg-slate-100 text-slate-700";
      case "Applied":
        return "bg-blue-100 text-blue-700";
      case "Assessment":
        return "bg-yellow-100 text-yellow-700";
      case "Interview":
        return "bg-purple-100 text-purple-700";
      case "Offer":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Recent Applications
          </h2>
          <p className="text-sm text-slate-500">
            Your latest job applications.
          </p>
        </div>

        <Link
          to="/applications"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          View all
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-6 text-center border border-dashed border-slate-300">
          <p className="text-3xl mb-2">📂</p>
          <h3 className="font-bold text-slate-800">
            No recent applications
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Add your first application to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
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

                <p className="text-xs text-slate-400 mt-1">
                  Added on{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  app.status
                )}`}
              >
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentApplications;