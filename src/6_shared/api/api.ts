import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { errorHandler } from "@/6_shared/lib/errorHandler/errorHandler";
import type {PaginatedResponse, PaginationParams} from "@/6_shared";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

// ============================================================================
// Типы
// ============================================================================

export interface RequestOptions extends Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> {
    showError?: boolean;
}

// ============================================================================
// Axios инстанс
// ============================================================================

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

const $api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

$api.interceptors.request.use((config) => {
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
});

$api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !error.config?.url?.includes("/auth/me")) {
            window.location.href = "/login";
        }
        const message = errorHandler(error);
        return Promise.reject({ ...error, message });
    },
);

// ============================================================================
// API методы
// ============================================================================

export const api = {
    /*** GET запрос ***/
    get<T>(url: string, params?: object, options?: RequestOptions): Promise<T> {
        return $api.get<T, AxiosResponse<T>>(url, { params, ...options }).then((res) => res.data);
    },

    /*** POST запрос ***/
    post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
        return $api.post<T, AxiosResponse<T>>(url, data, options).then((res) => res.data);
    },

    /*** PUT запрос ***/
    put<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
        return $api.put<T, AxiosResponse<T>>(url, data, options).then((res) => res.data);
    },

    /*** PATCH запрос ***/
    patch<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
        return $api.patch<T, AxiosResponse<T>>(url, data, options).then((res) => res.data);
    },

    /*** DELETE запрос ***/
    delete<T>(url: string, options?: RequestOptions): Promise<T> {
        return $api.delete<T, AxiosResponse<T>>(url, options).then((res) => res.data);
    },

    /*** GET запрос с пагинацией*/
    getPaginated<T, P = unknown>(
        url: string,
        params?: P | PaginationParams,
        options?: RequestOptions
    ): Promise<PaginatedResponse<T>> {
        return $api.get<PaginatedResponse<T>>(url, { params, ...options }).then((res) => res.data);
    },

    /*** Загрузка файла ***/
    uploadFile<T>(url: string, file: File, fieldName = "file", options?: RequestOptions): Promise<T> {
        const formData = new FormData();
        formData.append(fieldName, file);
        return $api.post<T, AxiosResponse<T>>(url, formData, {
            ...options,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then((res) => res.data);
    },

    /*** Скачивание файла ***/
    downloadFile(url: string, filename: string, params?: Record<string, unknown>): Promise<void> {
        return $api.get(url, {
            params,
            responseType: "blob"
        }).then((res) => {
            const blob = new Blob([res.data]);
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);
        });
    },
};
