import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Bot,
  Mail,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const navItems = [
  { to: "/",                    icon: <LayoutDashboard size={18} />, label: "Dashboard"          },
  { to: "/applications",        icon: <FolderOpen size={18} />,      label: "Applications"       },
  { to: "/resume-analyzer",     icon: <FileText size={18} />,        label: "Resume Analyzer"    },
  { to: "/interview-assistant", icon: <Bot size={18} />,             label: "Interview Assistant"},
  { to: "/cold-email",          icon: <Mail size={18} />,            label: "Cold Email"         },
];

function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 bg-slate-950 text-white transition-all duration-300 ${
        open ? "w-60" : "w-16"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 pt-5 pb-4 border-b border-white/8 ${!open && "justify-center px-0"}`}>
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
          <Sparkles size={15} className="text-indigo-400" />
        </div>
        {open && (
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white leading-tight">JobTrackr AI</p>
            <p className="text-[11px] text-slate-500 leading-tight">Career command center</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                open ? "" : "justify-center"
              } ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/6 hover:text-slate-200"
              }`
            }
            title={!open ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <span className={`flex-shrink-0 ${isActive ? "text-indigo-400" : ""}`}>
                  {icon}
                </span>
                {open && (
                  <span className="truncate font-medium">{label}</span>
                )}
                {open && isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Upgrade banner (collapsed = hidden) */}
      {open && (
        <div className="mx-2 mb-3 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/15">
          <p className="text-xs font-medium text-indigo-300">
            AI-powered job search
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
            Track smarter, apply faster, land sooner.
          </p>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center gap-2 mx-2 mb-4 py-2 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:bg-white/10 hover:text-white text-xs font-medium transition-colors`}
      >
        {open ? (
          <>
            <ChevronLeft size={14} />
            <span>Collapse</span>
          </>
        ) : (
          <ChevronRight size={14} />
        )}
      </button>
    </aside>
  );
}

export default Sidebar;