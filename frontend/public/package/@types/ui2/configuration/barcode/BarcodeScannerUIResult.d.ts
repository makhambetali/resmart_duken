import { BarcodeItem } from "../BarcodeScannerTypes";
import { DeepPartial, PartiallyConstructible } from "../utils";
/**
Data about the scanned barcode.
*/
export declare class BarcodeScannerUiItem extends PartiallyConstructible {
    /**
      Scanned barcode.
      */
    readonly barcode: BarcodeItem;
    /**
      Number of scanned barcodes of this symbology and value.
      */
    readonly count: number;
    /** @param source {@displayType `DeepPartial<BarcodeScannerUiItem>`} */
    constructor(source?: DeepPartial<BarcodeScannerUiItem>);
}
/**
Results of the barcode scan.
*/
export declare class BarcodeScannerUiResult extends PartiallyConstructible {
    /**
      Scanned barcode items.
      @defaultValue [];
      */
    readonly items: BarcodeScannerUiItem[];
    /** @param source {@displayType `DeepPartial<BarcodeScannerUiResult>`} */
    constructor(source?: DeepPartial<BarcodeScannerUiResult>);
}
