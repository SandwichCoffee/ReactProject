import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  type ProductInput,
  getProductById,
  updateProduct,
  BASE_URL,
} from "@/api/productApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, X } from "lucide-react";

export default function ProductEdit() {
  const { id } = useParams<{ id: string }>();
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
    if (!id) return;

    if (!formData.prodName || !formData.prodPrice) {
      toast.error("상품명과 가격은 필수입니다.");
      return;
    }

    try {
      await updateProduct(Number(id), formData, file);
      toast.success("상품이 수정되었습니다.");
      navigate(`/products/${id}`);
    } catch (error) {
      console.error("수정 실패: ", error);
      toast.error("수정 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (id) {
      getProductById(id).then((data) => {
        setFormData({
          prodName: data.prodName,
          prodPrice: data.prodPrice,
          prodStock: data.prodStock,
          prodCategory: data.prodCategory,
          prodDesc: data.prodDesc,
        });
        if (data.prodImg) {
          setPreviewUrl(`${BASE_URL}/images/${data.prodImg}`);
        }
      });
    }
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">상품 수정</h2>
        <Button variant="outline" onClick={() => navigate("/products")}>
          취소
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>기본 정보 입력</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. 이미지 업로드 영역 */}
            <div className="space-y-2">
              <Label>상품 이미지</Label>
              <div className="flex items-center gap-4">
                {previewUrl ? (
                  // 미리보기 화면
                  <div className="relative w-40 h-40 border rounded-lg overflow-hidden group">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  // 업로드 버튼 (박스 형태)
                  <label className="w-40 h-40 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <ImagePlus className="text-slate-400 mb-2" size={32} />
                    <span className="text-xs text-slate-500">이미지 선택</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* 2. 상품명 */}
            <div className="space-y-2">
              <Label htmlFor="prodName">상품명</Label>
              <Input
                id="prodName"
                name="prodName"
                value={formData.prodName}
                onChange={handleChange}
                placeholder="예: 무선 이어폰"
              />
            </div>

            {/* 3. 가격 & 재고 (가로 배치) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prodPrice">가격 (원)</Label>
                <Input
                  type="number"
                  id="prodPrice"
                  name="prodPrice"
                  value={formData.prodPrice}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prodStock">초기 재고 (개)</Label>
                <Input
                  type="number"
                  id="prodStock"
                  name="prodStock"
                  value={formData.prodStock}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 4. 카테고리 */}
            <div className="space-y-2">
              <Label htmlFor="prodCategory">카테고리</Label>
              <select
                id="prodCategory"
                name="prodCategory"
                value={formData.prodCategory}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="Electronics">전자제품</option>
                <option value="Clothing">의류</option>
                <option value="Home">생활용품</option>
                <option value="Books">도서</option>
              </select>
            </div>

            {/* 5. 상세 설명 */}
            <div className="space-y-2">
              <Label htmlFor="prodDesc">상세 설명</Label>
              <Textarea
                id="prodDesc"
                name="prodDesc"
                value={formData.prodDesc}
                onChange={handleChange}
                placeholder="상품에 대한 설명을 입력하세요."
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" className="w-full">
              상품 수정 완료
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
