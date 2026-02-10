import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecruits, type Recruit } from "@/api/recruitApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecruitList() {
  const navigate = useNavigate();
  const [recruits, setRecruits] = useState<Recruit[]>([]);

  useEffect(() => {
    getRecruits().then(setRecruits);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Badge className="bg-green-600">진행중</Badge>;
      case "CLOSED":
        return <Badge variant="secondary">마감</Badge>;
      default:
        return <Badge variant="outline">작성중</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">채용 공고 관리</h2>
        <p className="text-muted-foreground">등록된 채용 공고 목록입니다.</p>
      </div>
      <div>
        <Button onClick={() => navigate("/recruits/new")}>+ 공고 등록</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>전체 목록 ({recruits.length})</CardTitle>
        </CardHeader>
        <CardContent className="relative w-full overflow-auto">
          <div className="border-b w-full w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg_muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  상태
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-1/2">
                  제목
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  기간
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {recruits.map((recruit) => (
                <tr
                  key={recruit.recruitId}
                  className="border-b transition-colors hover:bg_muted/50"
                >
                  <td className="p-4 align-middle">
                    {getStatusBadge(recruit.status)}
                  </td>
                  <td className="p-4 align-middle" font-medium>
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() => navigate(`/recruits/${recruit.recruitId}`)}
                    >
                      {recruit.title}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    {recruit.startDate?.split("T")[0]} ~ {recruit.endDate?.split("T")[0]}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/recruits/${recruit.recruitId}`)}
                    >
                      상세보기
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
