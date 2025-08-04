export declare class SBStorageUtils {
    /**
     * The persist() method of the SBStorage interface requests permission to use persistent storage,
     * and returns a Promise that resolves to true if permission is granted and bucket mode is persistent, and false otherwise.
     * The browser may or may not honor the request, depending on browser-specific rules.
     * For more details, see https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria#does_browser-stored_data_persist
     */
    persist(): Promise<boolean>;
    /** ©internal */
    estimate(): Promise<boolean>;
}
