import React from "react";
import { StyledText as StyledTextConfig } from "../../../configuration";
import { BarcodeMappedDataLoadingState } from "../../utils/barcode-mapper/i-barcode-mapper";
export interface CounterForm {
    counter: number;
    setCounter: (counter: number) => void;
    onNumberClick: () => void;
    manualCountOutlineColor: string;
    manualCountChangeColor: string;
    removeButtonEnabled?: boolean;
    addButtonEnabled?: boolean;
}
export interface BarcodeInfoPropsBase {
    barcodeImageVisible: boolean;
    maxNumberOfTitleLines: number;
    maxNumberOfSubtitleLines: number;
    imageSize: number;
    displayRightArrow: boolean;
    counterForm?: CounterForm;
    barcodeTitle: StyledTextConfig;
    barcodeSubtitle: StyledTextConfig;
}
export interface BarcodeInfoProps extends BarcodeInfoPropsBase {
    barcodeMappedData: BarcodeMappedDataLoadingState | null;
    readonlyCount?: number;
}
export declare function BarcodeInfo(props: BarcodeInfoProps): React.JSX.Element;
