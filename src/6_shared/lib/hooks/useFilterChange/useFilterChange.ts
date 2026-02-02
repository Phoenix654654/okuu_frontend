import type {Dayjs} from "dayjs";
import type {ChangeEvent} from "react";

type FilterState<F extends object> = {
    filters: F;
    setFilter: <K extends keyof F>(key: K, value: F[K]) => void;
};

export const useFilterChange = <F extends object>(
    state: FilterState<F>,
    onSearch: () => void
) => {
    const input = <K extends keyof F>(key: K) => (e: ChangeEvent<HTMLInputElement>) => {
        state.setFilter(key, (e.target.value || undefined) as F[K]);
        onSearch();
    };

    const date = <K extends keyof F>(key: K, format = "YYYY-MM-DD") => (value: Dayjs | null) => {
        state.setFilter(key, (value?.format(format) || undefined) as F[K]);
        onSearch();
    };

    const dateRange = <K1 extends keyof F, K2 extends keyof F>(
        startKey: K1,
        endKey: K2,
        format = "YYYY-MM-DD"
    ) => (values: [Dayjs | null, Dayjs | null] | null) => {
        state.setFilter(startKey, (values?.[0]?.format(format) || undefined) as F[K1]);
        state.setFilter(endKey, (values?.[1]?.format(format) || undefined) as F[K2]);
        onSearch();
    };

    const year = <K extends keyof F>(key: K) => (value: Dayjs | null) => {
        state.setFilter(key, (value?.year().toString() || undefined) as F[K]);
        onSearch();
    };

    const select = <K extends keyof F>(key: K) => (value: F[K] | undefined) => {
        state.setFilter(key, (value ?? undefined) as F[K]);
        onSearch();
    };

    return {input, date, dateRange, year, select};
};
