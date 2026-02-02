import { client } from "./client";

export interface CartItem {
    cartId: number;
    userId: string;
    prodId: number;
    quantity: number;
    prodName: string;
    prodPrice: number;
    prodImg: string | null;
}

export const getCartList = async (userId: number): Promise<CartItem[]> => {
    const response = await client.get<CartItem[]>(`/cart/user/${userId}`);
    return response.data;
};

export const addToCart = async (userId: number, prodId: number, quantity: number): Promise<void> => {
    await client.post("/cart", { userId, prodId, quantity });
};

export const updateCartQuantity = async (cartId: number, quantity: number): Promise<void> => {
    await client.put("/cart", { cartId, quantity });
};

export const deleteCartItem = async (cartId: number): Promise<void> => {
    await client.delete(`/cart/${cartId}`);
};

// 주문
export const placeOrder = async (userId: number): Promise<void> => {
    await client.post("/orders", { userId });
}