import { client } from "./client";

export interface User {
    userId: string;
    userName: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
}

export const getUsers = async (): Promise<User[]> => {
    const response = await client.get<User[]>("/users");
    return response.data;
}

export const getUserById = async (id: string): Promise<User> => {
    const response = await client.get<User>(`/users/${id}`);
    return response.data;
}

export const createUser = async (user: User): Promise<void> => {
    await client.post("/users", user);
};

export const updateUser = async (id: string, user: Partial<User>): Promise<void> => {
    await client.put(`/users/${id}`, user);
}

export const deleteUser = async (id: string): Promise<void> => {
    await client.delete(`/users/${id}`)
}