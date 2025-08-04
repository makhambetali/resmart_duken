import React from "react";
import { DocumentScanningFlow } from "../../../configuration/document/DocumentScanningFlow";
declare class Props {
    config: DocumentScanningFlow;
    onSubmitClick: () => void;
    onAddPageClick: () => void;
    onRetakeClick: () => void;
    onCropClick: () => void;
    onRotateClick: () => void;
    onDeleteClick: () => void;
    buttonsEnabled: boolean;
}
export declare function useHeight(): 80 | 160;
export declare function BottomBar(props: Props): React.JSX.Element;
export {};
