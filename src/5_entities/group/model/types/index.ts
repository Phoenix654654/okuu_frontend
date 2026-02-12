import type {IUser} from "@/5_entities/user";

export interface IGroup {
    id: number;
    teacher: IUser;
    name: string;
    year: number;
    created_at: string;
    updated_at: string;
}

export interface CreateGroupRequest {
    teacher: number;
    name: string;
    year: number;
}

export interface UpdateGroupRequest {
    teacher?: number;
    name?: string;
    year?: number;
}
