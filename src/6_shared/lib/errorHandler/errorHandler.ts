import { AxiosError } from "axios";


export enum DEFAULT_ERRORS {
    ERR_NETWORK = "Ошибка сети",
    ERR_BAD_REQUEST = "ERR_BAD_REQUEST",
    SERVER_ERROR = "Ошибка сервера попытайтесь позже!",
    UN_AUTH = "Вы не авторизованы, будете перенаправлены в страницу входа!",
    BAD_REQUEST = "Неправильный запрос!",
    PERMISSION_DENIED = "Доступ запрещен 403!!! ",
    UNEXPECTED_ERROR = "Непредвиденная ошибка!!!",
    NOT_ACCEPTABLE = "Ошибка 406: Невозможно удовлетворить запрос",
    NOT_FOUND = "Ошибка 404: Не найдена",
    CONFLICT = "Ошибка 409: Конфликт",
}


export const errorHandler = (error: AxiosError<any | unknown>): string => {
    const message = error.response?.data.message;
    const errors = new Map<number, string>([
        [400, message || DEFAULT_ERRORS.BAD_REQUEST],
        [401, message || DEFAULT_ERRORS.UN_AUTH],
        [403, message || DEFAULT_ERRORS.PERMISSION_DENIED],
        [404, message || DEFAULT_ERRORS.NOT_FOUND],
        [406, message || DEFAULT_ERRORS.NOT_ACCEPTABLE],
        [406, message || DEFAULT_ERRORS.CONFLICT],
        [409, message || DEFAULT_ERRORS.CONFLICT],
        [500, message || DEFAULT_ERRORS.SERVER_ERROR],
    ]);
    if (error.response?.status) {
        return errors.get(error.response?.status) || DEFAULT_ERRORS.UNEXPECTED_ERROR;
    } else {
        return DEFAULT_ERRORS.UNEXPECTED_ERROR;
    }
};
