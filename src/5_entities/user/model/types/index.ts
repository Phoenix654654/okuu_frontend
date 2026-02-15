export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterStudentRequest {
    email: string;
    full_name: string;
    phone: string;
    role: "Student";
    password: string;
    password_confirm: string;
    group: number;
}

export type OtpPurpose = "Account_verify" | "Reset_password" | "Change_email";

export interface VerifyOtpRequest {
    email: string;
    code: string;
    purpose: OtpPurpose;
}

export interface CreateUserRequest {
    email: string;
    full_name: string;
    phone: string;
    role: "Admin" | "Teacher";
    password: string;
    password_confirm: string;
}

export interface IUser {
    id: number;
    email: string;
    full_name: string;
    role: "Admin" | "Teacher" | "Student";
    student_code: string;
    phone: string;
    group: { id: number; name: string } | null;
    is_active: boolean;
    blocked_at: Date | null;
    created_at: Date;
    updated_at: Date;
}