import {makeAutoObservable, runInAction} from "mobx";
import {createAsyncState} from "@/6_shared/lib/helpers/async-state";
import {createListState} from "@/6_shared/lib/helpers/list-state";
import {groupService} from "@/5_entities/group";
import type {CreateGroupRequest, IGroup, UpdateGroupRequest, MarkFinishedRequest} from "@/5_entities/group";

class GroupStore {
    list$ = createListState<IGroup, { search?: string; year?: number; is_finished?: boolean }>();
    current$ = createAsyncState<IGroup>();
    editingGroupId: number | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    fetchGroups = async (params?: { search?: string; year?: number; is_finished?: boolean }) => {
        await this.list$.run((p) => groupService.getList({ ...p, ...params }));
    };

    fetchGroup = async (id: number) => {
        await this.current$.run(() => groupService.getById(id));
    };

    createGroup = async (data: CreateGroupRequest): Promise<boolean> => {
        try {
            await groupService.create(data);
            return true;
        } catch {
            return false;
        }
    };

    updateGroup = async (id: number, data: UpdateGroupRequest): Promise<boolean> => {
        try {
            await groupService.update(id, data);
            return true;
        } catch {
            return false;
        }
    };

    deleteGroup = async (id: number): Promise<boolean> => {
        try {
            await groupService.delete(id);
            runInAction(() => {
                this.list$.items = this.list$.items.filter(g => g.id !== id);
                this.list$.total--;
            });
            return true;
        } catch {
            return false;
        }
    };

    markFinished = async (id: number, data: MarkFinishedRequest): Promise<boolean> => {
        try {
            await groupService.markFinished(id, data);
            runInAction(() => {
                const group = this.list$.items.find(g => g.id === id);
                if (group) {
                    group.is_finished = data.is_finished;
                }
            });
            return true;
        } catch {
            return false;
        }
    };
}

export default new GroupStore();
