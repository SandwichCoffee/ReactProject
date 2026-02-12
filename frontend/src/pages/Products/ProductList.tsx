import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/api/productApi";
import { useProducts } from "@/hooks/useProducts";
import { addToCart, getCartList } from "@/api/cartApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, ShoppingCart, CreditCard } from "lucide-react";

import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function ProductList() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const pageSize = 12;

  const { data, isLoading } = useProducts(page, pageSize);

  useEffect(() => {
    if (user) {
      getCartList(user.userId)
        .then((carts) => setCartCount(carts.length))
        .catch((err) => console.error(err));
    }
  }, [user]);

  const products = data?.list || [];
  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const updateCartBadge = async () => {
    if (!user) return;
    try {
      const carts = await getCartList(user.userId);
      setCartCount(carts.length);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation(); // 상세페이지 이동 방지

    if (!user) {
      toast.error("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    try {
      await addToCart(user.userId, productId, 1);

      await updateCartBadge();

      // For list view, a toast is better than a confirm or dialog to avoid interruption
      toast.success("장바구니에 담았습니다.");
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      toast.error("장바구니 추가 중 오류가 발생했습니다.");
    }
  };

  const handleBuyNow = async (e: React.MouseEvent, prodId: number) => {
    e.stopPropagation(); // 상세페이지 이동 방지

    if (!user) {
      toast.error("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    try {
      await addToCart(user.userId, prodId, 1);
      navigate("/cart");
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      toast.error("구매 진행 실패 했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">상품 목록</h2>
        <div className="flex items-center gap-3">
          {/* 장바구니 버튼 & 뱃지 */}
          <Button
            variant="outline"
            className="relative"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />내 장바구니
            {cartCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 px-2 py-0.5 text-xs rounded-full min-w-[20px] justify-center"
              >
                {cartCount}
              </Badge>
            )}
          </Button>

          {user?.role === "Admin" && (
            <Button onClick={() => navigate("/products/new")}>+ 상품 등록</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-slate-100">
                  <Skeleton className="w-full h-full" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/3" />
                </CardContent>
                <CardFooter className="gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </CardFooter>
              </Card>
            ))
          : products.map((product) => (
              <Card key={product.prodId} className="overflow-hidden">
                <div className="aspect-video bg-slate-100 relative">
                  {product.prodImg ? (
                    <img
                      src={`${BASE_URL}/images/${product.prodImg}`}
                      alt={product.prodName}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onClick={() => navigate(`/products/${product.prodId}`)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      <ShoppingBag size={48} />
                    </div>
                  )}
                  {product.prodStock <= 0 && (
                    <div 
                      className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                      onClick={() => navigate(`/products/${product.prodId}`)}
                    >
                      <Badge
                        variant="destructive"
                        className="text-lg px-4 py-1"
                      >
                        SOLDOUT
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {product.prodName}
                    </CardTitle>
                    <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
                      <Badge variant="secondary" className="font-normal text-xs">{product.prodCategory}</Badge>
                      <span className="text-xs text-slate-500 font-medium">
                        재고: {product.prodStock}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-slate-900">
                      {product.prodPrice.toLocaleString()}<span className="text-base font-normal ml-1">원</span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3 pt-0">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => handleAddToCart(e, product.prodId)}
                    disabled={product.prodStock <= 0} // 품절이면 버튼 비활성화
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> 담기
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={(e) => handleBuyNow(e, product.prodId)}
                    disabled={product.prodStock <= 0}
                  >
                    <CreditCard className="mr-2 h-4 w-4" /> 구매
                  </Button>
                </CardFooter>
              </Card>
            ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8 pb-8">
            <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
            >
                이전
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                    key={pageNum}
                    variant={pageNum === page ? "default" : "outline"}
                    onClick={() => setPage(pageNum)}
                    className="w-10"
                >
                    {pageNum}
                </Button>
            ))}
             <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
            >
                다음
            </Button>
        </div>
      )}
    </div>
  );
}
