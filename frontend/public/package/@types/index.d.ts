import { SBStoreImageType } from "./service/storage/indexed-db/sb-indexed-db";

export { IDocumentScannerHandle } from "./interfaces/i-document-scanner-handle";
export {
    DocumentScannerViewConfiguration,
    StyleConfiguration,
    TextConfiguration,
    CaptureButtonStyleConfiguration,
    OutlineStyleConfiguration,
    HintTextConfiguration,
    OutlineLabelStyleConfiguration,
    CaptureAnimationStyleConfiguration,
    OutlinePolygonStyleConfiguration,
    EnabledText
} from "./model/configuration/document-scanner-view-configuration";

export { ViewFinderScannerConfiguration } from "./model/configuration/view-finder-scanner-configuration";

export { ICroppingViewHandle } from "./interfaces/i-cropping-view-handle";
export { CroppingViewConfiguration, CroppingViewStyle, CroppingViewMagneticLineStyle, CroppingViewMagnifierStyle, CroppingViewPolygonStyle, CroppingViewMagnifierBorderStyle, CroppingViewMagnifierCrosshairStyle, CroppingViewPolygonHandleStyle } from "./model/configuration/cropping-view-configuration";
export { CroppingResult } from "./model/response/cropping-result";

export { IBarcodeScannerHandle } from "./interfaces/i-barcode-scanner-handle";
export { BarcodeScannerViewConfiguration } from "./model/configuration/barcode-scanner-view-configuration";
export { BarcodeCountConfiguration, BarcodeCountStyleConfiguration } from "./model/configuration/barcode-count-configuration";
export { BarcodeScannerResultWithSize } from "./model/barcode/barcode-result";

export { IMrzScannerHandle } from "./interfaces/i-mrz-scanner-handle";
export { MrzScannerViewConfiguration, MrzScannerAccumulatedFrameVerificationConfiguration } from "./model/configuration/mrz-scanner-view-configuration";
export * as SimpleMrzRecognizer from "./service/simple-mrz-recognizer";

export { TextPatternScannerViewConfiguration, TextDetectionCallback } from "./model/configuration/text-pattern-scanner-view-configuration";
export { ITextPatternScannerHandle } from "./interfaces/i-text-pattern-scanner-handle";

export { VinScannerViewConfiguration, VinDetectionCallback } from "./model/configuration/vin-scanner-view-configuration";

export { DocumentDataExtractorViewConfiguration } from "./model/configuration/document-data-extractor-view-configuration";
export { DocumentDataExtractor } from "./service/document-data-extractor";

export { PdfGenerator, PdfPageOptions } from "./service/pdf-generator";
export { TiffGenerator, TiffPageOptions } from "./service/tiff-generator";

export { OcrData, default as OcrEngine, Rect } from "./service/ocr-engine";
export { MagneticLine } from "./utils/dto/MagneticLine";

export { default as DocumentQualityAnalyzer } from "./service/document-quality-analyzer";

export { PublicUtils } from "./service/public-utils";
export { Size } from "./utils/dto/Size";
export { VideoSize } from "./utils/dto/VideoSize";

export { SelectionOverlayConfiguration, IBarcodePolygonHandle, IBarcodePolygonLabelHandle, BarcodePolygonStyle, SelectionOverlayTextFormat, SelectionOverlayStyleConfiguration, BarcodePolygonLabelStyle } from "./model/configuration/selection-overlay-configuration";

export { Polygon } from "./utils/dto/Polygon";

//TODO We currently have two implementations of Point in: utils/dto/Point & core-types. Should this be refactored?
export { Point as Point2 } from "./utils/dto/Point";

export { InitializationOptions } from "./model/configuration/initialization-options";
export { LicenseInfo } from "./model/response/license-info";
export { CameraInfo, CameraFacingMode } from "./model/camera-info";

export { ConsumeType } from "./consume-type";

export { BrowserCameras, CameraDetectionStrategy, DiscoverCameraMode } from './utils/browser-cameras';

export { DocumentScannerUIResult } from "./ui2/configuration/document/DocumentScannerUIResult";

/** Storage-related exports */
export { SBStorage, SBStoreCroppedDetectionResult } from "./service/storage/sb-storage";
export { SBStorageUtils, } from "./service/storage/utils/sb-storage-utils";
export { SBStoreImage, SBStorePageImage, SBStoreImageType, SBStorageQuery } from "./service/storage/indexed-db/sb-indexed-db";
export { SBDocument } from "./ui2/document/model/sb-document";
export { SBPage, SBPageEditParams, SBPageCropData } from "./ui2/document/model/sb-page";
export { PageImageSource } from "./ui2/configuration/native/PageImageSource";
export { SBStorageError } from "./service/storage/utils/sb-storage-error";
export { SBDocumentData } from "./ui2/document/model/utils/sb-document-data";
export { SBPageData } from "./ui2/document/model/utils/sb-page-data";

export { default as ScanbotSDKUI2 } from "./ui2/scanbot-sdk-ui";
export * as UIConfig from "./ui2/configuration";
export * from "./core-types";

// We also need to export the Config-namespace as a whole, because it is directly used in
// ScanbotSDK.ts and without it, the API docs would be incomplete.
// In the API docs, Config and the types that are directly exported from ./core-types above are
// automatically reconciled.
export * as Config from "./core-types";
