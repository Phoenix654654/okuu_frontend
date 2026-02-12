import {createAsyncState} from "@/6_shared/lib/helpers/async-state.ts";
import {type LoginRequest, type RegisterStudentRequest, type VerifyOtpRequest, userService} from "@/5_entities/user";
import {makeAutoObservable, runInAction} from "mobx";
import type {IUser} from "@/5_entities/user";


class UserStore {
    inited = false;
    isAuth = false;
    currentUser$ = createAsyncState<IUser>();

    constructor() {
        makeAutoObservable(this);
    }

    initAuthData = async () => {
        try {
            await this.fetchCurrentUser();
        } catch {
            // нет валидной сессии — просто не авторизован
        } finally {
            runInAction(() => {
                this.inited = true;
            });
        }
    };

    login = async (data: LoginRequest): Promise<boolean> => {
        try {
            await userService.login(data);
            await this.fetchCurrentUser();

            runInAction(() => {
                this.isAuth = true;
                this.inited = true;
            });


            return true;
        } catch {
            return false;
        }
    };

    verifyOtp = async (data: VerifyOtpRequest): Promise<boolean> => {
        try {
            await userService.verifyOtp(data);
            return true;
        } catch {
            return false;
        }
    };

    register = async (data: RegisterStudentRequest): Promise<boolean> => {
        try {
            await userService.register(data);
            return true;
        } catch {
            return false;
        }
    };

    logout = async () => {
        try {
            await userService.logout();
        } finally {
            runInAction(() => {
                this.isAuth = false;
                this.currentUser$.clear();
            });
        }
    };

    fetchCurrentUser = async () => {
        const user = await this.currentUser$.run(() => userService.getCurrent());

        if (user) {
            this.isAuth = true;
        }
    };

}

export default new UserStore()