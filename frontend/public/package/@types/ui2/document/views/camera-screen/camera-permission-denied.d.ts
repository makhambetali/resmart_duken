import React from "react";
import { DocumentScanningFlow } from "../../../configuration/document/DocumentScanningFlow";
declare class Props {
    visible: boolean;
    onCloseClick: () => void;
    config: DocumentScanningFlow;
}
export declare function CameraPermissionDenied(props: Props): React.JSX.Element;
export {};
