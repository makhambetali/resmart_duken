import { PdfConfiguration } from "../bridge/compiled/PdfConfigurationTypes";
import { type MrzScannerResult, MrzScannerConfiguration } from "../bridge/compiled/MrzTypes";
import { DocumentQualityAnalyzerConfiguration, type DocumentQualityAnalyzerResult } from "../bridge/compiled/DocumentQualityAnalyzerTypes";
import { ParametricFilter } from "../bridge/compiled/ParametricFilters";
import type { ImageRotation } from "../bridge/compiled/ImageTypes";
import { DocumentScannerParameters, type DocumentDetectionResult } from "../bridge/compiled/DocumentScannerTypes";
import { TextPatternScannerConfiguration, type TextPatternScannerResult } from "../bridge/compiled/TextPatternScannerTypes";
import { VinScannerConfiguration, type VinScannerResult } from "../bridge/compiled/VinScannerTypes";
import type { Page } from "../bridge/compiled/OcrTypes";
import { type BarcodeDocumentFormat } from "../bridge/compiled/BarcodeDocumentTypes";
import { BarcodeScannerConfiguration, type BarcodeScannerResult } from "../bridge/compiled/BarcodeScannerTypes";
import { DocumentDataExtractorConfiguration, DocumentDataFrameExtractionParameters as GdrRecognitionParameters, type DocumentDataExtractionResult as GdrRecognitionResult } from "../bridge/compiled/DocumentDataExtractorTypes";
import { type Binarization, TiffGeneratorParameters } from "../bridge/compiled/TiffTypes";
import type { RawImage, Point, DeepPartial } from "../bridge/common";
import type { GenericDocument } from "../bridge/compiled/GenericDocument";
import { SdkLicenseInfo } from "../bridge/compiled/SdkLicenseInfo";
/** Represents an object of type T residing in the WASM's memory. */
export declare class ObjectId<T> {
    readonly id: string;
    /** @internal */
    readonly _type?: T;
    constructor(id: string);
}
/**
 * Represents an image in a format that can be consumed by the WASM module.
 * That is
 *   - either an ImageData object,
 *   - an ArrayBuffer or Uint8Array containing the binary data of an encoded image (most common image formats such as PNG and JPEG are supported),
 *   - or a RawImage, which are obtained by several SDK functions.
 * */
export type Image = ImageData | ArrayBuffer | Uint8Array | RawImage;
type InitializeOptions = {
    captureConsole?: boolean;
    allowThreads?: boolean;
    jpegQuality?: number;
    requestSuffix?: string;
};
export declare const commands: {
    initialize: (licenseKey?: string, engine?: string, appId?: string, cdnPath?: string, options?: InitializeOptions) => Promise<any>;
    getLicenseInfo: () => Promise<SdkLicenseInfo>;
    encodeJpeg: (image: Image) => Promise<Uint8Array>;
    detectDocument: (image: Image, options: DeepPartial<DocumentScannerParameters>) => Promise<DocumentDetectionResult>;
    detectAndCropDocument: (image: Image) => Promise<CroppedDetectionResult>;
    createDocumentScanner: (options: DeepPartial<DocumentScannerParameters>) => Promise<ObjectId<"DocumentScanner">>;
    documentScannerDetect: <ImageType extends Image>(documentScannerToken: ObjectId<"DocumentScanner">, image: ImageType) => Promise<DocumentDetectionResult & {
        originalImage: ImageType;
    }>;
    parseBarcodeDocument: (options: BarcodeDocumentFormat[], data: string) => Promise<GenericDocument | null>;
    createBarcodeScanner: (options: DeepPartial<BarcodeScannerConfiguration>) => Promise<ObjectId<"BarcodeScanner">>;
    scanBarcodes: <ImageType_1 extends Image>(barcodeScannerToken: ObjectId<"BarcodeScanner">, image: ImageType_1) => Promise<BarcodeScannerResult & {
        originalImage: ImageType_1;
    }>;
    beginPdf: (options: DeepPartial<PdfConfiguration>) => Promise<ObjectId<"PdfGenerationContext">>;
    addPageToPdf: (pdfOperation: ObjectId<"PdfGenerationContext">, image: Image) => Promise<void>;
    completePdf: (pdfOperation: ObjectId<"PdfGenerationContext">) => Promise<Uint8Array>;
    beginTiff: (options: DeepPartial<TiffGeneratorParameters>) => Promise<ObjectId<"TiffGenerationContext">>;
    addPageToTiff: (tiffOperation: ObjectId<"TiffGenerationContext">, image: Image, binarization: Binarization) => Promise<unknown>;
    completeTiff: (tiffOperation: ObjectId<"TiffGenerationContext">) => Promise<Uint8Array>;
    createMRZScanner: (configuration: DeepPartial<MrzScannerConfiguration>) => Promise<ObjectId<"MRZScannerContext">>;
    scanMRZ: <ImageType_2 extends Image>(mrzScannerToken: ObjectId<"MRZScannerContext">, image: ImageType_2) => Promise<MrzScannerResult & {
        originalImage: ImageType_2;
    }>;
    releaseObject: <T>(objectToken: ObjectId<T>) => Promise<void>;
    createOcrEngine: () => Promise<ObjectId<"TLDROcrContext">>;
    performOcr: (tldrOcrToken: ObjectId<"TLDROcrContext">, image: Image) => Promise<Page>;
    createTextPatternScanner: (configuration: DeepPartial<TextPatternScannerConfiguration>) => Promise<ObjectId<"TextPatternScanner">>;
    scanTextLine: <ImageType_3 extends Image>(scannerToken: ObjectId<"TextPatternScanner">, image: ImageType_3) => Promise<TextPatternScannerResult & {
        originalImage: ImageType_3;
    }>;
    cleanTextLineScanningQueue: (scannerToken: ObjectId<"TextPatternScanner">) => Promise<void>;
    createVinScanner: (configuration: DeepPartial<VinScannerConfiguration>) => Promise<ObjectId<"VinScanner">>;
    scanVin: <ImageType_4 extends Image>(scannerToken: ObjectId<"VinScanner">, image: ImageType_4) => Promise<VinScannerResult & {
        originalImage: ImageType_4;
    }>;
    cleanVinScanningQueue: (scannerToken: ObjectId<"VinScanner">) => Promise<void>;
    createDocumentQualityAnalyzer: (options: DeepPartial<DocumentQualityAnalyzerConfiguration>) => Promise<ObjectId<"DocumentQualityAnalyzer">>;
    documentQualityAnalyzerAnalyze: (dqaToken: ObjectId<"DocumentQualityAnalyzer">, image: Image) => Promise<DocumentQualityAnalyzerResult>;
    imageApplyFilter: (image: Image, filter: DeepPartial<ParametricFilter>) => Promise<RawImage>;
    imageCrop: (image: Image, polygon: [Point, Point, Point, Point]) => Promise<RawImage>;
    imageResize: (image: Image, destinationSize: number) => Promise<RawImage>;
    imageRotate: (image: Image, rotations: ImageRotation) => Promise<RawImage>;
    documentDataExtractorCreate: (parameters: DeepPartial<DocumentDataExtractorConfiguration>) => Promise<ObjectId<"DocumentDataExtractor">>;
    documentDataExtractorExtract: <ImageType_5 extends Image>(gdrToken: ObjectId<"DocumentDataExtractor">, image: ImageType_5, parameters: DeepPartial<GdrRecognitionParameters>) => Promise<GdrRecognitionResult & {
        originalImage: ImageType_5;
    }>;
    version: () => Promise<string>;
    __hasModuleFunction: (functionName: string) => Promise<any>;
    __callModuleFunction: (functionName: string, args?: any[]) => Promise<any>;
};
export interface CroppedDetectionResult extends DocumentDetectionResult {
    croppedImage: RawImage | null;
    originalImage: Image;
}
export {};
