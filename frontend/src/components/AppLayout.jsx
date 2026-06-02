import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import MobileNav from "./MobileNav.jsx";

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <MobileNav />
      {/* sidebar-offset class is injected by Sidebar via a <style> tag and transitions with it */}
      <main className="sidebar-offset px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-10 max-w-6xl mx-auto animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
