import {api} from "@/6_shared";
import type {PaginatedResponse, PaginationParams} from "@/6_shared";
import type {CreateGroupRequest, IGroup, UpdateGroupRequest} from "@/5_entities/group";

export const groupService = {
    getList(params: PaginationParams & Record<string, unknown>): Promise<PaginatedResponse<IGroup>> {
        return api.getPaginated<IGroup>("/groups/", params);
    },

    getById(id: number): Promise<IGroup> {
        return api.get<IGroup>(`/groups/${id}/`);
    },

    create(data: CreateGroupRequest): Promise<{ message: string; extra: { id: number } }> {
        return api.post("/groups/", data);
    },

    update(id: number, data: UpdateGroupRequest): Promise<{ message: string }> {
        return api.patch(`/groups/${id}/`, data);
    },

    delete(id: number): Promise<{ message: string }> {
        return api.delete(`/groups/${id}/`);
    },
};
