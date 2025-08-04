import React from "react";
import { BarcodeInfoPropsBase } from "../../barcode-info/barcode-info";
import { BarcodeItem, SwipeToDelete } from "../../../../configuration";
export interface Props extends BarcodeInfoPropsBase {
    barcode: BarcodeItem;
    onDelete: (barcode: BarcodeItem) => void;
    readonlyCount: number | null;
    swipeToDeleteConfig: SwipeToDelete;
    sheetColor: string;
    animateBackAfterDelete: boolean;
}
export default function BarcodeListItem(props: Props): React.JSX.Element;
