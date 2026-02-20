import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const getPageTitle = (pathname: string) => {
      if (pathname === "/" || pathname === "/dashboard") return "Dashboard";
      if (pathname.startsWith("/users")) return "User Management";
      if (pathname.startsWith("/products")) return "Product List";
      if (pathname.startsWith("/recruits")) return "Recruitment";
      if (pathname.startsWith("/devlogs")) return "Dev Logs";
      if (pathname.startsWith("/cart")) return "Shopping Cart";
      if (pathname.startsWith("/settings")) return "My Settings";
      return "Portfolio";
    };

    return (
      <div className="min-h-screen bg-muted flex relative">
        {/* 모바일용 사이드바 */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* 사이드바 */}
        <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:transform-none md:flex ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* 상단 헤더 */}
          <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0">
            <div className="flex items-center gap-4">
              {/* 모바일 햄버거 버튼 */}
              <Button variant="ghost" size="icon" className="md:hidden text-slate-600" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-xl font-semibold text-slate-900 hidden sm:block">{getPageTitle(location.pathname)}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/settings")} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                <User className="h-5 w-5" />
              </Button>
            </div>
        </header>

        {/* 실제 페이지 내용 렌더링 */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
        </div>
      </div>
    );
};

export default MainLayout;
