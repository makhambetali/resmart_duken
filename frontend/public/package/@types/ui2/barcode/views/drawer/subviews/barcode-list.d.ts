import React from "react";
import { CountedBarcode, CountedBarcodeAction } from "../../../model/counted-barcodes";
import { ExpectedBarcode, MultipleBarcodesScanningMode, SheetContent } from "../../../../configuration";
interface Props {
    barcodes: CountedBarcode[];
    expectedBarcodes?: ExpectedBarcode[];
    onBarcodeChange: (action: CountedBarcodeAction) => void;
    onNumberClick: (countedBarcode: CountedBarcode) => void;
    sheetContent: SheetContent;
    mode: MultipleBarcodesScanningMode;
    animateBackAfterDelete: boolean;
    indicatorColor: {
        partial: string;
        complete: string;
        notScanned: string;
    };
}
export declare function BarcodeList(props: Props): React.JSX.Element;
export {};
