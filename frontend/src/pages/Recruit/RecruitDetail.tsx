import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecruitById, deleteRecruit, type Recruit } from "@/api/recruitApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function RecruitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recruit, setRecruit] = useState<Recruit | null>(null);

  useEffect(() => {
    if (id) {
      getRecruitById(id).then(setRecruit);
    }
  }, [id]);

  const handleDelete = async () => {
    if (!recruit) return;
    if (confirm("정말 이 공고를 삭제하시겠습니까?")) {
      await deleteRecruit(recruit.recruitId);
      navigate("/recruits");
    }
  };

  if (!recruit) return <div>로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 상단 버튼 */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/recruits")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 목록으로
        </Button>
        <div className="space-x-2">
          {/* 수정 버튼은 나중에 추가 가능 */}
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> 삭제
          </Button>
        </div>
      </div>

      {/* 공고 헤더 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant={recruit.status === "OPEN" ? "default" : "secondary"}>
            {recruit.status}
          </Badge>
          <span className="text-slate-500 text-sm">
            기간: {recruit.startDate?.split("T")[0]} ~{" "}
            {recruit.endDate?.split("T")[0]}
          </span>
        </div>
        <h1 className="text-4xl font-bold">{recruit.title}</h1>
      </div>

      <Separator />

      {/* [수정] 뷰어 영역 */}
      {/* ql-snow: 테마 이름 / ql-editor: 에디터 본문 스타일 적용 */}
      <div className="ql-snow">
        <div
          className="min-h-[300px] p-4 border rounded-md bg-white 
                   text-base leading-relaxed
                   [&_ol]:list-decimal [&_ol]:pl-6 
                   [&_ul]:list-disc [&_ul]:pl-6 
                   [&_li]:my-1
                   [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4
                   [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3
                   [&_p]:my-2"
          dangerouslySetInnerHTML={{ __html: recruit.contents }}
        />
      </div>
    </div>
  );
}
