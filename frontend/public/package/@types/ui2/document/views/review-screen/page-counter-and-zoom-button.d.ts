import React from "react";
import { ReviewScreenConfiguration } from "../../../configuration/document/ReviewScreenConfiguration";
declare class Props {
    config: ReviewScreenConfiguration;
    currentPage: number;
    totalNumPages: number;
    onZoomButtonClick: () => void;
}
export declare function PageCounterAndZoomButton(props: Props): React.JSX.Element;
export {};
