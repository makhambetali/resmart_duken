import { BarcodeItem } from "../../core-types";
export type SelectionOverlayTextFormat = "Text" | "TextAndFormat" | "None";
export declare class BarcodePolygonStyle {
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    cornerRadius?: number;
}
export interface IBarcodePolygonHandle {
    style(style: BarcodePolygonStyle): void;
}
export declare class BarcodePolygonLabelStyle {
    backgroundColor?: string;
    textColor?: string;
}
export interface IBarcodePolygonLabelHandle {
    style(style: BarcodePolygonLabelStyle): void;
}
export declare class SelectionOverlayStyleConfiguration {
    private defaultFillColor?;
    private defaultHighlightedFillColor?;
    polygonStrokeColor?: string;
    polygonFillColor?: string;
    polygonStrokeWidth?: number;
    polygonCornerRadius?: number;
    highlightedPolygonStrokeColor?: string;
    highlightedPolygonFillColor?: string;
    highlightedPolygonStrokeWidth?: number;
    highlightedPolygonCornerRadius?: number;
    textColor?: string;
    textBackgroundColor?: string;
    highlightedTextColor?: string;
    highlightedTextBackgroundColor?: string;
}
export declare class SelectionOverlayConfiguration {
    visible?: boolean;
    /**
     * Controls the format of the text displayed below the selection overlay. Defaults to just the code value
     */
    textFormat?: SelectionOverlayTextFormat;
    /**
     * Determines whether the selection overlay should be automatically selected
     * (and when onBarcodeDetected is called) when a barcode is detected. Defaults to false
     */
    automaticSelectionEnabled?: boolean;
    /**
     Time interval in milliseconds before a barcode is counted again. 0 = no delay. The default value is 1000.
     @defaultValue -1;
     */
    countingRepeatDelay?: number;
    style?: SelectionOverlayStyleConfiguration;
    onBarcodeFound?: (code: BarcodeItem, polygon: IBarcodePolygonHandle, label: IBarcodePolygonLabelHandle) => void;
}
