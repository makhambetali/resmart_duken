import React from "react";
import { BarcodeItem, ManualCountEditDialog } from "../../../configuration";
import { CountedBarcode } from "../../model/counted-barcodes";
interface Props {
    barcode: CountedBarcode | null;
    setCounter: (barcode: BarcodeItem, count: number) => void;
    onCancel: () => void;
    dialogStyling: ManualCountEditDialog;
}
export declare function CountEditDialog(props: Props): React.JSX.Element;
export {};
