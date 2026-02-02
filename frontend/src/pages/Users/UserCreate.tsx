import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "@/api/userApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    email: "",
    role: "User",
    status: "Active",
    lastLogin: "", // 임시
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || !formData.userName) {
      alert("ID와 이름은 필수입니다.");
      return;
    }

    try {
      await createUser(formData); // POST 요청
      alert("회원이 등록되었습니다.");
      navigate("/users"); // 목록으로 이동
    } catch (error) {
      console.error("등록 실패:", error);
      alert("이미 존재하는 ID이거나 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>신규 회원 등록</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ID 입력 (등록할 때만 필요) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">아이디</label>
              <input
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="예: user_999"
                className="flex h-10 w-full rounded-md border border-input px-3"
              />
            </div>

            {/* 이름 입력 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">이름</label>
              <input
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input px-3"
              />
            </div>

            {/* 이메일 입력 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">이메일</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input px-3"
              />
            </div>

            {/* 버튼 영역 */}
            <div className="pt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/users")}
              >
                취소
              </Button>
              <Button type="submit">등록하기</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
