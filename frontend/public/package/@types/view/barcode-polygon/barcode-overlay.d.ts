import { Point } from "../../utils/dto/Point";
import { BarcodeItem } from "../../core-types";
export declare class BarcodeOverlay {
    base64Image?: string;
    code: BarcodeItem;
    points: Point[];
    highlighted: boolean;
    constructor(barcode: BarcodeItem);
}
