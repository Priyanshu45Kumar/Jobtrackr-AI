import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import api from "../api/axios";

const statuses = [
  { name: "Saved", color: "bg-slate-500", light: "bg-slate-50" },
  { name: "Applied", color: "bg-blue-500", light: "bg-blue-50" },
  { name: "Assessment", color: "bg-yellow-500", light: "bg-yellow-50" },
  { name: "Interview", color: "bg-purple-500", light: "bg-purple-50" },
  { name: "Offer", color: "bg-green-500", light: "bg-green-50" },
  { name: "Rejected", color: "bg-red-500", light: "bg-red-50" },
];

function KanbanCard({ app }) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: app._id,
    });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: 50,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white rounded-xl p-3 shadow-sm border border-slate-200 hover:shadow-md cursor-grab active:cursor-grabbing transition"
    >
      <h3 className="font-semibold text-slate-900 text-sm truncate">
        {app.company}
      </h3>

      <p className="text-xs text-slate-500 mt-1 truncate">
        {app.role}
      </p>

      {app.followUpDate && (
        <p className="text-[11px] text-slate-400 mt-2">
          📅 {new Date(app.followUpDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

function KanbanColumn({ status, applications }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status.name,
  });

  const filtered = applications.filter(
    (app) => app.status === status.name
  );

  return (
    <div
      ref={setNodeRef}
      className={`rounded-3xl border p-4 min-h-[250px] transition ${
        isOver
          ? "border-slate-500 bg-white"
          : `border-slate-200 ${status.light}`
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${status.color}`} />

          <h2 className="font-bold text-slate-800 text-sm">
            {status.name}
          </h2>
        </div>

        <span className="text-xs font-semibold bg-white px-3 py-1 rounded-full text-slate-600 border">
          {filtered.length}
        </span>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center text-xs text-slate-400 bg-white/60">
            Drop here
          </div>
        ) : (
          filtered.map((app) => (
            <KanbanCard key={app._id} app={app} />
          ))
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

    const draggedApplication = applications.find(
      (app) => app._id === applicationId
    );

    if (!draggedApplication) return;
    if (draggedApplication.status === newStatus) return;

    setApplications((prev) =>
      prev.map((app) =>
        app._id === applicationId
          ? { ...app, status: newStatus }
          : app
      )
    );

    try {
      await api.put(`/applications/${applicationId}`, {
        status: newStatus,
      });
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
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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