import React from "react";
import { DocumentScanningFlow } from "../../configuration/document/DocumentScanningFlow";
import { SBDocument } from "../model/sb-document";
declare class Props {
    onClose: () => void;
    onSubmit: () => void;
    currentPosition: number | null;
    visible: boolean;
    configuration: DocumentScanningFlow;
    onRetakeImage: (position: number) => void;
    onInsertImage: (position: number) => void;
    onGoToPage: (position: number) => void;
    document: SBDocument;
    onZoomButtonClick: (position: number) => void;
    onCropButtonClick: (position: number) => void;
}
export declare function ReviewScreenController(props: Props): React.JSX.Element;
export {};
