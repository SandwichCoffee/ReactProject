import { client } from "./client";

export const BASE_URL = import.meta.env.MODE === 'production'
    ? "https://reactproject-q472.onrender.com"
    : (import.meta.env.VITE_API_URL || "http://localhost:8088");

// apiClient removed, use imported client instead

export interface ProductInput {
    prodName: string;
    prodPrice: number;
    prodStock: number;
    prodCategory: string;
    prodDesc: string;
}

export interface Product {
    prodId: number;
    prodName: string;
    prodPrice: number;
    prodStock: number;
    prodCategory: string;
    prodDesc: string;
    prodImg: string;
    prodStatus: string;
    regDate: string;
}

export interface ProductListResponse {
    list: Product[];
    total: number;
}

export const getProducts = async (page = 1, size = 10): Promise<ProductListResponse> => {
    const response = await client.get<ProductListResponse>("/products", {
        params: { page, size }
    });
    return response.data;
}

export const getProductById = async (id: string): Promise<Product> => {
    const response = await client.get<Product>(`/products/${id}`);
    return response.data;
}

export const createProduct = async (productData: ProductInput, file: File | null): Promise<void> => {
    const formData = new FormData();

    formData.append("prodName", productData.prodName);
    formData.append("prodPrice", productData.prodPrice.toString());
    formData.append("prodStock", productData.prodStock.toString());
    formData.append("prodCategory", productData.prodCategory);
    formData.append("prodDesc", productData.prodDesc);

    if (file) {
        formData.append("file", file);
    }

    await client.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export const deleteProduct = async (id: number): Promise<void> => {
    await client.delete(`/products/${id}`);
};

export const updateProduct = async (id: number, productData: ProductInput, file: File | null): Promise<void> => {
    const formData = new FormData();

    formData.append("prodName", productData.prodName);
    formData.append("prodPrice", productData.prodPrice.toString());
    formData.append("prodStock", productData.prodStock.toString());
    formData.append("prodCategory", productData.prodCategory);
    formData.append("prodDesc", productData.prodDesc);

    if (file) {
        formData.append("file", file);
    }

    await client.post(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export const webhookSimulation = async (userId: string, prodId: number): Promise<void> => {
    await client.post("/webhook/simulate", { userId, prodId });
}
