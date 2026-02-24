import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, type ProductInput } from "@/api/productApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, X, ArrowLeft, Save } from "lucide-react";

export default function ProductCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductInput>({
    prodName: "",
    prodPrice: 0,
    prodStock: 0,
    prodCategory: "Electronics",
    prodDesc: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.prodName || !formData.prodPrice) {
      alert("상품명과 가격은 필수입니다.");
      return;
    }

    try {
      await createProduct(formData, file);
      alert("상품이 등록되었습니다.");
      navigate("/products");
    } catch (error) {
      console.error("등록 실패: ", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      
      {/* 상단 타이틀 영역 */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">상품 등록</h2>
          <p className="text-sm text-slate-500">상품 등록합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 기본 정보 */}
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-lg">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            
            {/* 상품명 (좌우 배치) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="prodName" className="sm:text-right font-medium text-slate-700">
                상품명 <span className="text-destructive">*</span>
              </Label>
              <div className="sm:col-span-3">
                <Input
                  id="prodName"
                  name="prodName"
                  value={formData.prodName}
                  onChange={handleChange}
                  placeholder="예: 무선 이어폰"
                  className="max-w-md bg-white"
                />
              </div>
            </div>

            {/* 카테고리 (좌우 배치) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="prodCategory" className="sm:text-right font-medium text-slate-700">카테고리</Label>
              <div className="sm:col-span-3">
                <select
                  id="prodCategory"
                  name="prodCategory"
                  value={formData.prodCategory}
                  onChange={handleChange}
                  className="flex h-10 w-full max-w-xs items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Electronics">전자제품</option>
                  <option value="Clothing">의류</option>
                  <option value="Home">생활용품</option>
                  <option value="Books">도서</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 가격 및 재고 */}
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-lg">판매 및 재고 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            
            {/* 가격 (단위 추가 및 좌우 배치) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="prodPrice" className="sm:text-right font-medium text-slate-700">
                가격 <span className="text-destructive">*</span>
              </Label>
              <div className="sm:col-span-3 flex items-center gap-2">
                <Input
                  type="number"
                  id="prodPrice"
                  name="prodPrice"
                  value={formData.prodPrice}
                  onChange={handleChange}
                  className="max-w-[150px] bg-white text-right"
                />
                <span className="text-sm text-slate-500">원</span>
              </div>
            </div>

            {/* 재고 (단위 추가 및 좌우 배치) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="prodStock" className="sm:text-right font-medium text-slate-700">초기 재고</Label>
              <div className="sm:col-span-3 flex items-center gap-2">
                <Input
                  type="number"
                  id="prodStock"
                  name="prodStock"
                  value={formData.prodStock}
                  onChange={handleChange}
                  className="max-w-[150px] bg-white text-right"
                />
                <span className="text-sm text-slate-500">개</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 상세 설명 및 이미지 */}
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-lg">상세 설명 및 이미지</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            
            {/* 이미지 */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
              <Label className="sm:text-right font-medium text-slate-700 mt-2">상품 이미지</Label>
              <div className="sm:col-span-3">
                {previewUrl ? (
                  <div className="relative w-40 h-40 border rounded-lg overflow-hidden group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="w-40 h-40 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors bg-white">
                    <ImagePlus className="text-slate-400 mb-2" size={32} />
                    <span className="text-xs text-slate-500">이미지 선택</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
              <Label htmlFor="prodDesc" className="sm:text-right font-medium text-slate-700 mt-2">상세 설명</Label>
              <div className="sm:col-span-3">
                <Textarea
                  id="prodDesc"
                  name="prodDesc"
                  value={formData.prodDesc}
                  onChange={handleChange}
                  placeholder="상품에 대한 상세 설명을 입력하세요."
                  className="min-h-[120px] bg-white resize-y"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type="submit" size="lg" className="gap-2">
            <Save className="h-4 w-4" /> 변경사항 저장
          </Button>
        </div>

      </form>
    </div>
  );
}
