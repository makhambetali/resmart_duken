import { BarcodeItemMapper, BarcodeItem } from "../../../configuration";
import { BarcodeMappedDataLoadingState, IBarcodeMapper, OnEvictionListener } from "./i-barcode-mapper";
export declare class UserBarcodeMapper implements IBarcodeMapper {
    private barcodeItemMapper;
    private onError;
    private readonly cache;
    private readonly cacheEntryPendingRetries;
    private hash;
    /**
     * When an error occurs, the onError callback is called with a retry and a cancel function. Until one of these
     * functions is called, the state of the getBarcodeMappedData will be "RETRY_DIALOG_OPEN".
     * If the retry function is called, all cached entries that are currently in this "RETRY_DIALOG_OPEN" state are cleared.
     */
    constructor(barcodeItemMapper: BarcodeItemMapper, onError: (retry: () => void, cancel: () => void) => void);
    /**
     * Results are cached.
     * Note that, because resulting promise will be used in useMemo, it is important we return the identical
     * promise for the same input (not just a promise with the same value).
     * Also note that we must not make this function async:
     *   If we do this, the function will only be evaluated once somebody awaits its result.
     *   It might be, that before that happens, the function is called again. In this case, the cache value will not
     *   have been set yet.
     * */
    private getBarcodeMappedData;
    useBarcodeMappedData(barcode: BarcodeItem): BarcodeMappedDataLoadingState | null;
    private onEvictionListeners;
    addOnEvictionListener(listener: OnEvictionListener): void;
    removeOnEvictionListener(listener: OnEvictionListener): void;
}
