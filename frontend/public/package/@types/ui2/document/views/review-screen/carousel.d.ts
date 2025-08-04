import React, { MutableRefObject } from "react";
import type { DocumentScanningFlow } from "../../../configuration/document/DocumentScanningFlow";
import type { SBDocument } from "../../model/sb-document";
declare class Props {
    configuration: DocumentScanningFlow;
    document: SBDocument;
    currentPosition: number | null;
    currentlyRotatingPageId: number | null;
    onRotationAnimationDone: MutableRefObject<null | (() => void)>;
    onGoToPage: (position: number) => void;
    buttonsEnabled: boolean;
}
export declare function Carousel(props: Props): React.JSX.Element;
export {};
