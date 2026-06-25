import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { CalendarDays } from "lucide-react";
import api from "../api/axios";

const statuses = [
  { name: "Saved",      dot: "bg-slate-400",   pill: "bg-slate-100 text-slate-600",   header: "bg-slate-50  border-slate-200" },
  { name: "Applied",    dot: "bg-blue-500",    pill: "bg-blue-50  text-blue-600",     header: "bg-blue-50   border-blue-100"  },
  { name: "Assessment", dot: "bg-amber-500",   pill: "bg-amber-50 text-amber-600",    header: "bg-amber-50  border-amber-100" },
  { name: "Interview",  dot: "bg-violet-500",  pill: "bg-violet-50 text-violet-600",  header: "bg-violet-50 border-violet-100"},
  { name: "Offer",      dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-600",header: "bg-emerald-50 border-emerald-100"},
  { name: "Rejected",   dot: "bg-red-400",     pill: "bg-red-50   text-red-500",      header: "bg-red-50    border-red-100"  },
];

function KanbanCard({ app }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: app._id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white rounded-lg p-2.5 border border-slate-200 cursor-grab active:cursor-grabbing transition-all select-none ${
        isDragging ? "opacity-50 shadow-lg scale-95" : "hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      {/* Company avatar + name */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0 text-[10px] font-semibold text-slate-600">
          {app.company.charAt(0).toUpperCase()}
        </div>
        <p className="text-xs font-medium text-slate-800 truncate">{app.company}</p>
      </div>

      {/* Role */}
      <p className="text-[11px] text-slate-400 truncate pl-0.5">{app.role}</p>

      {/* Follow-up date */}
      {app.followUpDate && (
        <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-slate-100">
          <CalendarDays size={10} className="text-slate-400 flex-shrink-0" />
          <p className="text-[10px] text-slate-400">
            {new Date(app.followUpDate).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
function KanbanColumn({ status, applications }) {
  const { setNodeRef, isOver } = useDroppable({ id: status.name });
  const filtered = applications.filter((app) => app.status === status.name);

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border flex flex-col min-h-[280px] transition-all ${
        isOver
          ? "border-slate-400 bg-slate-50 shadow-inner"
          : "border-slate-200 bg-slate-50/60"
      }`}
    >
      {/* Column header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-2xl border-b ${status.header}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
          <span className="text-xs font-semibold text-slate-700">{status.name}</span>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${status.pill}`}>
          {filtered.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 p-3 space-y-2">
        {filtered.length === 0 ? (
          <div className={`h-full min-h-[160px] flex items-center justify-center rounded-xl border border-dashed transition-colors ${
            isOver ? "border-slate-400 bg-white" : "border-slate-200"
          }`}>
            <p className="text-xs text-slate-300">Drop here</p>
          </div>
        ) : (
          filtered.map((app) => <KanbanCard key={app._id} app={app} />)
        )}
      </div>
    </div>
  );
}

function KanbanBoard({ applications, setApplications }) {
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const applicationId = active.id;
    const newStatus = over.id;
    const draggedApplication = applications.find((app) => app._id === applicationId);

    if (!draggedApplication || draggedApplication.status === newStatus) return;

    setApplications((prev) =>
      prev.map((app) =>
        app._id === applicationId ? { ...app, status: newStatus } : app
      )
    );

    try {
      await api.put(`/applications/${applicationId}`, { status: newStatus });
    } catch (error) {
      console.log(error);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? { ...app, status: draggedApplication.status }
            : app
        )
      );
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statuses.map((status) => (
          <KanbanColumn
            key={status.name}
            status={status}
            applications={applications}
          />
        ))}
      </div>
    </DndContext>
  );
}

export default KanbanBoard;