import React from "react";
import { DocumentLineQuad } from "./document-line-quad";
import { DraggableHandlesComponent } from "../cropping/draggable-handles-component";
import { Size } from "../../utils/dto/Size";
import { CroppingViewMagneticLineStyle, CroppingViewPolygonHandleStyle } from "../../model/configuration/cropping-view-configuration";
import { MovingLine } from "../cropping/draggable-base-container";
interface DraggableDocumentPolygonProps {
    size: Size;
    points: any;
    rotations: number;
    scale: number;
    handleStyle: CroppingViewPolygonHandleStyle;
    magneticLineStyle: CroppingViewMagneticLineStyle;
    magneticLines: any;
    polygonStyle: any;
    polygonClasses: any;
    cornerMoveStart: any;
    cornerMoved: any;
    cornerMoveEnd: any;
    style: React.CSSProperties;
}
interface DraggableDocumentPolygonState {
    movingLine: MovingLine;
}
export declare class DraggableDocumentPolygon extends React.Component<DraggableDocumentPolygonProps, DraggableDocumentPolygonState> {
    handles: DraggableHandlesComponent;
    polygon: DocumentLineQuad;
    constructor(props: any);
    render(): React.JSX.Element;
    setFrame(): void;
}
export {};
