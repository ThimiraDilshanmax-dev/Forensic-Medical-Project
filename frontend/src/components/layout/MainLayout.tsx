import { useState } from "react";
import { Outlet, Navigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { useApp } from "@/context/AppContext";
import { Menu } from "lucide-react";

export function MainLayout() {
  const { currentUser, setCurrentUser } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-background" style={{ fontFamily: "var(--font-family-body)" }}>
      {/* Mobile Sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar with mobile toggle state props */}
      <Sidebar 
        user={currentUser} 
        onLogout={() => setCurrentUser(null)} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        {/* Mobile Header Bar */}
        <header className="flex md:hidden items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border text-white z-30 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded hover:bg-sidebar-accent text-slate-300 hover:text-white focus:outline-none"
            >
              <Menu size={20} />
            </button>
            <span className="text-sm font-bold" style={{ fontFamily: "var(--font-family-heading)" }}>
              FMD System
            </span>
          </div>
          <span className="text-[10px] bg-sidebar-primary/20 text-blue-300 border border-sidebar-primary/30 rounded px-2 py-0.5 font-medium uppercase tracking-wider">
            {currentUser.role}
          </span>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
