import { useQuery } from "@tanstack/react-query";
import { getProductById, type Product } from "@/api/productApi";

export const useProduct = (id: string) => {
    return useQuery<Product>({
        queryKey: ["product", id],
        queryFn: () => getProductById(id),
        enabled: !!id,
    });
};
