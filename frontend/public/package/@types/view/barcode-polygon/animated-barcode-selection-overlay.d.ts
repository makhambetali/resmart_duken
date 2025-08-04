import React from "react";
import ScanbotCameraView from "../scanbot-camera-view";
import { BarcodeOverlay } from "./barcode-overlay";
import BarcodePolygon from "./barocode-polygon";
import BarcodePolygonLabel from "./barcode-polygon-label";
import { SelectionOverlayConfiguration } from "../../model/configuration/selection-overlay-configuration";
import { ArOverlayBarcodeInfo, AROverlayBarcodeInfoConfig } from "../../ui2/barcode/views/ar/ar-overlay-barcode-info";
import { Frame } from "../../utils/dto/Frame";
import { Size } from "../../utils/dto/Size";
import { BarcodeItem } from "../../core-types";
export declare class BarcodePolygonElement {
    element: BarcodeOverlay;
    updatedAt?: number;
    polygon: JSX.Element;
    label: JSX.Element;
    polygonRef?: BarcodePolygon;
    labelRef?: BarcodePolygonLabel | ArOverlayBarcodeInfo;
    detectedAt: number;
    update(polygon: JSX.Element, polygonRef: BarcodePolygon, label: JSX.Element, labelRef: BarcodePolygonLabel, element: BarcodeOverlay, updatedAt: any): void;
}
export declare class SelectionOverlayProps {
    style?: React.CSSProperties;
    configuration?: SelectionOverlayConfiguration;
    onPolygonSelected?: (code: BarcodeItem) => void;
    onPolygonClick?: (code: BarcodeItem) => void;
    onBarcodeFound?: (code: BarcodeItem, polygon: BarcodePolygon, label: BarcodePolygonLabel) => void;
    LabelComponent: (typeof BarcodePolygonLabel | typeof ArOverlayBarcodeInfo);
    labelComponentConfig: {} | AROverlayBarcodeInfoConfig;
}
declare class AnimatedSelectionOverlayState {
    polygonElements: BarcodePolygonElement[];
}
export default class AnimatedBarcodeSelectionOverlay extends React.Component<SelectionOverlayProps, AnimatedSelectionOverlayState> {
    container: HTMLDivElement;
    constructor(props: SelectionOverlayProps);
    update(finderRect: Frame, camera: ScanbotCameraView, originalImageSize: Size, codes: BarcodeItem[]): void;
    onPolygonClick(model: BarcodeOverlay): void;
    render(): React.ReactNode;
}
export {};
