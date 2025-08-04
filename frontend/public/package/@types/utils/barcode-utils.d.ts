import { BarcodeItem } from "../core-types";
import { Size } from "./dto/Size";
export default class BarcodeUtils {
    /**
     * Keep only the center-most duplicate barcode in the list of barcodes in order to prevent multiple jumping overlays
     * and an array of other issues that can arise from buggy overlays.
     * This is only used in the AR overlay.
     */
    static keepOnlyCenterMostDuplicate(codes: BarcodeItem[], originalImageSize: Size): void;
}
