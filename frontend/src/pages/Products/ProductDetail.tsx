import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BASE_URL,
  deleteProduct,
} from "@/api/productApi";
import { addToCart } from "@/api/cartApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Trash2, Edit } from "lucide-react";
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
  
  const { data: product } = useProduct(id || "");
  const [quantity, setQuantity] = useState<number>(1);
  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);

  // Cart count logic removed for simplicity if not displayed in this component or add it back to header
  // Assuming MainLayout handles the header cart badge, we might not need it here unless we have a specific cart button in detail page.
  
  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!user) {
       toast.error("로그인이 필요한 서비스입니다.");
       navigate("/login");
       return;
    }

    try {
      // userId를 Redux state에서 가져와 사용
      await addToCart(user.userId, product.prodId, quantity);
      setIsCartDialogOpen(true);
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      toast.error("장바구니 추가 중 오류가 발생했습니다.");
    }
  };

  const onDelete = async () => {
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/products")}
          className="gap-2"
        >
          <ArrowLeft size={16} /> 목록으로 돌아가기
        </Button>
        <div className="flex gap-2">
          {user?.role === "Admin" && (
            <>
              <Button
                variant="outline"
                onClick={() => navigate(`/products/${product.prodId}/edit`)}
                className="gap-2"
              >
                <Edit size={16} /> 수정
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
                    <Button variant="destructive" onClick={onDelete}>
                      삭제
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

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

          <div className="flex gap-4">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => toast.info("추후 제공될 기능입니다.")}
            >
              바로 구매하기
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              onClick={handleAddToCart}
            >
              장바구니 담기
            </Button>
          </div>

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
      
      {/* Cart Confirmation Dialog */}
      <Dialog open={isCartDialogOpen} onOpenChange={setIsCartDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>장바구니 담기 완료</DialogTitle>
            <DialogDescription>
              장바구니에 상품이 담겼습니다. 장바구니로 이동하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCartDialogOpen(false)}>
              쇼핑 계속하기
            </Button>
            <Button onClick={() => navigate("/cart")}>
              장바구니 확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
