import React from "react";
import { ZoomOverlay } from "../../configuration/document/ReviewScreenConfiguration";
import { SBPage } from "../model/sb-page";
declare class Props {
    visible: boolean;
    page: SBPage;
    config: ZoomOverlay;
    onCloseButtonClick: () => void;
}
export declare function ZoomScreenController(props: Props): React.JSX.Element;
export {};
