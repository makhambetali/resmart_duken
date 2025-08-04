export type LoadingState<T> = {
    loading: boolean;
    value: T | undefined;
    error: {
        reason: any;
    } | null;
};
/**
 * Returns null if no promise is given.
 * Otherwise, it returns the loading state of the promise.
 * This loading state is not correct in the first call to this function, if the promise is already resolved. This is
 * because it is technically impossible to synchronously determine the loading state of a promise. `promise.then(...)`
 * is executed after the current call stack.
 */
export declare function usePromise<T>(promise: Promise<T> | undefined): null | LoadingState<T>;
