import { Polygon } from "../../utils/dto/Polygon";
import { BaseConfiguration } from "./base-configuration";
import type { Image } from "../../core-types";
export declare class CroppingViewMagneticLineStyle {
    disabled?: boolean;
    color?: string;
}
export declare class CroppingViewPolygonHandleStyle {
    color?: string;
    border?: string;
    size?: number;
    filter?: string;
}
export declare class CroppingViewPolygonStyle {
    color?: string;
    width?: number;
    handles?: CroppingViewPolygonHandleStyle;
}
export declare class CroppingViewStyle {
    padding?: number;
    polygon?: CroppingViewPolygonStyle;
    magneticLines?: CroppingViewMagneticLineStyle;
    magnifier?: CroppingViewMagnifierStyle;
}
export declare class CroppingViewMagnifierStyle {
    margin?: number;
    size?: number;
    zoom?: number;
    border?: CroppingViewMagnifierBorderStyle;
    crosshair?: CroppingViewMagnifierCrosshairStyle;
}
export declare class CroppingViewMagnifierBorderStyle {
    width?: number;
    color?: string;
}
export declare class CroppingViewMagnifierCrosshairStyle {
    size?: number;
    color?: string;
}
export declare class CroppingViewConfiguration extends BaseConfiguration {
    constructor();
    /**
     * Determines whether scroll (incl. bounce) should be disabled when cropping screen is active.
     * Enhances drag-to-crop experience. True by default
     */
    disableScroll?: boolean;
    /**
     * The polygon that defines the initial cropping area.
     * All points should have relative coordinates between 0 and 1.
     * If this is not set, the cropping area is initialized with an automatically detected outline of the document.
     */
    polygon?: Polygon;
    image: Image;
    /**
     * Initial rotations of the original image. Default is 0
     */
    rotations?: number;
    style?: CroppingViewStyle;
    static fromJson(json: any): CroppingViewConfiguration;
}
