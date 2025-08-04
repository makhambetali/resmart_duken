import BarcodePolygon from "../../../view/barcode-polygon/barocode-polygon";
import { ArOverlayBarcodeInfo } from "../views/ar/ar-overlay-barcode-info";
import { BarcodeItem, BarcodeScannerScreenConfiguration, ExpectedBarcode } from "../../configuration";
import type React from "react";
export type CountedBarcode = {
    barcode: BarcodeItem;
    count: number;
    labelElement?: ArOverlayBarcodeInfo;
    polygonElement?: BarcodePolygon;
};
/**
 * Function that takes the current count of a barcode and returns its new count.
 * `oldCount` is 0 if the barcode is not yet in the list of barcodes.
 **/
type ComputeNewCountFunction = (oldCount?: number, item?: CountedBarcode) => number;
export declare class CountedBarcodeAction {
    type: 'setCount' | 'remove' | 'clear' | 'setHtmlElements' | 'onBarcodesDetected' | 'onARCodeClick' | 'onCountEditDialogChange';
    barcodes?: BarcodeItem[];
    barcode?: BarcodeItem;
    computeNewCount?: ComputeNewCountFunction;
    labelElement?: ArOverlayBarcodeInfo;
    polygonElement?: BarcodePolygon;
    count?: number;
}
export declare const barcodesEqual: (a: BarcodeItem, b: BarcodeItem) => boolean;
export declare const expectedBarcodeEquals: (expected: ExpectedBarcode, barcode: BarcodeItem) => boolean;
export declare const findExpectedBarcode: (expectedBarcodes: ExpectedBarcode[], barcode: BarcodeItem) => ExpectedBarcode;
export declare function createCountedBarcodesReducer(configuration: BarcodeScannerScreenConfiguration, lastCaptureTime: React.MutableRefObject<Date>, scanningEnabled: React.MutableRefObject<boolean>, beepAndVibrate: () => void): (countedBarcodes: Readonly<Readonly<CountedBarcode>[]>, action: CountedBarcodeAction) => Readonly<CountedBarcode>[];
export {};
