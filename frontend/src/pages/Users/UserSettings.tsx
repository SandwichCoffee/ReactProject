import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser, deleteUser, type User } from "@/api/userApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { updateUser as updateUserAction, logout } from "@/store/slices/authSlice";

const UserSettings = ({ userId }: { userId?: string }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = userId || paramId;

  const [formData, setFormData] = useState<Partial<User>>({
    userName: "",
    email: "",
    role: "User",
    status: "Active",
  });

  useEffect(() => {
    if (id) {
      getUserById(id).then((data) => {
        setFormData({
          userName: data.userName,
          email: data.email,
          role: data.role,
          status: data.status,
        });
      });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async () => {
    if (!id) return;

    try {
      await updateUser(id, formData);
      toast.success("성공적으로 수정되었습니다.");
      
      if (userId || (!userId && id === 'current_user_id_placeholder')) { 
         dispatch(updateUserAction(formData));
         navigate("/");
      } else {
         navigate("/users");
      }
      
      if (!userId && id !== 'current_user_id_placeholder') { 
           navigate(0);
      }
    } catch (error) {
      console.error("수정 실패: ", error);
      toast.error("수정 중 오류가 발생했습니다.");
    }
  };

  const onDelete = async () => {
    if (!id) return;

    try {
      await deleteUser(id);
      toast.success("회원이 삭제되었습니다.");

      if (userId) {
          dispatch(logout());
          window.location.href = "/login";
      } else {
          navigate("/users");
      }
    } catch (error) {
      console.error("삭제 실패: ", error);
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>계정 정보 수정</CardTitle>
        <CardDescription>회원의 기본 정보를 변경합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">이름</label>
            <input
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">이메일</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">권한</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={!!userId && formData.role !== 'Admin'} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Guest">Guest</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">상태</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">회원 탈퇴</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>회원 탈퇴</DialogTitle>
                  <DialogDescription>
                    정말 이 회원을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">취소</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={onDelete}>삭제</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button>변경사항 저장</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>변경사항 저장</DialogTitle>
                  <DialogDescription>
                    수정 내용을 저장하시겠습니까?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">취소</Button>
                  </DialogClose>
                  <Button onClick={onSave}>저장</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default UserSettings;
