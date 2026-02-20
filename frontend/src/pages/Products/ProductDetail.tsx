import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BASE_URL,
  deleteProduct,
  webhookSimulation
} from "@/api/productApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Edit, Webhook, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import "react-quill-new/dist/quill.snow.css";
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
import { toast } from "sonner";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/hooks/useProduct";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const { data: product, refetch } = useProduct(id || "");
  const [quantity, setQuantity] = useState<number>(1);

  const handleWebhookSimulation = async () => {
    if (!product) return;
    
    if (!user) {
       toast.error("로그인이 필요한 서비스입니다.");
       navigate("/login");
       return;
    }

    try {
      await webhookSimulation(user.userId, product.prodId);
      toast.success("웹훅 시뮬레이션이 성공적으로 실행되었습니다.");
      refetch();
    } catch (error) {
      console.error("웹훅 시뮬레이션 실패:", error);
      toast.error("웹훅 시뮬레이션 중 오류가 발생했습니다.");
    }
  }

  const handleDelete = async () => {
    if (!product) return;

    try {
      await deleteProduct(product.prodId);
      toast.success("상품이 삭제되었습니다.");
      navigate("/products");
    } catch (error) {
      console.error("삭제 실패:", error);
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  };

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-32" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-lg w-full" />
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-12 w-1/3" />
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">상품 상세 정보</h2>
      
      {/* 관리자(ADMIN)일 경우에만 수정/삭제 버튼 노출 */}
      {user?.role === "Admin" && (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/products/${product.prodId}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" /> 정보 수정
          </Button>
          <Dialog>
                 <DialogTrigger asChild>
                   <Button variant="destructive" className="gap-2">
                     <Trash2 size={16} /> 삭제
                   </Button>
                 </DialogTrigger>
                 <DialogContent>
                   <DialogHeader>
                     <DialogTitle>상품 삭제</DialogTitle>
                     <DialogDescription>
                       정말 이 상품을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.
                     </DialogDescription>
                   </DialogHeader>
                   <DialogFooter>
                     <DialogClose asChild>
                       <Button variant="outline">취소</Button>
                     </DialogClose>
                     <Button variant="destructive" onClick={handleDelete}>
                       삭제
                     </Button>
                   </DialogFooter>
                 </DialogContent>
               </Dialog>
        </div>
      )}
    </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border rounded-lg overflow-hidden bg-slate-100 aspect-square flex items-center justify-center">
              {product.prodImg ? (
                <img
                  src={`${BASE_URL}/images/${product.prodImg}`}
                  alt={product.prodName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-slate-400">이미지 없음</span>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <Badge className="mb-2">{product.prodCategory}</Badge>
                <h1 className="text-3xl font-bold">{product.prodName}</h1>
                <p className="text-slate-500 text-sm mt-1">
                  등록일: {product.regDate}
                </p>
              </div>

              <div className="text-4xl font-bold text-blue-600">
                {product.prodPrice.toLocaleString()}원
              </div>

              <div className="flex items-center gap-4">
                <span className="font-medium">수량:</span>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">상품 설명</h3>
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {product.prodDesc}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-md border">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">현재 재고</span>
                  <span className="font-medium">{product.prodStock}개</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-500">판매 상태</span>
                  <span
                    className={
                      product.prodStatus === "ON_SALE"
                        ? "text-green-600 font-bold"
                        : "text-red-500 font-bold"
                    }
                  >
                    {product.prodStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-dashed border-2 border-indigo-200 bg-indigo-50/50">
      <CardHeader>
        <div className="flex items-center gap-2">
           <Webhook className="h-5 w-5 text-indigo-600" />
           <CardTitle className="text-lg text-indigo-900">외부 결제 연동 시뮬레이터 (포트폴리오 테스트용)</CardTitle>
        </div>
        <CardDescription className="text-indigo-700/70">
          실제 환경에서는 외부 커머스 서버(B2C)에서 결제 완료 시 호출되는 Webhook API입니다. 
          원활한 매출(대시보드) 테스트를 위해 임시로 배치한 버튼입니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 bg-white p-4 rounded-md border border-indigo-100">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700">시뮬레이션 동작</p>
            <p className="text-xs text-slate-500">1건의 주문 생성 → 현재 상품 재고 1 차감 → 대시보드 출고액 증가</p>
          </div>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 gap-2"
            onClick={handleWebhookSimulation}
          >
            <Zap className="h-4 w-4" /> 결제 웹훅 쏘기
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
