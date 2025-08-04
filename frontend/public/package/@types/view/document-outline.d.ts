import React from "react";
import AnimatedDocumentPolygon from "./polygon/animated-document-polygon";
import { ShutterButtonAction } from "./shutter-button";
import { EnabledText, OutlineStyleConfiguration } from "../model/configuration/document-scanner-view-configuration";
export interface DocumentOutlineProps {
    style?: OutlineStyleConfiguration;
    initializationText: EnabledText;
    action?: ShutterButtonAction;
    autoCaptureSensitivity?: number;
}
export declare class DocumentOutline extends React.Component<DocumentOutlineProps, any> {
    polygon: AnimatedDocumentPolygon | null;
    label: HTMLLabelElement | null;
    state: {
        text: EnabledText;
        ok: boolean;
        validPoints: boolean;
    };
    render(): React.JSX.Element;
    update(ok: boolean, points: any[], text: string): void;
}
