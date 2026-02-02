import { ThemeToast } from "@/6_shared";

export interface ToastMessage {
    id: number;
    theme: ThemeToast;
    title: string;
    label: string;
}

export function ErrorKeeper(
    e: any,
    addToast: (message: Omit<ToastMessage, "id">) => void
) {
    const ERROR_MESSAGES = {
        NETWORK_ERROR: {
            theme: ThemeToast.ERROR,
            title: "Ошибка сети!",
            label: "Проверьте подключение.",
        },
        400: {
            theme: ThemeToast.WARNING,
            title: "Ошибка запроса!",
            label: "Неправильный запрос.",
        },
        401: {
            theme: ThemeToast.WARNING,
            title: "Не авторизован!",
            label: "Пожалуйста, войдите в систему.",
        },
        403: {
            theme: ThemeToast.ERROR,
            title: "Доступ запрещен!",
            label: e.response.data.message,
        },
        404: {
            theme: ThemeToast.INFO,
            title: "Ошибка 404!",
            label: "Страница не найдена.",
        },
        409: {
            theme: ThemeToast.WARNING,
            title: "Конфликт данных!",
            label: e.response.data.message,
        },
        500: {
            theme: ThemeToast.ERROR,
            title: "Серверная ошибка!",
            label: "Что-то пошло не так.",
        },
        DEFAULT: {
            theme: ThemeToast.INFO,
            title: "Неизвестная ошибка!",
            label: "Обратитесь к администратору.",
        },
    };

    if (e.message === "Network Error") {
        addToast(ERROR_MESSAGES.NETWORK_ERROR);
        return;
    }

    const status = e.response?.status;
    const message = ERROR_MESSAGES[status] || ERROR_MESSAGES.DEFAULT;

    addToast(message);
}
