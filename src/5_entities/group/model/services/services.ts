import {api} from "@/6_shared";
import type {PaginatedResponse, PaginationParams} from "@/6_shared";
import type {CreateGroupRequest, IGroup, UpdateGroupRequest, MarkFinishedRequest} from "@/5_entities/group";

export const groupService = {
    getList(params: PaginationParams & { is_finished?: boolean; search?: string; year?: number }): Promise<PaginatedResponse<IGroup>> {
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

    markFinished(id: number, data: MarkFinishedRequest): Promise<{ message: string }> {
        return api.post(`/groups/${id}/mark-finished/`, data);
    },
};
