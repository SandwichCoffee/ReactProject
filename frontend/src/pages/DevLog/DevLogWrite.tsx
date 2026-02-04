import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { createDevLog, getDevLogById, updateDevLog, type DevLogInput } from "@/api/devlogApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DevLogWrite() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState<DevLogInput>({
    title: "",
    content: "",
    type: "FEATURE", // default
  });

  useEffect(() => {
    if (isEdit && id) {
      getDevLogById(id).then((data) => {
        setFormData({
          title: data.title,
          content: data.content,
          type: data.type,
        });
      });
    }
  }, [isEdit, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("제목과 내용은 필수입니다.");
      return;
    }

    try {
      if (isEdit && id) {
        await updateDevLog(Number(id), formData);
        alert("로그가 수정되었습니다.");
      } else {
        await createDevLog(formData);
        alert("로그가 등록되었습니다.");
      }
      navigate("/devlogs");
    } catch (error) {
      console.error(error);
      alert("등록 실패!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {isEdit ? "개발 일지 수정" : "개발 일지 작성"}
        </h2>
        <Button variant="outline" onClick={() => navigate("/devlogs")}>
          취소
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>내용 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3 space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="예: 로그인 버그 수정 완료"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">유형</Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="FEATURE">기능 추가 (FEATURE)</option>
                  <option value="BUGFIX">버그 수정 (BUGFIX)</option>
                  <option value="REFACTOR">리팩토링 (REFACTOR)</option>
                  <option value="DOCS">문서작업 (DOCS)</option>
                  <option value="ETC">기타 (ETC)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>상세 내용</Label>
              <div className="h-96 pb-12">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleEditorChange}
                  style={{ height: "100%" }}
                  placeholder="오늘의 개발 내용을 기록하세요..."
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              {isEdit ? "수정 완료" : "등록 완료"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
