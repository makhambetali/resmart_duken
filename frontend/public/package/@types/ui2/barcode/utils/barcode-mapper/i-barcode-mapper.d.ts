/// <reference types="react" />
import { BarcodeItem } from "../../../configuration";
import { BarcodeMappedData } from "../../../configuration/barcode/BarcodeInfoMapping";
export type OnEvictionListener = {
    barcode: BarcodeItem;
    callback: () => void;
};
export declare const BarcodeMapperContext: import("react").Context<IBarcodeMapper>;
export type BarcodeMappedDataLoadingState = {
    value: BarcodeMappedData | null;
    state: 'LOADED' | 'LOADING' | 'RETRY_DIALOG_OPEN' | 'FAILED';
};
export interface IBarcodeMapper {
    useBarcodeMappedData(barcode: BarcodeItem): BarcodeMappedDataLoadingState | null;
    addOnEvictionListener(listener: OnEvictionListener): void;
    removeOnEvictionListener(listener: OnEvictionListener): void;
}
