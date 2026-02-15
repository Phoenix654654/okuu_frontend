import {makeAutoObservable} from "mobx";
import {createAsyncState} from "@/6_shared/lib/helpers/async-state";
import {createListState} from "@/6_shared/lib/helpers/list-state";
import {userService} from "@/5_entities/user";
import type {IUser, CreateUserRequest} from "@/5_entities/user";

interface UserFilters {
    role?: string;
    search?: string;
    full_name__icontains?: string;
    student_code__icontains?: string;
    is_active?: string;
    group?: number;
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
            await this.fetchUsers();
            return true;
        } catch {
            return false;
        }
    };

    deactivateUser = async (id: number): Promise<boolean> => {
        try {
            await userService.blockUser(id);
            await this.fetchUsers();
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
}

export default new UserAdminStoreClass();
