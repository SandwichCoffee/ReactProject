import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { getRecruitById, deleteRecruit, type Recruit } from "@/api/recruitApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Trash2, Edit, Calendar } from "lucide-react";
import { toast } from "sonner";
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
import "react-quill-new/dist/quill.snow.css";

export default function RecruitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [recruit, setRecruit] = useState<Recruit | null>(null);

  useEffect(() => {
    if (id) {
      getRecruitById(id).then(setRecruit);
    }
  }, [id]);

  const handleDelete = async () => {
    if (!recruit) return;
    try {
      await deleteRecruit(recruit.recruitId);
      toast.success("채용 공고가 삭제되었습니다.");
      navigate("/recruits");
    } catch (error) {
      console.error("삭제 실패:", error);
      toast.error("공고 삭제 중 오류가 발생했습니다.");
    }
  };

  const getEffectiveStatus = (recruit: Recruit) => {
    if (recruit.status === "CLOSED" || recruit.status === "DRAFT") {
      return recruit.status;
    }
    if (recruit.endDate) {
      const today = new Date();
      const endDate = new Date(recruit.endDate);
      endDate.setHours(23, 59, 59, 999);
      if (today > endDate) return "EXPIRED";
    }
    return recruit.status;
  };

  const getStatusBadge = (recruit: Recruit) => {
    const effectiveStatus = getEffectiveStatus(recruit);
    switch (effectiveStatus) {
      case "OPEN":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">진행중</Badge>;
      case "CLOSED":
        return <Badge variant="secondary" className="text-slate-500 bg-slate-100">강제마감</Badge>;
      case "EXPIRED":
        return <Badge variant="outline" className="text-slate-400 border-slate-300 bg-slate-50">기간만료</Badge>;
      case "DRAFT":
        return <Badge variant="outline" className="text-slate-500">임시저장</Badge>;
      default:
        return <Badge variant="outline">{effectiveStatus}</Badge>;
    }
  };

  if (!recruit) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3 mb-4" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/recruits")} className="text-slate-600">
          <ArrowLeft className="mr-2 h-4 w-4" /> 목록으로
        </Button>
        
        <div className="space-x-2 flex items-center">
          {user?.role === "Admin" && (
            <>
              <Button
                variant="outline"
                onClick={() => navigate(`/recruits/${recruit.recruitId}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" /> 공고 수정
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 size={16} /> 삭제
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>채용 공고 삭제</DialogTitle>
                    <DialogDescription>
                      정말 이 공고를 삭제하시겠습니까? 삭제된 공고 데이터는 복구할 수 없습니다.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">취소</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete}>
                      삭제 확인
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        
        <CardHeader className="bg-slate-50 border-b pb-6 space-y-4">
          <div className="flex items-center gap-3">
            {getStatusBadge(recruit)}
            <div className="flex items-center text-sm text-slate-500 font-medium">
              <Calendar className="mr-1.5 h-4 w-4" />
              {recruit.startDate?.split("T")[0]} ~ {recruit.endDate?.split("T")[0]}
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900 leading-tight">
            {recruit.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="ql-snow">
            <div
              className="min-h-[400px] p-6 sm:p-8 bg-white text-slate-800
                   text-base leading-relaxed
                   [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
                   [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
                   [&_li]:my-1
                   [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4 [&_h1]:text-slate-900
                   [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3 [&_h2]:text-slate-800
                   [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2
                   [&_p]:my-2
                   [&_a]:text-blue-600 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: recruit.contents }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
