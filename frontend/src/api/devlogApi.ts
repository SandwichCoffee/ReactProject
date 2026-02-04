import { client } from "./client";

export interface DevLog {
    logId: number;
    title: string;
    content: string;
    type: string;
    regDate: string;
}

export interface DevLogInput {
    title: string;
    content: string;
    type: string;
}

export const getDevLogs = async (): Promise<DevLog[]> => {
    const response = await client.get<DevLog[]>("/devlogs");
    return response.data;
};

export const getDevLogById = async (id: string): Promise<DevLog> => {
    const response = await client.get<DevLog>(`/devlogs/${id}`);
    return response.data;
};

export const createDevLog = async (data: DevLogInput): Promise<void> => {
    await client.post("/devlogs", data);
};

export const updateDevLog = async (id: number, data: DevLogInput): Promise<void> => {
    await client.put(`/devlogs/${id}`, data);
};

export const deleteDevLog = async (id: number): Promise<void> => {
    await client.delete(`/devlogs/${id}`);
};
