import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/api/productApi";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Image as ImageIcon, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function ProductList() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading } = useProducts(page, pageSize);
  const products = data?.list || [];
  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">상품 관리</h2>
        <p className="text-sm text-slate-500">등록된 모든 상품의 단가 및 재고 현황을 모니터링합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          {user?.role === "Admin" && (
            <Button onClick={() => navigate("/products/new")}><Plus className="h-4 w-4" /> 상품 등록</Button>
          )}
        </div>
      </div>
      
      {/* 상품 리스트 */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-b-slate-200">
                  <TableHead className="w-[80px] text-center">이미지</TableHead>
                  <TableHead className="font-semibold text-slate-700">상품명</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold text-slate-700">카테고리</TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">단가</TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">재고</TableHead>
                  <TableHead className="text-center w-[100px] font-semibold text-slate-700">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                { isLoading 
                ? ( Array.from({length: 5}).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-10 w-10 rounded-md mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[200px]" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-5 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[60px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-[80px]" />
                    </TableCell>
                  </TableRow>
                )) )
                : products.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                       등록된 상품이 없습니다.
                     </TableCell>
                   </TableRow>
                ) : (
                (products.map((product) => (
                  <TableRow key={product.prodId} className="cursor-pointer hover:bg-slate-50 transition-colors group" onClick={() => navigate(`/products/${product.prodId}`)}>
                    <TableCell className="p-2">
                      <div className="h-10 w-10 mx-auto rounded border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
                        {product.prodImg ? (
                            <img src={`${BASE_URL}/images/${product.prodImg}`} alt={product.prodName} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-slate-300" />
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-500 group-hover:text-primary transition-colors">{product.prodName}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.prodCategory}
                    </TableCell>
                    <TableCell className="text-right text-slate-600">
                      {product.prodPrice.toLocaleString()}원
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {product.prodStock <= 10 ? (
                        <span className="text-destructive flex items-center justify-end gap-1">
                          {product.prodStock}
                          {product.prodStock <= 0 ? "(품절)" : "(부족)"}
                        </span>
                      ) : (
                        <span className="text-slate-700">{product.prodStock}</span>
                      )}
                      
                    </TableCell>
                    <TableCell className="text-center p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-primary hover:bg-primary/10"
                        onClick={(e) => navigate(`/products/${product.prodId}`)}
                      >
                        <PackageSearch className="mr-1.5 h-4 w-4" />
                        상세
                      </Button>
                    </TableCell>
                  </TableRow>
                ))))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
        <div className="flex justify-center items-center gap-1 mt-6">
            <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-slate-600"
            >
                이전
            </Button>
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 p-0 ${pageNum === page ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"}`}
                  >
                      {pageNum}
                  </Button>
              ))}
            </div>
            <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-slate-600"
            >
                다음
            </Button>
        </div>
    </div>
  );
}
