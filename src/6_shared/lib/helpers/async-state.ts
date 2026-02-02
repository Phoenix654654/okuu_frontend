import { makeAutoObservable, runInAction } from "mobx";

class AsyncState<T> {
    value: T | null = null;
    loading = false;
    error: Error | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    run = async (fn: () => Promise<T>): Promise<T | null> => {
        runInAction(() => {
            this.loading = true;
            this.error = null;
        });

        try {
            const results = await fn();
            runInAction(() => {
                this.value = results;
            });
            return results;
        } catch (e) {
            runInAction(() => {
                this.error = e instanceof Error ? e : new Error(String(e));
            });
            return null;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    clear = () => {
        this.value = null;
        this.error = null;
        this.loading = false;
    };
}

export const createAsyncState = <T>() => new AsyncState<T>();
