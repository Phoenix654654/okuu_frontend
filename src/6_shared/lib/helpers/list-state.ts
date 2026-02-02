import { makeAutoObservable, runInAction } from "mobx";
import type {PaginatedResponse, MonitoringPaginatedResponse, PaginationParams} from "@/6_shared";

/** Унифицированный тип для результатов пагинации */
type AnyPaginatedResponse<T> = PaginatedResponse<T> | MonitoringPaginatedResponse<T>;

/** Извлекает items и total из любого формата пагинации */
function extractPaginationData<T>(response: AnyPaginatedResponse<T>): { items: T[]; total: number } {
    if ('results' in response) {
        return { items: response.results, total: response.count };
    }

    // для мониторинг api
    return { items: response.items, total: response.total };
}

class ListState<T, F extends object = object> {
    items: T[] = [];
    total = 0;
    loading = false;
    error: Error | null = null;

    page = 1;
    pageSize = 10;
    filters: F = {} as F;

    constructor() {
        makeAutoObservable(this);
    }

    /** Обычная пагинация - заменяет items */
    run = async (fn: (params: PaginationParams & F) => Promise<AnyPaginatedResponse<T>>) => {
        runInAction(() => {
            this.loading = true;
            this.error = null;
        });

        try {
            const params = {
                page: this.page,
                per_page: this.pageSize,
                ...this.filters,
            } as PaginationParams & F;
            const response = await fn(params);
            const { items, total } = extractPaginationData(response);
            runInAction(() => {
                this.items = items;
                this.total = total;
            });
        } catch (e) {
            runInAction(() => {
                this.error = e instanceof Error ? e : new Error(String(e));
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    setFilter = <K extends keyof F>(key: K, value: F[K]) => {
        this.filters[key] = value;
        this.page = 1;
    };

    setFilters = (filters: Partial<F>) => {
        this.filters = { ...this.filters, ...filters };
        this.page = 1;
    };

    resetFilters = () => {
        this.filters = {} as F;
        this.page = 1;
    };

    /** Infinite scroll - добавляет к items */
    append = async (fn: (params: PaginationParams & F) => Promise<AnyPaginatedResponse<T>>) => {
        if (this.loading || !this.hasMore) return;

        runInAction(() => {
            this.loading = true;
            this.error = null;
	        this.page++;
        });

        try {
            const params = {
                page: this.page,
                per_page: this.pageSize,
                ...this.filters,
            } as PaginationParams & F;
            const response = await fn(params);
            const { items, total } = extractPaginationData(response);
            runInAction(() => {
                this.items.push(...items);
                this.total = total;
            });
        } catch (e) {
            runInAction(() => {
                this.error = e instanceof Error ? e : new Error(String(e));
	            this.page--;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    get hasMore() {
        return this.items.length < this.total;
    }

    setPage = (page: number) => {
        this.page = page;
    };

    setPageSize = (size: number) => {
        this.pageSize = size;
        this.page = 1;
    };

    clear = () => {
        this.items = [];
        this.total = 0;
        this.page = 1;
        this.error = null;
        this.filters = {} as F;
    };
}

export const createListState = <T, F extends object = object>() => new ListState<T, F>();
