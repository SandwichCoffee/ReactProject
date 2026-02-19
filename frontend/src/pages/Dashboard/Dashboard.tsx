import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { BASE_URL } from "@/api/productApi";
import { getRecruits, type Recruit } from "@/api/recruitApi";
import { getDashboardStats, type SalesStat } from "@/api/dashboardApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Users, ArrowRight, Package, TrendingUp, MoreHorizontal } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Home() {
  const navigate = useNavigate();
  
  // 1. React Query for Products (Top 10)
  const { data: productData } = useProducts(1, 10);
  const products = productData?.list ? [...productData.list].sort((a,b) => b.prodId - a.prodId).slice(0, 4) : [];

  const [recruits, setRecruits] = useState<Recruit[]>([]);
  const [chartData, setChartData] = useState<SalesStat[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [period, setPeriod] = useState("daily");

  useEffect(() => {
    // 2. 채용 공고
    getRecruits().then(setRecruits);
  }, []);

  useEffect(() => {
    // 3. 대시보드 통계
    getDashboardStats(period).then((data) => {
      setChartData(data.chartData);
      setTotalRevenue(data.totalRevenue);
    });
  }, [period]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{new Date().toLocaleString()} 기준</div>
      </div>

      {/* 상단 요약 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 등록 상품</CardTitle>
            <div className="p-2 bg-blue-50 rounded-full">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}개</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">진행 중 공고</CardTitle>
            <div className="p-2 bg-green-50 rounded-full">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recruits.filter(r => r.status === 'OPEN').length}건
            </div>
          </CardContent>
        </Card>
        
        {/* 매출액 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">누적 총 매출</CardTitle>
            <div className="p-2 bg-blue-50 rounded-full">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
                {totalRevenue.toLocaleString()}원
            </div>
            <CardDescription className="text-xs text-muted-foreground">실시간 집계 중</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">시스템 상태</CardTitle>
            <div className="p-2 bg-green-50 rounded-full">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">정상</div>
            <CardDescription className="text-xs text-muted-foreground">Server Uptime: 99.9%</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* 차트 영역 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                  <CardTitle >매출 추이</CardTitle>
                  <CardDescription>최근 발생한 주문 데이터를 기반으로 합니다.</CardDescription>
              </div>
              <select
                  className="px-3 py-1.5 border border-slate-200 rounded-md text-sm bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
              >
                  <option value="daily">일별</option>
                  <option value="weekly">주별</option>
                  <option value="monthly">월별</option>
                  <option value="yearly">년별</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full pr-4">
              {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                          dataKey="date" 
                          stroke="#64748b" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          tickMargin={10}
                      />
                      <YAxis
                          stroke="#64748b"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `₩${(value / 10000).toLocaleString()}만`} // 단위 축약
                          width={60}
                      />
                      <Tooltip 
                          formatter={(value: any) => [`${value.toLocaleString()}원`, "매출"]}
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#2563eb" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                      />
                  </AreaChart>
                  </ResponsiveContainer>
              ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                      아직 매출 데이터가 없습니다. 상품을 구매해보세요!
                  </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 하단 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* 최근 등록 상품 */}
        <Card className="col-span-3 shadow-sm flex flex-col">
           <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-slate-800">최신 채용 공고</CardTitle>
                <CardDescription>현재 진행 중인 채용 건입니다.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate("/recruits")} title="더보기">
              <MoreHorizontal className="h-5 w-5 text-slate-500" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto pr-2 custom-scrollbar">
            <div className="space-y-4">
              {recruits.slice(0, 5).map((recruit) => ( // 5개까지 표시
                <div key={recruit.recruitId} className="group flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => navigate(`/recruits/${recruit.recruitId}`)}>
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-white border border-slate-200 rounded-lg shadow-sm shrink-0">
                     <span className="text-xs text-slate-500 font-medium">{recruit.startDate?.substring(5, 7)}월</span>
                     <span className="text-sm font-bold text-slate-800">{recruit.startDate?.substring(8, 10)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <Badge variant={recruit.status === 'OPEN' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0 h-5">
                            {recruit.status === 'OPEN' ? '채용중' : '마감'}
                        </Badge>
                        {/* <span className="text-xs text-slate-400">D-Day 계산필요</span> */}
                    </div>
                    <p className="text-sm font-medium text-slate-900 leading-tight truncate group-hover:text-primary transition-colors">
                      {recruit.title}
                    </p>
                    {/* <p className="text-xs text-slate-500 mt-1 truncate">
                        경력무관 · 정규직 · 서울
                    </p> */}
                  </div>
                </div>
              ))}
               {recruits.length === 0 && <div className="text-center text-slate-500 py-10">등록된 공고가 없습니다.</div>}
            </div>
          </CardContent>
        </Card>

      </div>
      
      {/* 상품 리스트 */}
      <Card className="shadow-sm">
           <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-slate-800">최근 등록 상품</CardTitle>
                <CardDescription>새롭게 등록된 상품 목록입니다.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/products")}>
              전체보기 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {products.slice(0, 4).map((product) => (
                <div 
                  key={product.prodId} 
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
                  onClick={() => navigate(`/products/${product.prodId}`)}
                >
                  <div className="aspect-square bg-slate-100 relative overflow-hidden">
                    {product.prodImg ? (
                      <img 
                        src={`${BASE_URL}/images/${product.prodImg}`} 
                        alt={product.prodName} 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                         <ShoppingBag className="h-10 w-10" />
                      </div>
                    )}
                    {/* 카테고리 뱃지 */}
                    <div className="absolute left-2 top-2">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur text-slate-800 shadow-sm hover:bg-white">
                            {product.prodCategory}
                        </Badge>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-sm font-medium text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.prodName}
                    </h3>
                    <div className="mt-auto pt-2 flex items-center justify-between">
                        <span className="text-lg font-bold text-slate-900">{product.prodPrice.toLocaleString()}원</span>
                        <span className="text-xs text-slate-500">재고 {product.prodStock}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
             {products.length === 0 && <div className="text-center text-slate-500 py-10">등록된 상품이 없습니다.</div>}
          </CardContent>
      </Card>
    </div>
  );
}