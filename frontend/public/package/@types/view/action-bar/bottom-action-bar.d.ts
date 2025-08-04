import React from "react";
import { BarcodeItem } from "../../core-types";
export default class BottomActionBar extends React.Component<any, any> {
    constructor(props: any);
    update(barcodes: BarcodeItem[]): void;
    didScan(): boolean;
    render(): React.ReactNode;
}
