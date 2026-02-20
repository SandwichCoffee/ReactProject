import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Briefcase, 
  FileText,
  UserCircle,
  X,
  LogOut,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { Avatar, AvatarFallback/*, AvatarImage*/ } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsLogoutDialogOpen(false); // 모달 닫기
    navigate("/login");
    if (onClose) onClose();
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: UserCircle, label: "Resume", path: "/resume" },
    ...(user?.role === "ADMIN" ? [{ icon: Users, label: "Users", path: "/users" }] : []),
    { icon: Package, label: "Products", path: "/products" },
    { icon: Briefcase, label: "Recruits", path: "/recruits" },
    { icon: FileText, label: "Devlogs", path: "/devlogs" }
  ]

  return (
    <>
      <aside className="h-full w-64 bg-white border-r border-border flex flex-col">
        {/* 상단 로고 */}
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Portfolio</span>
          </Link>

          <Button variant="ghost" size="icon" className="md:hidden text-slate-500" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 메뉴 */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                            (item.path !== "/" && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground font-medium" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 px-2">
              <Avatar className="h-9 w-9">
                {/* <AvatarImage src="" />  */}
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.email ? user.email.substring(0, 2).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-slate-900 truncate">
                  {user.userName || "사용자"}
                </span>
                <span className="text-xs text-slate-500 truncate">
                  {user.email || "user@example.com"}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-400 hover:text-destructive"
                onClick={() => setIsLogoutDialogOpen(true)}
                title="로그아웃"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full gap-2" 
              onClick={() => {
                navigate("/login");
                if (onClose) onClose();
              }}
            >
              <LogIn className="h-4 w-4" />
              로그인
            </Button>
          )}
        </div>
      </aside>
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">
                로그아웃
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-base mt-2">
                정말 로그아웃 하시겠습니까?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:justify-end mt-4">
              {/* 취소 버튼: Outline 스타일 (회색 테두리) */}
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsLogoutDialogOpen(false)}
                className="flex-1 sm:flex-none border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                취소
              </Button>
              {/* 확인 버튼: Default (Primary) 스타일 (파란색 채움) */}
              <Button 
                type="button" 
                variant="default" // primary 색상 사용
                onClick={handleLogout}
                className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
              >
                확인
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
  );
}
