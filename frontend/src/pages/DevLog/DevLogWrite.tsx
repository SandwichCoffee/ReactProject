import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { createDevLog, getDevLogById, updateDevLog, type DevLogInput } from "@/api/devlogApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

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
      toast.error("제목과 내용은 필수 입력 항목입니다.");
      return;
    }

    try {
      if (isEdit && id) {
        await updateDevLog(Number(id), formData);
        toast.success("개발 일지가 성공적으로 수정되었습니다.");
      } else {
        await createDevLog(formData);
        toast.success("새로운 개발 일지가 등록되었습니다.");
      }
      navigate("/devlogs");
    } catch (error) {
      console.error(error);
      toast.error("개발 일지 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10 animate-in fade-in duration-500">
      
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/devlogs")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {isEdit ? "개발 일지 수정" : "개발 일지 작성"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEdit ? "기존에 작성한 개발 일지의 내용을 수정합니다." : "프로젝트 개발 과정이나 문제 해결 기록을 남깁니다."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-lg">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="title" className="sm:text-right font-medium text-slate-700">
                제목 <span className="text-destructive">*</span>
              </Label>
              <div className="sm:col-span-3">
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="예: 로그인 인증 관련 토큰 만료 버그 수정"
                  className="w-full bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="type" className="sm:text-right font-medium text-slate-700">로그 유형</Label>
              <div className="sm:col-span-3">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="flex h-10 w-full max-w-xs items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="FEATURE">기능 추가 (FEATURE)</option>
                  <option value="BUGFIX">장애/버그 수정 (BUGFIX)</option>
                  <option value="REFACTOR">리팩토링 (REFACTOR)</option>
                  <option value="DOCS">기술 문서 (DOCS)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-lg">상세 내용 <span className="text-destructive text-sm font-normal">*</span></CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[400px] pb-12">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleEditorChange}
                style={{ height: "100%" }}
                placeholder="트러블슈팅 과정, 적용한 코드, 혹은 배운 점을 상세히 기록해주세요..."
                className="bg-white"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="outline" size="lg" onClick={() => navigate("/devlogs")}>
            취소
          </Button>
          <Button type="submit" size="lg" className="gap-2 bg-slate-900 hover:bg-slate-800">
            <Save className="h-4 w-4" /> 
            {isEdit ? "수정 내용 저장" : "개발 일지 등록"}
          </Button>
        </div>
      </form>
    </div>
  );
}