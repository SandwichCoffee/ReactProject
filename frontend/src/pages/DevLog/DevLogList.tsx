import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { getDevLogs, deleteDevLog, type DevLog } from "@/api/devlogApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function DevLogList() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [logs, setLogs] = useState<DevLog[]>([]);

  useEffect(() => {
    getDevLogs().then(setLogs).catch(console.error);
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deleteDevLog(id);
      setLogs((prev) => prev.filter((log) => log.logId !== id));
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "FEATURE": return "default"; // black
      case "BUGFIX": return "destructive"; // red
      case "REFACTOR": return "secondary"; // gray
      case "DOCS": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Development Log</h2>
          <p className="text-slate-500 mt-2">개발 과정과 문제 해결 기록</p>
        </div>
        
        {user?.role === "Admin" && (
          <Button onClick={() => navigate("/devlogs/new")}>
            <Plus className="mr-2 h-4 w-4" /> 로그 작성
          </Button>
        )}
      </div>

      <div className="relative border-l border-slate-200 ml-3 space-y-8 pb-10">
        {logs.length === 0 ? (
            <div className="pl-8 text-slate-500">등록된 로그가 없습니다.</div>
        ) : (
            logs.map((log) => (
            <div key={log.logId} className="relative pl-8">
                {/* Timeline Dot */}
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border border-white bg-slate-300 ring-4 ring-white" />
                
                <Card className="mb-4">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                        <Badge variant={getBadgeColor(log.type) as any}>{log.type}</Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar size={12} />
                            {log.regDate ? format(new Date(log.regDate), "yyyy.MM.dd HH:mm", { locale: ko }) : ""}
                        </span>
                        </div>
                        <CardTitle className="text-xl">{log.title}</CardTitle>
                    </div>
                    
                    {user?.role === "Admin" && (
                        <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/devlogs/${log.logId}/edit`)}>
                            <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(log.logId)}>
                            <Trash2 size={16} />
                        </Button>
                        </div>
                    )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div 
                    className="prose prose-sm max-w-none text-slate-600
                        [&_ol]:list-decimal [&_ol]:pl-5 
                        [&_ul]:list-disc [&_ul]:pl-5 
                        [&_li]:my-1
                        [&_p]:mb-2 [&_p]:min-h-[1.5em]"
                    dangerouslySetInnerHTML={{ __html: log.content }}
                    />
                </CardContent>
                </Card>
            </div>
            ))
        )}
      </div>
    </div>
  );
}
