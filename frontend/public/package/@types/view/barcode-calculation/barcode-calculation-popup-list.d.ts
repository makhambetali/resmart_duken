import React from "react";
import { BarcodeItem } from "../../core-types";
export default class BarcodeCalculationPopupList extends React.Component<any, any> {
    constructor(props: any);
    toUniqueListWithDuplicateCounter(barcodes: BarcodeItem[]): BarcodeItem[];
    update(barcodes: any): void;
    render(): React.ReactNode;
}
