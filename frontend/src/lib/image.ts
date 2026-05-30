import { BASE_URL } from "@/api/productApi";

export const PLACEHOLDER_IMAGE = `${import.meta.env.BASE_URL}images/placeholder-product.png`;

export const getProductImageUrl = (prodImg?: string | null) => {
    if(!prodImg) return PLACEHOLDER_IMAGE;

    if(prodImg.startsWith("http://") || prodImg.startsWith("https://")) {
        return prodImg;
    }

    return `${BASE_URL}/images/${prodImg}`;
}
