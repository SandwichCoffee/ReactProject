import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuGroups = [
    {
      label: "ANALYTICS",
      items: [{ name: "대시보드", path: "/", icon: LayoutDashboard }],
    },
    {
      label: "MANAGEMENT",
      items: [
        { name: "회원 관리", path: "/users", icon: Users },
        { name: "상품 관리", path: "/products", icon: ShoppingBag },
        { name: "채용 공고", path: "/recruits", icon: FileText },
      ].filter((item) => {
        if (item.path === "/users" && user?.role !== "Admin") return false;
        return true;
      }),
    },
    {
      label: "SYSTEM",
      items: [
        { name: "시스템 설정", path: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* 모바일 오버레이 (배경 어둡게) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={`
          fixed left-0 top-0 h-screen bg-slate-900 text-white flex flex-col border-r border-slate-800 z-50 transition-transform duration-300
          w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
      {/* 1. 로고 영역 */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 font-bold">
          P
        </div>
        <span className="text-lg font-bold tracking-wider">PORTFOLIO</span>
      </div>

      {/* 2. 메뉴 영역 (스크롤 가능) */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* 섹션 라벨 */}
            <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {group.label}
            </div>

            {/* 메뉴 아이템들 */}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose} // 모바일에서 메뉴 클릭 시 닫기
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white font-medium" // 활성화 상태
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800" // 비활성화 상태
                    }`
                  }
                >
                  {/* 아이콘 컴포넌트 렌더링 */}
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* 3. 하단 로그아웃 영역 */}
      <div className="p-4 border-t border-slate-800">
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center w-full px-3 py-2 text-sm text-slate-400 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              로그아웃
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>로그아웃</DialogTitle>
              <DialogDescription>
                정말 로그아웃 하시겠습니까?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  취소
                </Button>
              </DialogClose>
              <Button variant="destructive" onClick={() => {
                  dispatch(logout());
                  window.location.href = "/login";
              }}>
                로그아웃
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </aside>
    </>
  );
}
