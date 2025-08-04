import React from "react";
import { ScanbotCameraProps, ScanbotCameraState, ScannerView } from "./scanner-view";
import { IDocumentDataExtractorScannerHandle } from "./interfaces/i-document-data-extractor-scanner-handle";
import { DocumentDataExtractorViewConfiguration } from "./model/configuration/document-data-extractor-view-configuration";
import type ScanbotSDK from "./scanbot-sdk";
declare class DocumentDataExtractorProps extends ScanbotCameraProps {
    configuration: DocumentDataExtractorViewConfiguration;
    sdk: ScanbotSDK;
}
export default class DocumentDataExtractorView extends ScannerView<DocumentDataExtractorProps, ScanbotCameraState> implements IDocumentDataExtractorScannerHandle {
    private configuration;
    private documentDataExtractor;
    private enabled;
    private finder?;
    constructor(props: DocumentDataExtractorProps);
    static create(sdk: ScanbotSDK, configuration: DocumentDataExtractorViewConfiguration): Promise<IDocumentDataExtractorScannerHandle>;
    componentDidMount(): void;
    componentWillUnmount(): Promise<void>;
    private detect;
    render(): React.JSX.Element;
}
export {};
