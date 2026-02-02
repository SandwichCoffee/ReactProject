import { client } from "./client";

export interface Recruit {
    recruitId: number;
    title: string;
    contents: string;
    status: "DRAFT" | "OPEN" | "CLOSED";
    startDate: string;
    endDate: string;
    regDate: string;
}

export interface RecruitInput {
    title: string;
    contents: string;
    status: string;
    startDate: string;
    endDate: string;
}

export const getRecruits = async (): Promise<Recruit[]> => {
    const response = await client.get<Recruit[]>("/recruits");
    return response.data;
};

export const getRecruitById = async (id: string): Promise<Recruit> => {
    const response = await client.get<Recruit>(`/recruits/${id}`);
    return response.data;
};

export const createRecruit = async (recruitData: RecruitInput): Promise<void> => {
    await client.post("/recruits", recruitData);
};

export const updateRecruit = async (id: number, recruitData: RecruitInput): Promise<void> => {
    await client.put(`/recruits/${id}`, recruitData);
};

export const deleteRecruit = async (id: number): Promise<void> => {
    await client.delete(`/recruits/${id}`);
};