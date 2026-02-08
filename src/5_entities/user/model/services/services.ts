import {api} from "@/6_shared";
import type {IUser, LoginRequest, RegisterStudentRequest, VerifyOtpRequest} from "@/5_entities/user";

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
}
