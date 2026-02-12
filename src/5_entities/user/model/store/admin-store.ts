import {makeAutoObservable, runInAction} from "mobx";
import {createAsyncState} from "@/6_shared/lib/helpers/async-state";
import {createListState} from "@/6_shared/lib/helpers/list-state";
import {userService} from "@/5_entities/user";
import type {IUser, CreateUserRequest} from "@/5_entities/user";

interface UserFilters {
    role?: string;
    search?: string;
}

class UserAdminStoreClass {
    list$ = createListState<IUser, UserFilters>();
    current$ = createAsyncState<IUser>();

    constructor() {
        makeAutoObservable(this);
    }

    fetchUsers = () => {
        return this.list$.run((params) => userService.getUsers(params));
    };

    fetchUser = (id: number) => {
        return this.current$.run(() => userService.getUser(id));
    };

    activateUser = async (id: number): Promise<boolean> => {
        try {
            await userService.activateUser(id);
            runInAction(() => {
                this.updateUserInList(id, {is_active: true});
                if (this.current$.value?.id === id) {
                    this.current$.value.is_active = true;
                }
            });
            return true;
        } catch {
            return false;
        }
    };

    blockUser = async (id: number): Promise<boolean> => {
        try {
            await userService.blockUser(id);
            const blockedAt = new Date();
            runInAction(() => {
                this.updateUserInList(id, {blocked_at: blockedAt});
                if (this.current$.value?.id === id) {
                    this.current$.value.blocked_at = blockedAt;
                }
            });
            return true;
        } catch {
            return false;
        }
    };

    unblockUser = async (id: number): Promise<boolean> => {
        try {
            await userService.unblockUser(id);
            runInAction(() => {
                this.updateUserInList(id, {blocked_at: null});
                if (this.current$.value?.id === id) {
                    this.current$.value.blocked_at = null;
                }
            });
            return true;
        } catch {
            return false;
        }
    };

    createUser = async (data: CreateUserRequest): Promise<boolean> => {
        try {
            await userService.createUser(data);
            return true;
        } catch {
            return false;
        }
    };

    private updateUserInList(id: number, patch: Partial<IUser>) {
        const idx = this.list$.items.findIndex((u) => u.id === id);
        if (idx !== -1) {
            Object.assign(this.list$.items[idx], patch);
        }
    }
}

export default new UserAdminStoreClass();
