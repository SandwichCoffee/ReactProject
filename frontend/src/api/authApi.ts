import { client } from "./client";

export interface User {
    userId: string;
    email: string;
    userName: string;
    role: string;
    token?: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    userName: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export const registerUser = async (data: RegisterRequest): Promise<string> => {
    const response = await client.post<string>("/users/join", data);
    return response.data;
}

export const loginUser = async (data: LoginRequest): Promise<User> => {
    const response = await client.post<User>("/users/login", data);
    return response.data;
}