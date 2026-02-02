import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // [중요] 에디터 스타일 불러오기

import { createRecruit, type RecruitInput } from "@/api/recruitApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecruitWrite() {
  const navigate = useNavigate();

  // 입력값 상태 관리
  const [formData, setFormData] = useState<RecruitInput>({
    title: "",
    contents: "",
    status: "DRAFT", // 기본값: 작성중
    startDate: "",
    endDate: "",
  });

  // 텍스트/날짜 입력 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, contents: value }));
  };

  // 저장 버튼
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.contents) {
      alert("제목과 내용은 필수입니다.");
      return;
    }

    try {
      await createRecruit(formData);
      alert("공고가 등록되었습니다.");
      navigate("/recruits"); // 목록으로 이동
    } catch (error) {
      console.error(error);
      alert("등록 실패!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">채용 공고 등록</h2>
        <Button variant="outline" onClick={() => navigate("/recruits")}>
          취소
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>공고 내용 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. 제목 & 상태 */}
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3 space-y-2">
                <Label htmlFor="title">공고 제목</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="예: 2026년 상반기 신입 개발자 공채"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">상태</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="DRAFT">작성중</option>
                  <option value="OPEN">진행중</option>
                  <option value="CLOSED">마감</option>
                </select>
              </div>
            </div>

            {/* 2. 채용 기간 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">시작일</Label>
                <Input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">마감일</Label>
                <Input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 3. 웹 에디터 (React Quill) */}
            <div className="space-y-2">
              <Label>상세 내용</Label>
              {/* 높이(h-64)를 줘서 에디터 크기를 확보합니다 */}
              <div className="h-96 pb-12">
                <ReactQuill
                  theme="snow"
                  value={formData.contents}
                  onChange={handleEditorChange}
                  style={{ height: "100%" }}
                  placeholder="채용 상세 요강을 입력하세요..."
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              공고 등록 완료
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
