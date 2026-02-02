import { useQuery } from "@tanstack/react-query";
import { getProducts, type ProductListResponse } from "@/api/productApi";

export const useProducts = (page: number, size: number) => {
    return useQuery<ProductListResponse>({
        queryKey: ["products", page, size],
        queryFn: () => getProducts(page, size),
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
    });
};
