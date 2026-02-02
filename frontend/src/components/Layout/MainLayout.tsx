import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const MainLayout = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      <main className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <header className="h-16 border-b flex items-center px-6 bg-white justify-between">
            <div className="flex items-center">
                {/* 모바일 햄버거 메뉴 버튼 */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden mr-4"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu className="h-6 w-6" />
                </Button>
                <span className="text-sm text-slate-500 hidden md:inline-block">
                    환영합니다, {user?.userName || "게스트"}님!
                </span>
                 <span className="text-sm text-slate-500 md:hidden">
                   PORTFOLIO
                </span>
            </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
