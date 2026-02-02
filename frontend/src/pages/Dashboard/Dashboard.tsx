import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { BASE_URL } from "@/api/productApi";
import { getRecruits, type Recruit } from "@/api/recruitApi";
import { getDashboardStats, type SalesStat } from "@/api/dashboardApi"; // [추가]
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Users, ArrowRight, Package, FileText, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const navigate = useNavigate();
  
  // 1. React Query for Products (Top 10)
  const { data: productData } = useProducts(1, 10);
  const products = productData?.list ? [...productData.list].sort((a,b) => b.prodId - a.prodId).slice(0, 4) : [];

  const [recruits, setRecruits] = useState<Recruit[]>([]);
  const [chartData, setChartData] = useState<SalesStat[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    // 2. 채용 공고
    getRecruits().then(setRecruits);

    // 3. 대시보드 통계
    getDashboardStats().then((data) => {
      setChartData(data.chartData);
      setTotalRevenue(data.totalRevenue);
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* 1. 상단 요약 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 등록 상품</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}개</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">진행 중 공고</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recruits.filter(r => r.status === 'OPEN').length}건
            </div>
          </CardContent>
        </Card>
        
        {/* [수정] 진짜 매출액 표시 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">누적 총 매출</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
                {totalRevenue.toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground">실시간 집계 중</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">시스템 상태</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">정상</div>
            <p className="text-xs text-muted-foreground">Server Uptime: 99.9%</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. 메인 차트 영역 (진짜 데이터 연결) */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>일별 매출 추이</CardTitle>
          <CardDescription>최근 발생한 주문 데이터를 기반으로 합니다.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey="date" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₩${value.toLocaleString()}`}
                    />
                    <Tooltip 
                        formatter={(value: any) => [`${value.toLocaleString()}원`, "매출"]}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                    아직 매출 데이터가 없습니다. 상품을 구매해보세요!
                </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. 하단 리스트 영역 (기존과 동일) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* 왼쪽: 최근 등록 상품 */}
        <Card className="col-span-4">
           {/* ... (기존 상품 리스트 코드 그대로 유지) ... */}
           <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>최근 등록 상품</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/products")}>
              더보기 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 4).map((product) => (
                <div key={product.prodId} className="flex items-center gap-4 border-b last:border-0 pb-3 last:pb-0">
                  <div className="h-12 w-12 rounded bg-slate-100 overflow-hidden flex-shrink-0">
                    {product.prodImg ? (
                      <img 
                        src={`${BASE_URL}/images/${product.prodImg}`} 
                        alt={product.prodName} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="h-full w-full p-3 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{product.prodName}</p>
                    <p className="text-xs text-muted-foreground">{product.prodCategory}</p>
                  </div>
                  <div className="font-bold">
                    {product.prodPrice.toLocaleString()}원
                  </div>
                </div>
              ))}
              {products.length === 0 && <div className="text-center text-slate-500 py-4">등록된 상품이 없습니다.</div>}
            </div>
          </CardContent>
        </Card>

        {/* 오른쪽: 최신 공고 */}
        <Card className="col-span-3">
            {/* ... (기존 공고 리스트 코드 그대로 유지) ... */}
             <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>최신 채용 공고</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/recruits")}>
              더보기 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recruits.slice(0, 4).map((recruit) => (
                <div key={recruit.recruitId} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-500 bg-blue-50 p-1.5 rounded-full" />
                    <div className="space-y-1">
                      <p 
                        className="text-sm font-medium leading-none hover:underline cursor-pointer"
                        onClick={() => navigate(`/recruits/${recruit.recruitId}`)}
                      >
                        {recruit.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {recruit.startDate?.split('T')[0]} 시작
                      </p>
                    </div>
                  </div>
                  <Badge variant={recruit.status === 'OPEN' ? 'default' : 'secondary'}>
                    {recruit.status === 'OPEN' ? '진행중' : '마감'}
                  </Badge>
                </div>
              ))}
               {recruits.length === 0 && <div className="text-center text-slate-500 py-4">등록된 공고가 없습니다.</div>}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}