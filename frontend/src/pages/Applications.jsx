import { Plus } from "lucide-react";
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

    setApplications((prev) =>
      prev.filter((app) => app._id !== id)
    );
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <main className="flex-1 p-8">
        {view === "table" &&(
        <div className="bg-gradient-to-r from-zinc-900 to-slate-800 rounded-3xl p-6 shadow-lg mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium">
                Job Management
              </p>

              <h1 className="text-3xl font-bold mt-1">
                Applications
              </h1>

              <p className="text-blue-100 mt-1 text-sm">
                Manage and track your job applications efficiently.
              </p>

              <div className="flex gap-8 mt-5">
                <div>
                  <p className="text-2xl font-bold">
                    {applications.length}
                  </p>
                  <p className="text-blue-200 text-xs">Total</p>
                </div>

                <div>
                  <p className="text-2xl font-bold">
                    {
                      applications.filter(
                        (a) => a.status === "Interview"
                      ).length
                    }
                  </p>
                  <p className="text-blue-200 text-xs">
                    Interviews
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold">
                    {
                      applications.filter(
                        (a) => a.status === "Offer"
                      ).length
                    }
                  </p>
                  <p className="text-blue-200 text-xs">Offers</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingApplication(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-700 font-semibold shadow-md hover:scale-105 transition-all"
            >
              <span className="text-xl"><Plus size={20} /></span>
              
              Add Application
            </button>
          </div>
        </div>
        )}

        {view === "table" && (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-6">
    <div className="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="🔍 Search company or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
      >
        <option value="All">All Status</option>
        <option value="Saved">Saved</option>
        <option value="Applied">Applied</option>
        <option value="Assessment">Assessment</option>
        <option value="Interview">Interview</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
  </div>
)}
        <div className="flex gap-2">
  <button
    onClick={() => setView("table")}
    className={`px-4 py-2 rounded-xl ${
      view === "table"
        ? "bg-slate-900 text-white"
        : "bg-white border"
    }`}
  >
    Table
  </button>

  <button
    onClick={() => setView("kanban")}
    className={`px-4 py-2 rounded-xl ${
      view === "kanban"
        ? "bg-slate-900 text-white"
        : "bg-white border"
    }`}
  >
    Kanban
  </button>
</div>

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
  <KanbanBoard
    applications={applications}
    setApplications={setApplications}
  />
)}

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
                    app._id === updatedApplication._id
                      ? updatedApplication
                      : app
                  )
                );
              } else {
                setApplications((prev) => [
                  updatedApplication,
                  ...prev,
                ]);
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