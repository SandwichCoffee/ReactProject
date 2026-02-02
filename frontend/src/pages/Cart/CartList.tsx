import { useEffect, useState } from "react";
import {
  getCartList,
  updateCartQuantity,
  deleteCartItem,
  placeOrder,
  type CartItem,
} from "@/api/cartApi";
import { BASE_URL } from "@/api/productApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function CartList() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // If not logged in, wait or redirect?
      // Assuming this page might be accessed directly.
      // ProtectedRoute should handle this, but if not:
      return;
    }

    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const data = await getCartList(Number(user.userId));
        setCartItems(data);
      } catch (err) {
        console.error("장바구니 불러오기 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const handleOrder = async () => {
    if (cartItems.length === 0) return;
    if (!user) {
        toast.error("로그인이 필요합니다.");
        navigate("/login");
        return;
    }

    if (!confirm(`총 ${totalPrice.toLocaleString()}원을 결제하시겠습니까?`))
      return;

    try {
      await placeOrder(Number(user.userId)); 
      toast.success("주문이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("주문 실패:", error);
      toast.error("주문 중 오류가 발생했습니다.");
    }
  };

  const handleQuantityChange = async (
    cartId: number,
    newQuantity: number,
    change: number,
  ) => {
    const newQty = newQuantity + change;

    if (newQty < 1) return; // 수량이 1 미만으로 내려가지 않도록 방지

    try {
      await updateCartQuantity(cartId, newQty);
      setCartItems((prev) =>
        prev.map((item) =>
          item.cartId === cartId ? { ...item, quantity: newQty } : item,
        ),
      );
    } catch (error) {
      console.error("수량 변경 실패:", error);
      alert("수량 변경 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (cartId: number) => {
    if (!confirm("정말 장바구니에서 삭제하시겠습니까?")) return;

    try {
      await deleteCartItem(cartId);
      setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
    } catch (error) {
      console.error("장바구니 아이템 삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.prodPrice * item.quantity,
    0,
  );

  return (
    <div className="max-w-4xl mx auto space-y-6">
      <h2 className="text-3xl font-bold">장바구니</h2>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 spacy-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex gap-4 items-center">
                  <Skeleton className="w-24 h-24 rounded-md" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : cartItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500 border rounded-lg">
              장바구니가 비어 있습니다.
            </div>
          ) : (
            cartItems.map((item) => (
              <Card key={item.cartId}>
                <CardContent className="p-4 flex gap-4 items-center">
                  <div className="w-24 h-24 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                    {item.prodImg && (
                      <img
                        src={`${BASE_URL}/images/${item.prodImg}`}
                        alt={item.prodName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold">{item.prodName}</h3>
                    <p className="text-sm text-slate-500">
                      {item.prodPrice.toLocaleString()}원
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleQuantityChange(item.cartId, item.quantity, -1)
                        }
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleQuantityChange(item.cartId, item.quantity, 1)
                        }
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="font-bold">
                      {(item.prodPrice * item.quantity).toLocaleString()}원
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(item.cartId)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>결제 금액</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg font-medium">
                <span>총 주문금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <Button
                className="w-full text-lg py-6"
                disabled={cartItems.length === 0}
                onClick={handleOrder}
              >
                구매하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
