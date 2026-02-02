import { useEffect, useState } from "react";
import { useParams, Outlet, NavLink, useNavigate } from "react-router-dom";
import { getUserById } from "@/api/userApi";
import { type User } from "@/api/userApi";
import { ArrowLeft, Mail, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-separator";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await getUserById(id);
        setUser(data || null);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (!user) return <div>존재하지 않는 회원입니다.</div>;

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/users")}
        className="gap-2 pl-0 hover:pl-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userName}`}
            />
            <AvatarFallback>{user.userName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl flex items-center gap-2">
              {user.userName}
              <Badge
                variant={user.status === "Active" ? "default" : "secondary"}
              >
                {user.status}
              </Badge>
            </CardTitle>
            <CardDescription>{user.userId}</CardDescription>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail className="w-4 h-4" />
            {user.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Shield className="w-4 h-4" /> 권한: {user.role}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            최근 접속: {user.lastLogin}
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flx border-b mb-4">
          <TabLink to="activity">활동 내역</TabLink>
          <TabLink to="settings">계정 설정</TabLink>
        </div>

        <div className="bg-white rounded-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const TabLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        isActive
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-slate-500 hover:text-slate-700"
      }`
    }
  >
    {children}
  </NavLink>
);

export default UserDetail;
