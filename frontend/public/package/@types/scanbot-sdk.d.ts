import { WorkerBridge } from "./worker/worker-bridge";
import { InitializationOptions } from "./model/configuration/initialization-options";
import { DocumentScannerViewConfiguration } from "./model/configuration/document-scanner-view-configuration";
import { BarcodeScannerViewConfiguration } from "./model/configuration/barcode-scanner-view-configuration";
import { CroppingViewConfiguration } from "./model/configuration/cropping-view-configuration";
import { LicenseInfo } from "./model/response/license-info";
import { IDocumentScannerHandle } from "./interfaces/i-document-scanner-handle";
import { IBarcodeScannerHandle } from "./interfaces/i-barcode-scanner-handle";
import { ICroppingViewHandle } from "./interfaces/i-cropping-view-handle";
import { PdfGenerator } from './service/pdf-generator';
import { TiffGenerator } from './service/tiff-generator';
import { PublicUtils } from "./service/public-utils";
import { Polygon } from "./utils/dto/Polygon";
import { MrzScannerViewConfiguration } from "./model/configuration/mrz-scanner-view-configuration";
import { IMrzScannerHandle } from "./interfaces/i-mrz-scanner-handle";
import SimpleMrzRecognizer from "./service/simple-mrz-recognizer";
import OcrEngine from "./service/ocr-engine";
import { TextPatternScannerViewConfiguration } from "./model/configuration/text-pattern-scanner-view-configuration";
import { VinScannerViewConfiguration } from "./model/configuration/vin-scanner-view-configuration";
import { ITextPatternScannerHandle } from "./interfaces/i-text-pattern-scanner-handle";
import DocumentQualityAnalyzer from "./service/document-quality-analyzer";
import ScanbotSDKUI from "./ui2/scanbot-sdk-ui";
import { Image, DeepPartial, RawImage, ObjectId, Point, DocumentScannerParameters, DocumentDetectionResult, CroppedDetectionResult, BarcodeScannerConfiguration, BarcodeDocumentFormat, DocumentQualityAnalyzerConfiguration, ImageRotation, ParametricFilter, PdfConfiguration, TiffGeneratorParameters, DocumentDataExtractorConfiguration } from "./core-types";
import * as Config from "./core-types";
import { DocumentDataExtractor } from "./service/document-data-extractor";
import { DocumentDataExtractorViewConfiguration } from "./model/configuration/document-data-extractor-view-configuration";
import { ConsumeType } from "./consume-type";
import { Stats } from "./utils/stats";
import { BrowserCameras } from "./utils/browser-cameras";
import { SBStorage } from "./service/storage/sb-storage";
export default class ScanbotSDK {
    /** @internal */
    bridge: WorkerBridge;
    private initialized;
    private static defaultEnginePath;
    /** @internal */
    static instance: ScanbotSDK;
    private static _ui2;
    static get UI(): typeof ScanbotSDKUI;
    static initialize(options: InitializationOptions): Promise<ScanbotSDK>;
    storage: SBStorage;
    /**
     * View Components
     */
    createDocumentScanner(configuration: DocumentScannerViewConfiguration): Promise<IDocumentScannerHandle>;
    createMrzScanner(configuration: MrzScannerViewConfiguration): Promise<IMrzScannerHandle>;
    createBarcodeScanner(configuration: BarcodeScannerViewConfiguration): Promise<IBarcodeScannerHandle>;
    openCroppingView(configuration: CroppingViewConfiguration): Promise<ICroppingViewHandle>;
    createTextPatternScanner(configuration: TextPatternScannerViewConfiguration): Promise<ITextPatternScannerHandle>;
    createVinScanner(configuration: VinScannerViewConfiguration): Promise<ITextPatternScannerHandle>;
    createDocumentDataExtractorScanner(config: DocumentDataExtractorViewConfiguration): Promise<any>;
    /**
     * Image Operations
     */
    toDataUrl(imageBuffer: ArrayBuffer): Promise<string>;
    /** @param detectionParameters {@displayType `DeepPartial<DocumentScannerParameters>`} {@link DocumentScannerParameters}*/
    detectDocument(image: Image, detectionParameters?: DeepPartial<DocumentScannerParameters>, consumeImage?: ConsumeType): Promise<DocumentDetectionResult>;
    detectAndCropDocument(imageBuffer: Image, consumeImage?: ConsumeType): Promise<CroppedDetectionResult>;
    /**
     * @param image An image URL (e.g. Data URL or HTTP URL) or an Image object
     * @param detectionParameters {@displayType `Omit<DeepPartial<BarcodeScannerConfiguration>, "live">`} {@link BarcodeScannerConfiguration}
     * */
    detectBarcodes(image: string | Image, partialDetectionParameters?: DeepPartial<Omit<BarcodeScannerConfiguration, "live">>, consumeImage?: ConsumeType): Promise<Config.BarcodeScannerResult & {
        originalImage: Image;
    }>;
    parseBarcodeDocument(acceptedDocumentFormats: BarcodeDocumentFormat[], rawBarcodeData: string): Promise<Config.GenericDocument>;
    createSimpleMRZRecognizer(): Promise<SimpleMrzRecognizer>;
    createOcrEngine(): Promise<OcrEngine>;
    /** @param config {@displayType `DeepPartial<DocumentQualityAnalyzerConfiguration>`} {@link DocumentQualityAnalyzerConfiguration}*/
    createDocumentQualityAnalyzer(config?: DeepPartial<DocumentQualityAnalyzerConfiguration>): Promise<DocumentQualityAnalyzer>;
    imageRotate(image: Image, rotation: ImageRotation, consumeImage?: ConsumeType): Promise<RawImage>;
    imageFilter(image: Image, filter: ParametricFilter, consumeImage?: ConsumeType): Promise<RawImage>;
    /** Crops and stretches the image to the convex hull of the supplied points. All points should have relative coordinates between 0 and 1. */
    imageCrop(image: Image, polygon: Polygon, consumeImage?: ConsumeType): Promise<RawImage>;
    imageResize(image: Image, destinationSize: number, consumeImage?: ConsumeType): Promise<RawImage>;
    /**
     * Misc. Features
     */
    getLicenseInfo(): Promise<LicenseInfo>;
    /** @param options {@displayType `DeepPartial<PdfConfiguration>`} {@link PdfConfiguration}*/
    beginPdf(options: DeepPartial<PdfConfiguration>): Promise<PdfGenerator>;
    /** @param options {@displayType `DeepPartial<TiffGeneratorParameters>`} {@link TiffGeneratorParameters} */
    beginTiff(options?: DeepPartial<TiffGeneratorParameters>): Promise<TiffGenerator>;
    /** @param options {@displayType `DeepPartial<DocumentDataExtractorConfiguration>`} {@link DocumentDataExtractorConfiguration}*/
    createDocumentDataExtractor(options: DeepPartial<DocumentDataExtractorConfiguration>): Promise<DocumentDataExtractor>;
    imageToJpeg(image: Image, consumeImage?: ConsumeType): Promise<Uint8Array>;
    get version(): string;
    private _utils;
    get utils(): PublicUtils;
    release(object: ObjectId<any>, source?: string): Promise<void>;
    /** @internal */
    getBridge(consumeImage: ConsumeType): {
        initialize: (licenseKey?: string, engine?: string, appId?: string, cdnPath?: string, options?: {
            captureConsole?: boolean;
            allowThreads?: boolean;
            jpegQuality?: number;
            requestSuffix?: string;
        }) => Promise<any>;
        getLicenseInfo: () => Promise<Config.SdkLicenseInfo>;
        encodeJpeg: (image: Image) => Promise<Uint8Array>;
        detectDocument: (image: Image, options: {
            isLive?: boolean;
            acceptedAngleScore?: number;
            acceptedSizeScore?: number;
            acceptedBrightnessThreshold?: number;
            acceptedAspectRatioScore?: number;
            aspectRatios?: {
                readonly width?: number;
                readonly height?: number;
                _marker?: () => void;
            }[];
            ignoreOrientationMismatch?: boolean;
            _marker?: () => void;
        }) => Promise<DocumentDetectionResult>;
        detectAndCropDocument: (image: Image) => Promise<CroppedDetectionResult>;
        createDocumentScanner: (options: {
            isLive?: boolean;
            acceptedAngleScore?: number;
            acceptedSizeScore?: number;
            acceptedBrightnessThreshold?: number;
            acceptedAspectRatioScore?: number;
            aspectRatios?: {
                readonly width?: number;
                readonly height?: number;
                _marker?: () => void;
            }[];
            ignoreOrientationMismatch?: boolean;
            _marker?: () => void;
        }) => Promise<ObjectId<"DocumentScanner">>;
        documentScannerDetect: <ImageType extends Image>(documentScannerToken: ObjectId<"DocumentScanner">, image: ImageType) => Promise<DocumentDetectionResult & {
            originalImage: ImageType;
        }>;
        parseBarcodeDocument: (options: BarcodeDocumentFormat[], data: string) => Promise<Config.GenericDocument>;
        createBarcodeScanner: (options: {
            barcodeFormatConfigurations?: ({
                readonly _type?: "BarcodeFormatCodabarConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                minimumTextLength?: number;
                maximumTextLength?: number;
                returnStartEnd?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCode11Configuration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                stripCheckDigits?: boolean;
                minimumTextLength?: number;
                maximumTextLength?: number;
                checksum?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCode39Configuration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                stripCheckDigits?: boolean;
                minimumTextLength?: number;
                maximumTextLength?: number;
                code32?: boolean;
                code39?: boolean;
                pzn7?: boolean;
                pzn8?: boolean;
                tryCode39ExtendedMode?: boolean;
                useCode39CheckDigit?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCode93Configuration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                minimumTextLength?: number;
                maximumTextLength?: number;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCode128Configuration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                gs1Handling?: Config.Gs1Handling;
                minimumTextLength?: number;
                maximumTextLength?: number;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCode2Of5Configuration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                stripCheckDigits?: boolean;
                minimumTextLength?: number;
                maximumTextLength?: number;
                iata2of5?: boolean;
                code25?: boolean;
                industrial2of5?: boolean;
                useIATA2OF5Checksum?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataBarConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                gs1Handling?: Config.Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataBarExpandedConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                gs1Handling?: Config.Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataBarLimitedConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                gs1Handling?: Config.Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatITFConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                minimumTextLength?: number;
                maximumTextLength?: number;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatMSIPlesseyConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                stripCheckDigits?: boolean;
                minimumTextLength?: number;
                maximumTextLength?: number;
                checksumAlgorithms?: Config.MsiPlesseyChecksumAlgorithm[];
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatUpcEanConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                stripCheckDigits?: boolean;
                ean8?: boolean;
                ean13?: boolean;
                upca?: boolean;
                upce?: boolean;
                extensions?: Config.UpcEanExtensionBehavior;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatPharmaCodeConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                minimumValue?: number;
                allowNarrowBarsOnly?: boolean;
                allowWideBarsOnly?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatAztecConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: Config.Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatQRCodeConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: Config.Gs1Handling;
                strictMode?: boolean;
                qr?: boolean;
                microQr?: boolean;
                rmqr?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatPDF417Configuration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: Config.Gs1Handling;
                strictMode?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatMicroPDF417Configuration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: Config.Gs1Handling;
                strictMode?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataMatrixConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: Config.Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatMaxiCodeConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatAustraliaPostConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                australiaPostCustomerFormat?: Config.AustraliaPostCustomerFormat;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatJapanPostConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatRoyalMailConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                stripCheckDigits?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatRoyalTNTPostConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatUSPSIntelligentMailConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatPharmaCodeTwoTrackConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimumValue?: number;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatGS1CompositeConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                gs1Handling?: Config.Gs1Handling;
                strictMode?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCommonOneDConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                stripCheckDigits?: boolean;
                minimumTextLength?: number;
                maximumTextLength?: number;
                gs1Handling?: Config.Gs1Handling;
                strictMode?: boolean;
                formats?: Config.BarcodeFormat[];
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCommonTwoDConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: Config.Gs1Handling;
                strictMode?: boolean;
                formats?: Config.BarcodeFormat[];
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCommonFourStateConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                formats?: Config.BarcodeFormat[];
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCommonConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                stripCheckDigits?: boolean;
                minimumTextLength?: number;
                maximumTextLength?: number;
                gs1Handling?: Config.Gs1Handling;
                strictMode?: boolean;
                formats?: Config.BarcodeFormat[];
                _marker?: () => void;
            })[];
            extractedDocumentFormats?: BarcodeDocumentFormat[];
            onlyAcceptDocuments?: boolean;
            returnBarcodeImage?: boolean;
            engineMode?: Config.BarcodeScannerEngineMode;
            live?: boolean;
            _marker?: () => void;
        }) => Promise<ObjectId<"BarcodeScanner">>;
        scanBarcodes: <ImageType_1 extends Image>(barcodeScannerToken: ObjectId<"BarcodeScanner">, image: ImageType_1) => Promise<Config.BarcodeScannerResult & {
            originalImage: ImageType_1;
        }>;
        beginPdf: (options: {
            attributes?: {
                author?: string;
                creator?: string;
                title?: string;
                subject?: string;
                keywords?: string;
                _marker?: () => void;
            };
            pageSize?: Config.PageSize;
            pageDirection?: Config.PageDirection;
            pageFit?: Config.PageFit;
            dpi?: number;
            jpegQuality?: number;
            resamplingMethod?: Config.ResamplingMethod;
            _marker?: () => void;
        }) => Promise<ObjectId<"PdfGenerationContext">>;
        addPageToPdf: (pdfOperation: ObjectId<"PdfGenerationContext">, image: Image) => Promise<void>;
        completePdf: (pdfOperation: ObjectId<"PdfGenerationContext">) => Promise<Uint8Array>;
        beginTiff: (options: {
            compression?: Config.CompressionMode;
            jpegQuality?: number;
            zipCompressionLevel?: number;
            dpi?: number;
            userFields?: {
                tag?: number;
                name?: string;
                value?: {
                    readonly _type?: "UserFieldDoubleValue";
                    value?: number;
                    _marker?: () => void;
                } | {
                    readonly _type?: "UserFieldStringValue";
                    value?: string;
                    _marker?: () => void;
                } | {
                    readonly _type?: "UserFieldIntValue";
                    value?: number;
                    _marker?: () => void;
                };
                _marker?: () => void;
            }[];
            binarizationFilter?: {
                readonly _type?: "ScanbotBinarizationFilter";
                outputMode?: Config.OutputMode;
                _marker?: () => void;
            } | {
                readonly _type?: "CustomBinarizationFilter";
                outputMode?: Config.OutputMode;
                denoise?: number;
                radius?: number;
                preset?: Config.BinarizationFilterPreset;
                _marker?: () => void;
            } | {
                readonly _type?: "ColorDocumentFilter";
                _marker?: () => void;
            } | {
                readonly _type?: "BrightnessFilter";
                brightness?: number;
                _marker?: () => void;
            } | {
                readonly _type?: "ContrastFilter";
                contrast?: number;
                _marker?: () => void;
            } | {
                readonly _type?: "GrayscaleFilter";
                borderWidthFraction?: number;
                blackOutliersFraction?: number;
                whiteOutliersFraction?: number;
                _marker?: () => void;
            } | {
                readonly _type?: "LegacyFilter";
                filterType?: number;
                _marker?: () => void;
            } | {
                readonly _type?: "WhiteBlackPointFilter";
                blackPoint?: number;
                whitePoint?: number;
                _marker?: () => void;
            };
            _marker?: () => void;
        }) => Promise<ObjectId<"TiffGenerationContext">>;
        addPageToTiff: (tiffOperation: ObjectId<"TiffGenerationContext">, image: Image, binarization: Config.Binarization) => Promise<unknown>;
        completeTiff: (tiffOperation: ObjectId<"TiffGenerationContext">) => Promise<Uint8Array>;
        createMRZScanner: (configuration: {
            frameAccumulationConfiguration?: {
                maximumNumberOfAccumulatedFrames?: number;
                minimumNumberOfRequiredFramesWithEqualScanningResult?: number;
                _marker?: () => void;
            };
            enableDetection?: boolean;
            incompleteResultHandling?: Config.MrzIncompleteResultHandling;
            _marker?: () => void;
        }) => Promise<ObjectId<"MRZScannerContext">>;
        scanMRZ: <ImageType_2 extends Image>(mrzScannerToken: ObjectId<"MRZScannerContext">, image: ImageType_2) => Promise<Config.MrzScannerResult & {
            originalImage: ImageType_2;
        }>;
        releaseObject: <T>(objectToken: ObjectId<T>) => Promise<void>;
        createOcrEngine: () => Promise<ObjectId<"TLDROcrContext">>;
        performOcr: (tldrOcrToken: ObjectId<"TLDROcrContext">, image: Image) => Promise<Config.Page>;
        createTextPatternScanner: (configuration: {
            ocrResolutionLimit?: number;
            maximumNumberOfAccumulatedFrames?: number;
            minimumNumberOfRequiredFramesWithEqualScanningResult?: number;
            validator?: {
                readonly _type?: "DefaultContentValidator";
                allowedCharacters?: string;
                _marker?: () => void;
            } | {
                readonly _type?: "PatternContentValidator";
                allowedCharacters?: string;
                pattern?: string;
                matchSubstring?: boolean;
                _marker?: () => void;
            };
            _marker?: () => void;
        }) => Promise<ObjectId<"TextPatternScanner">>;
        scanTextLine: <ImageType_3 extends Image>(scannerToken: ObjectId<"TextPatternScanner">, image: ImageType_3) => Promise<Config.TextPatternScannerResult & {
            originalImage: ImageType_3;
        }>;
        cleanTextLineScanningQueue: (scannerToken: ObjectId<"TextPatternScanner">) => Promise<void>;
        createVinScanner: (configuration: {
            extractVINFromBarcode?: boolean;
            ocrResolutionLimit?: number;
            maximumNumberOfAccumulatedFrames?: number;
            minimumNumberOfRequiredFramesWithEqualScanningResult?: number;
            _marker?: () => void;
        }) => Promise<ObjectId<"VinScanner">>;
        scanVin: <ImageType_4 extends Image>(scannerToken: ObjectId<"VinScanner">, image: ImageType_4) => Promise<Config.VinScannerResult & {
            originalImage: ImageType_4;
        }>;
        cleanVinScanningQueue: (scannerToken: ObjectId<"VinScanner">) => Promise<void>;
        createDocumentQualityAnalyzer: (options: {
            qualityThresholds?: {
                readonly symbolQuality?: number;
                readonly symbolRatio?: number;
                _marker?: () => void;
            }[];
            qualityIndices?: Config.DocumentQuality[];
            detectOrientation?: boolean;
            maxImageSize?: number;
            minEstimatedNumberOfSymbolsForDocument?: number;
            minProcessedFraction?: number;
            maxProcessedFraction?: number;
            earlyStopIfNSymbolsFound?: number;
            tileSize?: number;
            _marker?: () => void;
        }) => Promise<ObjectId<"DocumentQualityAnalyzer">>;
        documentQualityAnalyzerAnalyze: (dqaToken: ObjectId<"DocumentQualityAnalyzer">, image: Image) => Promise<Config.DocumentQualityAnalyzerResult>;
        imageApplyFilter: (image: Image, filter: DeepPartial<ParametricFilter>) => Promise<RawImage>;
        imageCrop: (image: Image, polygon: [Point, Point, Point, Point]) => Promise<RawImage>;
        imageResize: (image: Image, destinationSize: number) => Promise<RawImage>;
        imageRotate: (image: Image, rotations: ImageRotation) => Promise<RawImage>;
        documentDataExtractorCreate: (parameters: {
            resultAccumulationConfig?: {
                confirmationMethod?: Config.ConfirmationMethod;
                minConfirmations?: number;
                minConfidenceForStableField?: number;
                autoClearThreshold?: number;
                _marker?: () => void;
            };
            fieldExcludeList?: string[];
            configurations?: ({
                readonly _type?: "DateValidationConfiguration";
                minYear?: number;
                maxYear?: number;
                fieldTypeName?: string;
                _marker?: () => void;
            } | {
                readonly _type?: "EuropeanHealthInsuranceCardConfiguration";
                expectedCountry?: Config.EuropeanHealthInsuranceCardIssuingCountry;
                _marker?: () => void;
            } | {
                readonly _type?: "MRZFallbackConfiguration";
                acceptedCountries?: string[];
                acceptedMRZTypes?: Config.MrzDocumentType[];
                _marker?: () => void;
            } | {
                readonly _type?: "DocumentDataExtractorCommonConfiguration";
                acceptedDocumentTypes?: string[];
                _marker?: () => void;
            })[];
            _marker?: () => void;
        }) => Promise<ObjectId<"DocumentDataExtractor">>;
        documentDataExtractorExtract: <ImageType_5 extends Image>(gdrToken: ObjectId<"DocumentDataExtractor">, image: ImageType_5, parameters: {
            mode?: Config.DocumentDataExtractionMode;
            _marker?: () => void;
        }) => Promise<Config.DocumentDataExtractionResult & {
            originalImage: ImageType_5;
        }>;
        version: () => Promise<string>;
        __hasModuleFunction: (functionName: string) => Promise<any>;
        __callModuleFunction: (functionName: string, args?: any[]) => Promise<any>;
    };
    private licenseCheck;
    /**
     * This method will destroy all web workers and free the memory held by the
     * SDK (after the next run of the garbage collector).
     *
     * This function should not be called while a scanner is open or an API call is pending.
     * If you do call this function while a scanner is open, the scanner will stop detecting anything,
     * but the video will keep running. If you call this function while an API call is pending, that
     * pending API call might never finish.
     *
     * After calling this function, no further calls to this object are allowed. To further use the SDK,
     * it needs to be initialized again.
     */
    destroy(): void;
    static cameras: BrowserCameras;
    static Config: typeof Config;
    /**
     * Used for testing purposes only.
     * @internal
     */
    static _stats: Stats;
}
