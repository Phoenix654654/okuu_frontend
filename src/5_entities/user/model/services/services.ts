import {api} from "@/6_shared";
import type {PaginatedResponse} from "@/6_shared";
import type {PaginatedResponse, PaginationParams} from "@/6_shared";
import type {IUser, LoginRequest, RegisterStudentRequest, VerifyOtpRequest, CreateUserRequest} from "@/5_entities/user";

export const userService = {
    /*** Авторизация ***/
    login(credentials: LoginRequest): Promise<void> {
        return api.post<void>("/auth/jwt/login/", credentials);
    },

    /*** Регистрация студента ***/
    register(data: RegisterStudentRequest): Promise<void> {
        return api.post<void>("/users/", data);
    },

    /*** Подтверждение OTP ***/
    verifyOtp(data: VerifyOtpRequest): Promise<void> {
        return api.post<void>("/auth/verify-otp/", data);
    },

    getCurrent(): Promise<IUser> {
        return api.get<IUser>("/auth/me/");
    },

    logout(): Promise<void> {
        return api.post<void>("/auth/jwt/logout/");
    },

    updateUser(id: number, data: { full_name?: string; email?: string; phone?: string; group?: number | null }): Promise<{ message: string }> {
        return api.patch(`/users/${id}/`, data);
    },

    /*** Админ: управление пользователями ***/
    getUsers(params: Record<string, unknown>): Promise<PaginatedResponse<IUser>> {
        return api.getPaginated<IUser>("/users/", params);
    },

    getUser(id: number): Promise<IUser> {
        return api.get<IUser>(`/users/${id}/`);
    },

    activateUser(id: number): Promise<{ message: string }> {
        return api.post(`/users/${id}/activate/`);
    },

    blockUser(id: number): Promise<{ message: string }> {
        return api.post(`/users/${id}/deactivate/`);
    },

    createUser(data: CreateUserRequest): Promise<{ message: string }> {
        return api.post("/users/", data);
    },

    getStudents(params: PaginationParams & { search?: string }): Promise<PaginatedResponse<IUser>> {
        return api.getPaginated<IUser>("/users/", { ...params, role: "Student" });
    },

    changeStudentCode(id: number): Promise<{ message: string }> {
        return api.post(`/users/${id}/change_student_code/`);
    },

    changePassword(id: number, data: { password: string; password_confirm: string }): Promise<{ message: string }> {
        return api.post(`/users/${id}/change_password/`, data);
    },
}
