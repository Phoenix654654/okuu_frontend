import { makeAutoObservable, runInAction } from "mobx";
import type {PaginatedResponse, PaginationParams} from "@/6_shared";


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

    private get paginationParams(): PaginationParams {
        return {
            limit: this.pageSize,
            offset: (this.page - 1) * this.pageSize,
        };
    }

    /** Обычная пагинация - заменяет items */
    run = async (fn: (params: PaginationParams & F) => Promise<PaginatedResponse<T>>) => {
        runInAction(() => {
            this.loading = true;
            this.error = null;
        });

        try {
            const params = {
                ...this.paginationParams,
                ...this.filters,
            } as PaginationParams & F;
            const response = await fn(params);
            runInAction(() => {
                this.items = response.results;
                this.total = response.count;
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
    append = async (fn: (params: PaginationParams & F) => Promise<PaginatedResponse<T>>) => {
        if (this.loading || !this.hasMore) return;

        runInAction(() => {
            this.loading = true;
            this.error = null;
	        this.page++;
        });

        try {
            const params = {
                ...this.paginationParams,
                ...this.filters,
            } as PaginationParams & F;
            const response = await fn(params);
            runInAction(() => {
                this.items.push(...response.results);
                this.total = response.count;
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
