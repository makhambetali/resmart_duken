import React from "react";
import { DocumentScanningFlow } from "../../configuration/document/DocumentScanningFlow";
import { Point as CorePoint } from "../../../core/bridge/common";
import type ScanbotSDK from "../../../scanbot-sdk";
import { SBPage } from "../model/sb-page";
declare class Props {
    config: DocumentScanningFlow;
    page?: SBPage;
    onCloseButtonClick: () => void;
    onApplyCrop: (newCrop: CorePoint[], addedCwRotations: number) => Promise<void>;
    sdk: ScanbotSDK;
}
export declare function CroppingScreenController(props: Props): React.JSX.Element;
export {};
