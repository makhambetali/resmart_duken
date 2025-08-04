import type { commands } from "../worker/ScanbotSDK.Core";
export interface WorkerBridgeInitOptions {
    allowSimd?: boolean;
    allowThreads?: boolean;
    requestSuffix?: string;
}
export type CoreCommands = typeof commands;
export declare class WorkerBridge {
    private instance;
    private continuations;
    private nextTicketId;
    private errorInWorker;
    constructor(basePath: string, options: WorkerBridgeInitOptions);
    private post;
    private createProxy;
    private handleUnrecoverableError;
    readonly copyArgs: {
        initialize: (licenseKey?: string, engine?: string, appId?: string, cdnPath?: string, options?: {
            captureConsole?: boolean;
            allowThreads?: boolean;
            jpegQuality?: number;
            requestSuffix?: string;
        }) => Promise<any>;
        getLicenseInfo: () => Promise<import("./compiled/SdkLicenseInfo").SdkLicenseInfo>;
        encodeJpeg: (image: import("../worker/ScanbotSDK.Core").Image) => Promise<Uint8Array>;
        detectDocument: (image: import("../worker/ScanbotSDK.Core").Image, options: {
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
        }) => Promise<import("./compiled/DocumentScannerTypes").DocumentDetectionResult>;
        detectAndCropDocument: (image: import("../worker/ScanbotSDK.Core").Image) => Promise<import("../worker/ScanbotSDK.Core").CroppedDetectionResult>;
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
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"DocumentScanner">>;
        documentScannerDetect: <ImageType extends import("../worker/ScanbotSDK.Core").Image>(documentScannerToken: import("../worker/ScanbotSDK.Core").ObjectId<"DocumentScanner">, image: ImageType) => Promise<import("./compiled/DocumentScannerTypes").DocumentDetectionResult & {
            originalImage: ImageType;
        }>;
        parseBarcodeDocument: (options: import("./compiled/BarcodeDocumentTypes").BarcodeDocumentFormat[], data: string) => Promise<import("./compiled/GenericDocument").GenericDocument>;
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
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
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
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataBarExpandedConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataBarLimitedConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
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
                checksumAlgorithms?: import("./compiled/BarcodeConfigurationTypes").MsiPlesseyChecksumAlgorithm[];
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
                extensions?: import("./compiled/BarcodeTypes").UpcEanExtensionBehavior;
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
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatQRCodeConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
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
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                strictMode?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatMicroPDF417Configuration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                strictMode?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataMatrixConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
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
                australiaPostCustomerFormat?: import("./compiled/BarcodeConfigurationTypes").AustraliaPostCustomerFormat;
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
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
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
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                strictMode?: boolean;
                formats?: import("./compiled/BarcodeTypes").BarcodeFormat[];
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCommonTwoDConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                strictMode?: boolean;
                formats?: import("./compiled/BarcodeTypes").BarcodeFormat[];
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCommonFourStateConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                formats?: import("./compiled/BarcodeTypes").BarcodeFormat[];
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
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                strictMode?: boolean;
                formats?: import("./compiled/BarcodeTypes").BarcodeFormat[];
                _marker?: () => void;
            })[];
            extractedDocumentFormats?: import("./compiled/BarcodeDocumentTypes").BarcodeDocumentFormat[];
            onlyAcceptDocuments?: boolean;
            returnBarcodeImage?: boolean;
            engineMode?: import("./compiled/BarcodeScannerTypes").BarcodeScannerEngineMode;
            live?: boolean;
            _marker?: () => void;
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"BarcodeScanner">>;
        scanBarcodes: <ImageType_1 extends import("../worker/ScanbotSDK.Core").Image>(barcodeScannerToken: import("../worker/ScanbotSDK.Core").ObjectId<"BarcodeScanner">, image: ImageType_1) => Promise<import("./compiled/BarcodeScannerTypes").BarcodeScannerResult & {
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
            pageSize?: import("./compiled/PdfConfigurationTypes").PageSize;
            pageDirection?: import("./compiled/PdfConfigurationTypes").PageDirection;
            pageFit?: import("./compiled/PdfConfigurationTypes").PageFit;
            dpi?: number;
            jpegQuality?: number;
            resamplingMethod?: import("./compiled/PdfConfigurationTypes").ResamplingMethod;
            _marker?: () => void;
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"PdfGenerationContext">>;
        addPageToPdf: (pdfOperation: import("../worker/ScanbotSDK.Core").ObjectId<"PdfGenerationContext">, image: import("../worker/ScanbotSDK.Core").Image) => Promise<void>;
        completePdf: (pdfOperation: import("../worker/ScanbotSDK.Core").ObjectId<"PdfGenerationContext">) => Promise<Uint8Array>;
        beginTiff: (options: {
            compression?: import("./compiled/TiffTypes").CompressionMode;
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
                outputMode?: import("./compiled/ParametricFilters").OutputMode;
                _marker?: () => void;
            } | {
                readonly _type?: "CustomBinarizationFilter";
                outputMode?: import("./compiled/ParametricFilters").OutputMode;
                denoise?: number;
                radius?: number;
                preset?: import("./compiled/ParametricFilters").BinarizationFilterPreset;
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
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"TiffGenerationContext">>;
        addPageToTiff: (tiffOperation: import("../worker/ScanbotSDK.Core").ObjectId<"TiffGenerationContext">, image: import("../worker/ScanbotSDK.Core").Image, binarization: import("./compiled/TiffTypes").Binarization) => Promise<unknown>;
        completeTiff: (tiffOperation: import("../worker/ScanbotSDK.Core").ObjectId<"TiffGenerationContext">) => Promise<Uint8Array>;
        createMRZScanner: (configuration: {
            frameAccumulationConfiguration?: {
                maximumNumberOfAccumulatedFrames?: number;
                minimumNumberOfRequiredFramesWithEqualScanningResult?: number;
                _marker?: () => void;
            };
            enableDetection?: boolean;
            incompleteResultHandling?: import("./compiled/MrzTypes").MrzIncompleteResultHandling;
            _marker?: () => void;
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"MRZScannerContext">>;
        scanMRZ: <ImageType_2 extends import("../worker/ScanbotSDK.Core").Image>(mrzScannerToken: import("../worker/ScanbotSDK.Core").ObjectId<"MRZScannerContext">, image: ImageType_2) => Promise<import("./compiled/MrzTypes").MrzScannerResult & {
            originalImage: ImageType_2;
        }>;
        releaseObject: <T>(objectToken: import("../worker/ScanbotSDK.Core").ObjectId<T>) => Promise<void>;
        createOcrEngine: () => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"TLDROcrContext">>;
        performOcr: (tldrOcrToken: import("../worker/ScanbotSDK.Core").ObjectId<"TLDROcrContext">, image: import("../worker/ScanbotSDK.Core").Image) => Promise<import("./compiled/OcrTypes").Page>;
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
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"TextPatternScanner">>;
        scanTextLine: <ImageType_3 extends import("../worker/ScanbotSDK.Core").Image>(scannerToken: import("../worker/ScanbotSDK.Core").ObjectId<"TextPatternScanner">, image: ImageType_3) => Promise<import("./compiled/TextPatternScannerTypes").TextPatternScannerResult & {
            originalImage: ImageType_3;
        }>;
        cleanTextLineScanningQueue: (scannerToken: import("../worker/ScanbotSDK.Core").ObjectId<"TextPatternScanner">) => Promise<void>;
        createVinScanner: (configuration: {
            extractVINFromBarcode?: boolean;
            ocrResolutionLimit?: number;
            maximumNumberOfAccumulatedFrames?: number;
            minimumNumberOfRequiredFramesWithEqualScanningResult?: number;
            _marker?: () => void;
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"VinScanner">>;
        scanVin: <ImageType_4 extends import("../worker/ScanbotSDK.Core").Image>(scannerToken: import("../worker/ScanbotSDK.Core").ObjectId<"VinScanner">, image: ImageType_4) => Promise<import("./compiled/VinScannerTypes").VinScannerResult & {
            originalImage: ImageType_4;
        }>;
        cleanVinScanningQueue: (scannerToken: import("../worker/ScanbotSDK.Core").ObjectId<"VinScanner">) => Promise<void>;
        createDocumentQualityAnalyzer: (options: {
            qualityThresholds?: {
                readonly symbolQuality?: number;
                readonly symbolRatio?: number;
                _marker?: () => void;
            }[];
            qualityIndices?: import("./compiled/DocumentQualityAnalyzerTypes").DocumentQuality[];
            detectOrientation?: boolean;
            maxImageSize?: number;
            minEstimatedNumberOfSymbolsForDocument?: number;
            minProcessedFraction?: number;
            maxProcessedFraction?: number;
            earlyStopIfNSymbolsFound?: number;
            tileSize?: number;
            _marker?: () => void;
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"DocumentQualityAnalyzer">>;
        documentQualityAnalyzerAnalyze: (dqaToken: import("../worker/ScanbotSDK.Core").ObjectId<"DocumentQualityAnalyzer">, image: import("../worker/ScanbotSDK.Core").Image) => Promise<import("./compiled/DocumentQualityAnalyzerTypes").DocumentQualityAnalyzerResult>;
        imageApplyFilter: (image: import("../worker/ScanbotSDK.Core").Image, filter: import("./common").DeepPartial<import("./compiled/ParametricFilters").ParametricFilter>) => Promise<import("./common").RawImage>;
        imageCrop: (image: import("../worker/ScanbotSDK.Core").Image, polygon: [import("./common").Point, import("./common").Point, import("./common").Point, import("./common").Point]) => Promise<import("./common").RawImage>;
        imageResize: (image: import("../worker/ScanbotSDK.Core").Image, destinationSize: number) => Promise<import("./common").RawImage>;
        imageRotate: (image: import("../worker/ScanbotSDK.Core").Image, rotations: import("./compiled/ImageTypes").ImageRotation) => Promise<import("./common").RawImage>;
        documentDataExtractorCreate: (parameters: {
            resultAccumulationConfig?: {
                confirmationMethod?: import("./compiled/FrameAccumulationTypes").ConfirmationMethod;
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
                expectedCountry?: import("./compiled/DocumentDataExtractorConfigurationTypes").EuropeanHealthInsuranceCardIssuingCountry;
                _marker?: () => void;
            } | {
                readonly _type?: "MRZFallbackConfiguration";
                acceptedCountries?: string[];
                acceptedMRZTypes?: import("./compiled/MrzTypes").MrzDocumentType[];
                _marker?: () => void;
            } | {
                readonly _type?: "DocumentDataExtractorCommonConfiguration";
                acceptedDocumentTypes?: string[];
                _marker?: () => void;
            })[];
            _marker?: () => void;
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"DocumentDataExtractor">>;
        documentDataExtractorExtract: <ImageType_5 extends import("../worker/ScanbotSDK.Core").Image>(gdrToken: import("../worker/ScanbotSDK.Core").ObjectId<"DocumentDataExtractor">, image: ImageType_5, parameters: {
            mode?: import("./compiled/DocumentDataExtractorTypes").DocumentDataExtractionMode;
            _marker?: () => void;
        }) => Promise<import("./compiled/DocumentDataExtractorTypes").DocumentDataExtractionResult & {
            originalImage: ImageType_5;
        }>;
        version: () => Promise<string>;
        __hasModuleFunction: (functionName: string) => Promise<any>;
        __callModuleFunction: (functionName: string, args?: any[]) => Promise<any>;
    };
    readonly transferArgs: {
        initialize: (licenseKey?: string, engine?: string, appId?: string, cdnPath?: string, options?: {
            captureConsole?: boolean;
            allowThreads?: boolean;
            jpegQuality?: number;
            requestSuffix?: string;
        }) => Promise<any>;
        getLicenseInfo: () => Promise<import("./compiled/SdkLicenseInfo").SdkLicenseInfo>;
        encodeJpeg: (image: import("../worker/ScanbotSDK.Core").Image) => Promise<Uint8Array>;
        detectDocument: (image: import("../worker/ScanbotSDK.Core").Image, options: {
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
        }) => Promise<import("./compiled/DocumentScannerTypes").DocumentDetectionResult>;
        detectAndCropDocument: (image: import("../worker/ScanbotSDK.Core").Image) => Promise<import("../worker/ScanbotSDK.Core").CroppedDetectionResult>;
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
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"DocumentScanner">>;
        documentScannerDetect: <ImageType extends import("../worker/ScanbotSDK.Core").Image>(documentScannerToken: import("../worker/ScanbotSDK.Core").ObjectId<"DocumentScanner">, image: ImageType) => Promise<import("./compiled/DocumentScannerTypes").DocumentDetectionResult & {
            originalImage: ImageType;
        }>;
        parseBarcodeDocument: (options: import("./compiled/BarcodeDocumentTypes").BarcodeDocumentFormat[], data: string) => Promise<import("./compiled/GenericDocument").GenericDocument>;
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
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
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
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataBarExpandedConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataBarLimitedConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
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
                checksumAlgorithms?: import("./compiled/BarcodeConfigurationTypes").MsiPlesseyChecksumAlgorithm[];
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
                extensions?: import("./compiled/BarcodeTypes").UpcEanExtensionBehavior;
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
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatQRCodeConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
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
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                strictMode?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatMicroPDF417Configuration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                strictMode?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataMatrixConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
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
                australiaPostCustomerFormat?: import("./compiled/BarcodeConfigurationTypes").AustraliaPostCustomerFormat;
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
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
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
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                strictMode?: boolean;
                formats?: import("./compiled/BarcodeTypes").BarcodeFormat[];
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCommonTwoDConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                strictMode?: boolean;
                formats?: import("./compiled/BarcodeTypes").BarcodeFormat[];
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCommonFourStateConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                formats?: import("./compiled/BarcodeTypes").BarcodeFormat[];
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
                gs1Handling?: import("./compiled/BarcodeTypes").Gs1Handling;
                strictMode?: boolean;
                formats?: import("./compiled/BarcodeTypes").BarcodeFormat[];
                _marker?: () => void;
            })[];
            extractedDocumentFormats?: import("./compiled/BarcodeDocumentTypes").BarcodeDocumentFormat[];
            onlyAcceptDocuments?: boolean;
            returnBarcodeImage?: boolean;
            engineMode?: import("./compiled/BarcodeScannerTypes").BarcodeScannerEngineMode;
            live?: boolean;
            _marker?: () => void;
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"BarcodeScanner">>;
        scanBarcodes: <ImageType_1 extends import("../worker/ScanbotSDK.Core").Image>(barcodeScannerToken: import("../worker/ScanbotSDK.Core").ObjectId<"BarcodeScanner">, image: ImageType_1) => Promise<import("./compiled/BarcodeScannerTypes").BarcodeScannerResult & {
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
            pageSize?: import("./compiled/PdfConfigurationTypes").PageSize;
            pageDirection?: import("./compiled/PdfConfigurationTypes").PageDirection;
            pageFit?: import("./compiled/PdfConfigurationTypes").PageFit;
            dpi?: number;
            jpegQuality?: number;
            resamplingMethod?: import("./compiled/PdfConfigurationTypes").ResamplingMethod;
            _marker?: () => void;
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"PdfGenerationContext">>;
        addPageToPdf: (pdfOperation: import("../worker/ScanbotSDK.Core").ObjectId<"PdfGenerationContext">, image: import("../worker/ScanbotSDK.Core").Image) => Promise<void>;
        completePdf: (pdfOperation: import("../worker/ScanbotSDK.Core").ObjectId<"PdfGenerationContext">) => Promise<Uint8Array>;
        beginTiff: (options: {
            compression?: import("./compiled/TiffTypes").CompressionMode;
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
                outputMode?: import("./compiled/ParametricFilters").OutputMode;
                _marker?: () => void;
            } | {
                readonly _type?: "CustomBinarizationFilter";
                outputMode?: import("./compiled/ParametricFilters").OutputMode;
                denoise?: number;
                radius?: number;
                preset?: import("./compiled/ParametricFilters").BinarizationFilterPreset;
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
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"TiffGenerationContext">>;
        addPageToTiff: (tiffOperation: import("../worker/ScanbotSDK.Core").ObjectId<"TiffGenerationContext">, image: import("../worker/ScanbotSDK.Core").Image, binarization: import("./compiled/TiffTypes").Binarization) => Promise<unknown>;
        completeTiff: (tiffOperation: import("../worker/ScanbotSDK.Core").ObjectId<"TiffGenerationContext">) => Promise<Uint8Array>;
        createMRZScanner: (configuration: {
            frameAccumulationConfiguration?: {
                maximumNumberOfAccumulatedFrames?: number;
                minimumNumberOfRequiredFramesWithEqualScanningResult?: number;
                _marker?: () => void;
            };
            enableDetection?: boolean;
            incompleteResultHandling?: import("./compiled/MrzTypes").MrzIncompleteResultHandling;
            _marker?: () => void;
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"MRZScannerContext">>;
        scanMRZ: <ImageType_2 extends import("../worker/ScanbotSDK.Core").Image>(mrzScannerToken: import("../worker/ScanbotSDK.Core").ObjectId<"MRZScannerContext">, image: ImageType_2) => Promise<import("./compiled/MrzTypes").MrzScannerResult & {
            originalImage: ImageType_2;
        }>;
        releaseObject: <T>(objectToken: import("../worker/ScanbotSDK.Core").ObjectId<T>) => Promise<void>;
        createOcrEngine: () => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"TLDROcrContext">>;
        performOcr: (tldrOcrToken: import("../worker/ScanbotSDK.Core").ObjectId<"TLDROcrContext">, image: import("../worker/ScanbotSDK.Core").Image) => Promise<import("./compiled/OcrTypes").Page>;
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
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"TextPatternScanner">>;
        scanTextLine: <ImageType_3 extends import("../worker/ScanbotSDK.Core").Image>(scannerToken: import("../worker/ScanbotSDK.Core").ObjectId<"TextPatternScanner">, image: ImageType_3) => Promise<import("./compiled/TextPatternScannerTypes").TextPatternScannerResult & {
            originalImage: ImageType_3;
        }>;
        cleanTextLineScanningQueue: (scannerToken: import("../worker/ScanbotSDK.Core").ObjectId<"TextPatternScanner">) => Promise<void>;
        createVinScanner: (configuration: {
            extractVINFromBarcode?: boolean;
            ocrResolutionLimit?: number;
            maximumNumberOfAccumulatedFrames?: number;
            minimumNumberOfRequiredFramesWithEqualScanningResult?: number;
            _marker?: () => void;
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"VinScanner">>;
        scanVin: <ImageType_4 extends import("../worker/ScanbotSDK.Core").Image>(scannerToken: import("../worker/ScanbotSDK.Core").ObjectId<"VinScanner">, image: ImageType_4) => Promise<import("./compiled/VinScannerTypes").VinScannerResult & {
            originalImage: ImageType_4;
        }>;
        cleanVinScanningQueue: (scannerToken: import("../worker/ScanbotSDK.Core").ObjectId<"VinScanner">) => Promise<void>;
        createDocumentQualityAnalyzer: (options: {
            qualityThresholds?: {
                readonly symbolQuality?: number;
                readonly symbolRatio?: number;
                _marker?: () => void;
            }[];
            qualityIndices?: import("./compiled/DocumentQualityAnalyzerTypes").DocumentQuality[];
            detectOrientation?: boolean;
            maxImageSize?: number;
            minEstimatedNumberOfSymbolsForDocument?: number;
            minProcessedFraction?: number;
            maxProcessedFraction?: number;
            earlyStopIfNSymbolsFound?: number;
            tileSize?: number;
            _marker?: () => void;
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"DocumentQualityAnalyzer">>;
        documentQualityAnalyzerAnalyze: (dqaToken: import("../worker/ScanbotSDK.Core").ObjectId<"DocumentQualityAnalyzer">, image: import("../worker/ScanbotSDK.Core").Image) => Promise<import("./compiled/DocumentQualityAnalyzerTypes").DocumentQualityAnalyzerResult>;
        imageApplyFilter: (image: import("../worker/ScanbotSDK.Core").Image, filter: import("./common").DeepPartial<import("./compiled/ParametricFilters").ParametricFilter>) => Promise<import("./common").RawImage>;
        imageCrop: (image: import("../worker/ScanbotSDK.Core").Image, polygon: [import("./common").Point, import("./common").Point, import("./common").Point, import("./common").Point]) => Promise<import("./common").RawImage>;
        imageResize: (image: import("../worker/ScanbotSDK.Core").Image, destinationSize: number) => Promise<import("./common").RawImage>;
        imageRotate: (image: import("../worker/ScanbotSDK.Core").Image, rotations: import("./compiled/ImageTypes").ImageRotation) => Promise<import("./common").RawImage>;
        documentDataExtractorCreate: (parameters: {
            resultAccumulationConfig?: {
                confirmationMethod?: import("./compiled/FrameAccumulationTypes").ConfirmationMethod;
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
                expectedCountry?: import("./compiled/DocumentDataExtractorConfigurationTypes").EuropeanHealthInsuranceCardIssuingCountry;
                _marker?: () => void;
            } | {
                readonly _type?: "MRZFallbackConfiguration";
                acceptedCountries?: string[];
                acceptedMRZTypes?: import("./compiled/MrzTypes").MrzDocumentType[];
                _marker?: () => void;
            } | {
                readonly _type?: "DocumentDataExtractorCommonConfiguration";
                acceptedDocumentTypes?: string[];
                _marker?: () => void;
            })[];
            _marker?: () => void;
        }) => Promise<import("../worker/ScanbotSDK.Core").ObjectId<"DocumentDataExtractor">>;
        documentDataExtractorExtract: <ImageType_5 extends import("../worker/ScanbotSDK.Core").Image>(gdrToken: import("../worker/ScanbotSDK.Core").ObjectId<"DocumentDataExtractor">, image: ImageType_5, parameters: {
            mode?: import("./compiled/DocumentDataExtractorTypes").DocumentDataExtractionMode;
            _marker?: () => void;
        }) => Promise<import("./compiled/DocumentDataExtractorTypes").DocumentDataExtractionResult & {
            originalImage: ImageType_5;
        }>;
        version: () => Promise<string>;
        __hasModuleFunction: (functionName: string) => Promise<any>;
        __callModuleFunction: (functionName: string, args?: any[]) => Promise<any>;
    };
    destroy(): void;
}
