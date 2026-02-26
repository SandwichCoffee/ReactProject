import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { createRecruit, getRecruitById, updateRecruit, type RecruitInput } from "@/api/recruitApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export default function RecruitWrite() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  // 입력값 상태 관리
  const [formData, setFormData] = useState<RecruitInput>({
    title: "",
    contents: "",
    status: "DRAFT", 
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (isEdit && id) {
      getRecruitById(id).then((data) => {
        setFormData({
          title: data.title,
          contents: data.contents,
          status: data.status,
          startDate: data.startDate ? data.startDate.slice(0, 16) : "",
          endDate: data.endDate ? data.endDate.slice(0, 16) : "",
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
    setFormData((prev) => ({ ...prev, contents: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.contents) {
      toast.error("공고 제목과 상세 내용은 필수입니다.");
      return;
    }

    try {
      if (isEdit && id) {
         await updateRecruit(Number(id), formData);
         toast.success("채용 공고가 성공적으로 수정되었습니다.");
      } else {
         await createRecruit(formData);
         toast.success("새로운 채용 공고가 등록되었습니다.");
      }
      navigate("/recruits");
    } catch (error) {
      console.error(error);
      toast.error("공고 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/recruits")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {isEdit ? "채용 공고 수정" : "채용 공고 등록"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEdit ? "등록된 채용 공고의 내용을 수정합니다." : "새로운 사내 채용 공고를 작성합니다."}
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
                공고 제목 <span className="text-destructive">*</span>
              </Label>
              <div className="sm:col-span-3">
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="예: 2026년 상반기 프론트엔드 개발자 수시 채용"
                  className="w-full bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="status" className="sm:text-right font-medium text-slate-700">상태</Label>
              <div className="sm:col-span-3">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-10 w-full max-w-xs items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="DRAFT">임시저장 (작성중)</option>
                  <option value="OPEN">진행중 (모집중)</option>
                  <option value="CLOSED">강제 마감</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-lg">채용 일정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="startDate" className="sm:text-right font-medium text-slate-700">접수 시작일</Label>
              <div className="sm:col-span-3">
                <Input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="max-w-[250px] bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="endDate" className="sm:text-right font-medium text-slate-700">서류 마감일</Label>
              <div className="sm:col-span-3">
                <Input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="max-w-[250px] bg-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-lg">상세 요강 <span className="text-destructive text-sm font-normal">*</span></CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[400px] pb-12">
              <ReactQuill
                theme="snow"
                value={formData.contents}
                onChange={handleEditorChange}
                style={{ height: "100%" }}
                placeholder="모집 부문, 자격 요건, 우대 사항, 전형 절차 등을 상세히 입력해주세요."
                className="bg-white"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="outline" size="lg" onClick={() => navigate("/recruits")}>
            취소
          </Button>
          <Button type="submit" size="lg" className="gap-2 bg-slate-900 hover:bg-slate-800">
            <Save className="h-4 w-4" />
            {isEdit ? "수정 내용 저장" : "새 공고 등록"}
          </Button>
        </div>

      </form>
    </div>
  );
}
