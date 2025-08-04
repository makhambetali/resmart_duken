import React from "react";
import { BarcodeItemErrorState } from "../../../configuration";
declare class Props extends BarcodeItemErrorState {
    open: boolean;
    handleCancel: () => void;
    handleRetry: () => void;
    dividerColor: string;
    modalOverlayColor: string;
    sheetColor: string;
}
export declare function BarcodeMappingErrorDialog(props: Props): React.JSX.Element;
export {};
