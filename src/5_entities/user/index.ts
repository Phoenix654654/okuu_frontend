export { userService } from "./model/services/services";

import UserStore from "./model/store/store";
export { UserStore };

import UserAdminStore from "./model/store/admin-store";
export { UserAdminStore };

export type { LoginRequest, RegisterStudentRequest, VerifyOtpRequest, OtpPurpose, IUser, CreateUserRequest } from "./model/types";