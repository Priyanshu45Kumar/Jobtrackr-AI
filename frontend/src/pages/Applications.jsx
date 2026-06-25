import { Plus, LayoutList, Columns, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import api from "../api/axios";
import ApplicationTable from "../components/ApplicationTable";
import AddApplicationModal from "../components/AddApplicationModal";
import KanbanBoard from "../components/KanbanBoard";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [view, setView] = useState("table");

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await api.get("/applications");
      setApplications(res.data.applications);
    };
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmDelete) return;
    await api.delete(`/applications/${id}`);
    setApplications((prev) => prev.filter((app) => app._id !== id));
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["Saved", "Applied", "Assessment", "Interview", "Offer", "Rejected"];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">

        {/* Hero */}
        <div className="bg-slate-900 rounded-2xl p-7 text-white mb-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-indigo-500/10 pointer-events-none" />
          <div className="absolute -bottom-14 right-20 w-36 h-36 rounded-full bg-blue-500/10 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/50 mb-4">
                <LayoutList size={11} />
                Job management
              </div>

              <h1 className="text-2xl font-semibold tracking-tight">
                Applications
              </h1>

              <p className="text-sm text-white/45 mt-2 leading-relaxed max-w-md">
                Manage and track your job applications efficiently.
              </p>

              <div className="flex gap-8 mt-5">
                <div>
                  <p className="text-3xl font-semibold leading-none">{applications.length}</p>
                  <p className="text-xs text-white/40 mt-1">Total</p>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <p className="text-3xl font-semibold leading-none">
                    {applications.filter((a) => a.status === "Interview").length}
                  </p>
                  <p className="text-xs text-white/40 mt-1">Interviews</p>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <p className="text-3xl font-semibold leading-none">
                    {applications.filter((a) => a.status === "Offer").length}
                  </p>
                  <p className="text-xs text-white/40 mt-1">Offers</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingApplication(null);
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 transition-colors self-start lg:self-auto flex-shrink-0"
            >
              <Plus size={16} />
              Add application
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search company or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="All">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                view === "table"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <LayoutList size={14} />
              Table
            </button>
            <button
              onClick={() => setView("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                view === "kanban"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Columns size={14} />
              Kanban
            </button>
          </div>
        </div>

        {/* Results count */}
        {view === "table" && (
          <p className="text-xs text-slate-400 mb-3">
            Showing {filteredApplications.length} of {applications.length} applications
          </p>
        )}

        {/* Content */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {view === "table" ? (
            <ApplicationTable
              applications={filteredApplications}
              onDelete={handleDelete}
              onEdit={(app) => {
                setEditingApplication(app);
                setShowModal(true);
              }}
            />
          ) : (
            <div className="p-4">
              <KanbanBoard
                applications={applications}
                setApplications={setApplications}
              />
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <AddApplicationModal
            application={editingApplication}
            onClose={() => {
              setShowModal(false);
              setEditingApplication(null);
            }}
            onApplicationAdded={(updatedApplication) => {
              if (editingApplication) {
                setApplications((prev) =>
                  prev.map((app) =>
                    app._id === updatedApplication._id ? updatedApplication : app
                  )
                );
              } else {
                setApplications((prev) => [updatedApplication, ...prev]);
              }
              setEditingApplication(null);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default Applications;