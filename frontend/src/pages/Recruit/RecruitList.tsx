import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecruits, type Recruit } from "@/api/recruitApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search } from "lucide-react";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function RecruitList() {
  const navigate = useNavigate();
  const [recruits, setRecruits] = useState<Recruit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setIsLoading(true);
    getRecruits().then((data) => {
      setRecruits(data);
    })
    .catch((err) => console.log(err))
    .finally(() => setIsLoading(false));
  }, []);

  const getEffectiveStatus = (recruit: Recruit) => {
    if (recruit.status === "CLOSED" || recruit.status === "DRAFT") {
      return recruit.status;
    }

    if (recruit.endDate) {
      const today = new Date();
      const endDate = new Date(recruit.endDate);
      endDate.setHours(23, 59, 59, 999);

      if (today > endDate) {
        return "EXPIRED"; 
      }
    }

    return recruit.status;
  };

  const getStatusBadge = (recruit: Recruit) => {
    const effectiveStatus = getEffectiveStatus(recruit);

    switch (effectiveStatus) {
      case "OPEN":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg_emerald-100">진행중</Badge>;
      case "EXPIRED":
        return <Badge variant="secondary" className="text-slate-500 bg-slate-100">마감</Badge>;
      case "DRAFT":
        return <Badge variant="outline" className="text-slate-500">작성중</Badge>;
      default:
        return <Badge variant="outline">{effectiveStatus}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">채용 공고 관리</h2>
          <p className="text-sm text-slate-500">
            사내 채용 공고의 진행 상태 및 일정을 관리합니다. (총 {recruits.length}건)
          </p>
        </div>
        {user?.role === "Admin" && (
          <Button onClick={() => navigate("/recruits/new")}><Plus className="h-4 w-4" />공고 등록</Button>
        )}
      </div>
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-b-slate-200">
                  <TableHead className="w-[100px] text-center font-semibold text-slate-700">상태</TableHead>
                  <TableHead className="font-semibold text-slate-700">공고명</TableHead>
                  <TableHead className="font-semibold text-slate-700 w-[250px]">접수 기간</TableHead>
                  <TableHead className="text-center w-[120px] font-semibold text-slate-700">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20 mx-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : recruits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                      등록된 채용 공고가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  recruits.map((recruit) => (
                    <TableRow
                      key={recruit.recruitId}
                      className="cursor-pointer hover:bg-slate-50 transition-colors group"
                      onClick={() => navigate(`/recruits/${recruit.recruitId}`)}
                    >
                      <TableCell className="text-center">
                        {getStatusBadge(recruit)}
                      </TableCell>
                      
                      <TableCell className="font-medium text-slate-900 group-hover:text-primary transition-colors">
                        {recruit.title}
                      </TableCell>
                      
                      <TableCell className="text-sm text-slate-600">
                        {recruit.startDate?.split("T")[0]} <span className="text-slate-400 mx-1">~</span> {recruit.endDate?.split("T")[0]}
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-500 hover:text-primary hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/recruits/${recruit.recruitId}`);
                          }}
                        >
                          <Search className="mr-1.5 h-4 w-4" />
                          상세
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
