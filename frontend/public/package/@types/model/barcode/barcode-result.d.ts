import { Size } from "../../utils/dto/Size";
import { BarcodeItem } from "../../core-types";
export declare class BarcodeScannerResultWithSize {
    barcodes: BarcodeItem[];
    originalImageSize: Size | null;
    /**
     * @internal
     */
    constructor(coreResult: {
        barcodes: BarcodeItem[];
        originalImage?: ImageData;
    });
    isEmpty(): boolean;
}
