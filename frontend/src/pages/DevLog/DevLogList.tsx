import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { getDevLogs, deleteDevLog, type DevLog } from "@/api/devlogApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Calendar, Terminal } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function DevLogList() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [logs, setLogs] = useState<DevLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getDevLogs()
      .then(setLogs)
      .catch((err) => {
        console.error(err);
        toast.error("로그 데이터를 불러오는데 실패했습니다.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteDevLog(id);
      setLogs((prev) => prev.filter((log) => log.logId !== id));
      toast.success("개발 일지가 삭제되었습니다.");
    } catch (error) {
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "FEATURE": 
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "BUGFIX": 
        return "bg-red-100 text-red-700 border-red-200";
      case "REFACTOR": 
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "DOCS": 
        return "bg-slate-100 text-slate-700 border-slate-200";
      default: 
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1 flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-lg">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Developer Log</h2>
            <p className="text-sm text-slate-500 mt-1">프로젝트 개발 과정, 트러블슈팅 및 회고 기록</p>
          </div>
        </div>
        
        {user?.role === "Admin" && (
          <Button onClick={() => navigate("/devlogs/new")} className="gap-2 bg-slate-900 hover:bg-slate-800">
            <Plus className="h-4 w-4" /> 로그 작성
          </Button>
        )}
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-10">
        
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="relative pl-8">
              <div className="absolute -left-[9px] top-2 h-4 w-4 rounded-full border-2 border-white bg-slate-200 ring-4 ring-white" />
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3"><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent><Skeleton className="h-24 w-full" /></CardContent>
              </Card>
            </div>
          ))
        ) : logs.length === 0 ? (
          <div className="pl-8 text-slate-500 py-10">등록된 개발 일지가 없습니다. 첫 번째 로그를 남겨보세요!</div>
        ) : (
          logs.map((log) => (
            <div key={log.logId} className="relative pl-8 group">
              
              <div className="absolute -left-[9px] top-4 h-4 w-4 rounded-full border-2 border-white bg-slate-400 group-hover:bg-slate-900 transition-colors ring-4 ring-white" />
              
              <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 bg-slate-50/50 border-b">
                  <div className="flex justify-between items-start">
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={getBadgeStyle(log.type)}>
                          {log.type}
                        </Badge>
                        <span className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                          <Calendar size={14} />
                          {log.regDate ? format(new Date(log.regDate), "yyyy년 MM월 dd일 HH:mm", { locale: ko }) : ""}
                        </span>
                      </div>
                      <CardTitle className="text-xl text-slate-900 leading-tight">
                        {log.title}
                      </CardTitle>
                    </div>
                    
                    {user?.role === "Admin" && (
                      <div className="flex gap-1 ml-4">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-blue-600" 
                          onClick={() => navigate(`/devlogs/${log.logId}/edit`)}
                        >
                          <Edit size={16} />
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                              <Trash2 size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>로그 삭제</DialogTitle>
                              <DialogDescription>
                                정말 이 개발 일지를 삭제하시겠습니까?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">취소</Button>
                              </DialogClose>
                              <Button variant="destructive" onClick={() => handleDelete(log.logId)}>
                                삭제
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="ql-snow">
                    <div 
                      className="text-slate-700 leading-relaxed text-[15px]
                        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                        [&_li]:my-1
                        [&_p]:mb-3 [&_p:last-child]:mb-0
                        [&_pre]:bg-slate-900 [&_pre]:text-slate-50 [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:mb-4
                        [&_code]:bg-slate-100 [&_code]:text-pink-600 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm
                        [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-500
                        [&_img]:max-w-full [&_img]:rounded-md [&_img]:border [&_img]:my-4"
                      dangerouslySetInnerHTML={{ __html: log.content }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}