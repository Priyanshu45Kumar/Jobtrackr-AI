import { NavLink } from "react-router-dom";
import { useState } from "react";

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
    isActive
      ? "bg-blue-600 text-white"
      : "hover:bg-slate-800 text-slate-300"
  }`;

function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`hidden md:flex min-h-screen bg-slate-950 text-white p-5 flex-col transition-all duration-300 ${
        open ? "w-72" : "w-24"
      }`}
    >
      <div className="flex items-center justify-between mb-10">
        {open && (
          <div>
            <h1 className="text-2xl font-bold">JobTrackr AI</h1>
            <p className="text-sm text-slate-400">Career command center</p>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg"
        >
          {open ? "←" : "→"}
        </button>
      </div>

      <nav className="space-y-3">
        <NavLink to="/" className={navLinkClass}>
          <span>📊</span>
          {open && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/applications" className={navLinkClass}>
          <span>📁</span>
          {open && <span>Applications</span>}
        </NavLink>

        <NavLink to="/resume-analyzer" className={navLinkClass}>
          <span>📄</span>
          {open && <span>Resume Analyzer</span>}
        </NavLink>

        <NavLink to="/interview-assistant" className={navLinkClass}>
          <span>🤖</span>
          {open && <span>Interview Assistant</span>}
        </NavLink>

        <NavLink to="/cold-email" className={navLinkClass}>
          <span>📧</span>
          {open && <span>Cold Email</span>}
        </NavLink>
      </nav>

      {open && (
        <div className="mt-auto bg-white/10 p-4 rounded-2xl">
          <p className="text-sm text-slate-300">
            Upgrade your job search with AI.
          </p>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;