import { Pencil, Trash2, CalendarDays, FileText } from "lucide-react";

function ApplicationTable({ applications, onDelete, onEdit }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Saved":       return "bg-slate-100 text-slate-600";
      case "Applied":     return "bg-blue-50 text-blue-600";
      case "Assessment":  return "bg-amber-50 text-amber-600";
      case "Interview":   return "bg-violet-50 text-violet-600";
      case "Offer":       return "bg-emerald-50 text-emerald-600";
      case "Rejected":    return "bg-red-50 text-red-500";
      default:            return "bg-slate-100 text-slate-600";
    }
  };

  const getDotColor = (status) => {
    switch (status) {
      case "Saved":       return "bg-slate-400";
      case "Applied":     return "bg-blue-500";
      case "Assessment":  return "bg-amber-500";
      case "Interview":   return "bg-violet-500";
      case "Offer":       return "bg-emerald-500";
      case "Rejected":    return "bg-red-500";
      default:            return "bg-slate-400";
    }
  };

  if (applications.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <FileText size={22} className="text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600">No applications found</p>
        <p className="text-xs text-slate-400 mt-1">Add one to start tracking your job search.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">Company</th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">Role</th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">Status</th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">Follow-up</th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">Notes</th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {applications.map((app) => (
            <tr
              key={app._id}
              className="group hover:bg-slate-50 transition-colors"
            >
              {/* Company */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-slate-600">
                    {app.company.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-800">{app.company}</span>
                </div>
              </td>

              {/* Role */}
              <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{app.role}</td>

              {/* Status */}
              <td className="px-5 py-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(app.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(app.status)}`} />
                  {app.status}
                </span>
              </td>

              {/* Follow-up */}
              <td className="px-5 py-4">
                {app.followUpDate ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays size={12} className="text-slate-400" />
                    {new Date(app.followUpDate).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-xs text-slate-300">—</span>
                )}
              </td>

              {/* Notes */}
              <td className="px-5 py-4 max-w-[200px]">
                {app.notes ? (
                  <p className="text-xs text-slate-400 truncate">{app.notes}</p>
                ) : (
                  <span className="text-xs text-slate-300">—</span>
                )}
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(app)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(app._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} />
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