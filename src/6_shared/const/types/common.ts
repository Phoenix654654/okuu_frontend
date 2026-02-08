export enum ThemeToast {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
}

export interface PaginationParams {
    page: number;
    per_page: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
}