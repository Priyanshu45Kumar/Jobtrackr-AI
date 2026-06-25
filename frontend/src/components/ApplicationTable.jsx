import { Pencil, Trash2 } from "lucide-react";
function ApplicationTable({ applications,onDelete,onEdit }) {
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
  if (applications.length === 0) {
  return (
    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
      <div className="text-6xl mb-4">📂</div>

      <h2 className="text-2xl font-bold text-slate-800">
        No Applications Found
      </h2>

      <p className="text-slate-500 mt-2">
        Start tracking your job applications by adding one.
      </p>
    </div>
  );
}
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="p-4">Company</th>
            <th className="p-4">Role</th>
            <th className="p-4">Status</th>
            <th className="p-4">Follow Up</th>
            <th className="p-4">Notes</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((app) => (
            <tr key={app._id} className="border-t hover:bg-slate-50">
              <td className="p-4 font-semibold">{app.company}</td>
              <td className="p-4">{app.role}</td>
              <td className="p-4">
                <span
  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
    app.status
  )}`}
>
  {app.status}
</span>
              </td>
              <td className="p-4">
                {app.followUpDate
                  ? new Date(app.followUpDate).toLocaleDateString()
                  : "No follow-up"}
              </td>
              <td className="p-4 text-slate-500">{app.notes || "-"}</td>
              <td className="p-4">
  <div className="flex gap-2">
    <button
      onClick={() => onEdit(app)}
      className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
    >
       <Pencil size={18} />
      Edit
    </button>

    <button
      onClick={() => onDelete(app._id)}
      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
    >
      <Trash2 size={18} />
      Delete
    </button>
  </div>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicationTable;