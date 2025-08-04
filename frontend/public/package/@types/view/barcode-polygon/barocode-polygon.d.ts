import React from "react";
import { Point } from "../../utils/dto/Point";
import { BarcodeOverlay } from "./barcode-overlay";
import { BarcodePolygonStyle, SelectionOverlayConfiguration } from "../../model/configuration/selection-overlay-configuration";
export declare class BarcodePolygonProps {
    element: BarcodeOverlay;
    configuration: SelectionOverlayConfiguration;
    animateToPoints?: Point[];
    onClick?: (element: BarcodeOverlay) => void;
}
export default class BarcodePolygon extends React.Component<BarcodePolygonProps, any> {
    customStyle?: BarcodePolygonStyle;
    constructor(props: any);
    update(model: BarcodeOverlay): void;
    style(style: BarcodePolygonStyle): void;
    render(): React.ReactNode;
}
