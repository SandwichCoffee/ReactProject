import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type User } from "@/api/userApi";
import { getUsers } from "../../api/userApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("데이터 로딩 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">활동중</Badge>
        );
      case "Inactive":
        return <Badge variant="secondary">비활성</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="space-y-6">
      {/* 1. 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">회원 관리</h2>
          <p className="text-muted-foreground">
            현재 등록된 총 {users.length}명의 회원을 관리합니다.
          </p>
        </div>
        <Button onClick={() => navigate("/users/new")}>+ 신규 등록</Button>
      </div>

      {/* 2. 데이터 테이블 영역 */}
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>권한</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>최근 접속일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // 로딩 중일 때 표시
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  데이터를 불러오는 중입니다...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              // 데이터가 없을 때 표시
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  등록된 회원이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              // 실제 데이터 반복 렌더링
              users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/users/${user.userId}`)}
                    >
                      상세보기
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserList;
