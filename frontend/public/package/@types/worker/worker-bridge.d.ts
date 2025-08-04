import { WorkerBridge as CoreWorkerBridge, WorkerBridgeInitOptions } from "../core/bridge/worker-bridge";
export declare class WorkerBridge {
    private core;
    /** Will be resolved once the core is initialized */
    private coreInitializationSuccessful;
    constructor(path: string, options: WorkerBridgeInitOptions, initializeArgs: Parameters<CoreWorkerBridge["copyArgs"]["initialize"]>);
    awaitInitialized(): Promise<void>;
    private createProxy;
    readonly copyArgs: {
        initialize: (licenseKey?: string, engine?: string, appId?: string, cdnPath?: string, options?: {
            captureConsole?: boolean;
            allowThreads?: boolean;
            jpegQuality?: number;
            requestSuffix?: string;
        }) => Promise<any>;
        getLicenseInfo: () => Promise<import("../core-types").SdkLicenseInfo>;
        encodeJpeg: (image: import("../core-types").Image) => Promise<Uint8Array>;
        detectDocument: (image: import("../core-types").Image, options: {
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
        }) => Promise<import("../core-types").DocumentDetectionResult>;
        detectAndCropDocument: (image: import("../core-types").Image) => Promise<import("../core-types").CroppedDetectionResult>;
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
        }) => Promise<import("../core-types").ObjectId<"DocumentScanner">>;
        documentScannerDetect: <ImageType extends import("../core-types").Image>(documentScannerToken: import("../core-types").ObjectId<"DocumentScanner">, image: ImageType) => Promise<import("../core-types").DocumentDetectionResult & {
            originalImage: ImageType;
        }>;
        parseBarcodeDocument: (options: import("../core-types").BarcodeDocumentFormat[], data: string) => Promise<import("../core-types").GenericDocument>;
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
                gs1Handling?: import("../core-types").Gs1Handling;
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
                gs1Handling?: import("../core-types").Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataBarExpandedConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                gs1Handling?: import("../core-types").Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataBarLimitedConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                gs1Handling?: import("../core-types").Gs1Handling;
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
                checksumAlgorithms?: import("../core-types").MsiPlesseyChecksumAlgorithm[];
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
                extensions?: import("../core-types").UpcEanExtensionBehavior;
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
                gs1Handling?: import("../core-types").Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatQRCodeConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("../core-types").Gs1Handling;
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
                gs1Handling?: import("../core-types").Gs1Handling;
                strictMode?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatMicroPDF417Configuration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("../core-types").Gs1Handling;
                strictMode?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataMatrixConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("../core-types").Gs1Handling;
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
                australiaPostCustomerFormat?: import("../core-types").AustraliaPostCustomerFormat;
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
                gs1Handling?: import("../core-types").Gs1Handling;
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
                gs1Handling?: import("../core-types").Gs1Handling;
                strictMode?: boolean;
                formats?: import("../core-types").BarcodeFormat[];
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCommonTwoDConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("../core-types").Gs1Handling;
                strictMode?: boolean;
                formats?: import("../core-types").BarcodeFormat[];
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCommonFourStateConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                formats?: import("../core-types").BarcodeFormat[];
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
                gs1Handling?: import("../core-types").Gs1Handling;
                strictMode?: boolean;
                formats?: import("../core-types").BarcodeFormat[];
                _marker?: () => void;
            })[];
            extractedDocumentFormats?: import("../core-types").BarcodeDocumentFormat[];
            onlyAcceptDocuments?: boolean;
            returnBarcodeImage?: boolean;
            engineMode?: import("../core-types").BarcodeScannerEngineMode;
            live?: boolean;
            _marker?: () => void;
        }) => Promise<import("../core-types").ObjectId<"BarcodeScanner">>;
        scanBarcodes: <ImageType_1 extends import("../core-types").Image>(barcodeScannerToken: import("../core-types").ObjectId<"BarcodeScanner">, image: ImageType_1) => Promise<import("../core-types").BarcodeScannerResult & {
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
            pageSize?: import("../core-types").PageSize;
            pageDirection?: import("../core-types").PageDirection;
            pageFit?: import("../core-types").PageFit;
            dpi?: number;
            jpegQuality?: number;
            resamplingMethod?: import("../core-types").ResamplingMethod;
            _marker?: () => void;
        }) => Promise<import("../core-types").ObjectId<"PdfGenerationContext">>;
        addPageToPdf: (pdfOperation: import("../core-types").ObjectId<"PdfGenerationContext">, image: import("../core-types").Image) => Promise<void>;
        completePdf: (pdfOperation: import("../core-types").ObjectId<"PdfGenerationContext">) => Promise<Uint8Array>;
        beginTiff: (options: {
            compression?: import("../core-types").CompressionMode;
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
                outputMode?: import("../core-types").OutputMode;
                _marker?: () => void;
            } | {
                readonly _type?: "CustomBinarizationFilter";
                outputMode?: import("../core-types").OutputMode;
                denoise?: number;
                radius?: number;
                preset?: import("../core-types").BinarizationFilterPreset;
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
        }) => Promise<import("../core-types").ObjectId<"TiffGenerationContext">>;
        addPageToTiff: (tiffOperation: import("../core-types").ObjectId<"TiffGenerationContext">, image: import("../core-types").Image, binarization: import("../core-types").Binarization) => Promise<unknown>;
        completeTiff: (tiffOperation: import("../core-types").ObjectId<"TiffGenerationContext">) => Promise<Uint8Array>;
        createMRZScanner: (configuration: {
            frameAccumulationConfiguration?: {
                maximumNumberOfAccumulatedFrames?: number;
                minimumNumberOfRequiredFramesWithEqualScanningResult?: number;
                _marker?: () => void;
            };
            enableDetection?: boolean;
            incompleteResultHandling?: import("../core-types").MrzIncompleteResultHandling;
            _marker?: () => void;
        }) => Promise<import("../core-types").ObjectId<"MRZScannerContext">>;
        scanMRZ: <ImageType_2 extends import("../core-types").Image>(mrzScannerToken: import("../core-types").ObjectId<"MRZScannerContext">, image: ImageType_2) => Promise<import("../core-types").MrzScannerResult & {
            originalImage: ImageType_2;
        }>;
        releaseObject: <T>(objectToken: import("../core-types").ObjectId<T>) => Promise<void>;
        createOcrEngine: () => Promise<import("../core-types").ObjectId<"TLDROcrContext">>;
        performOcr: (tldrOcrToken: import("../core-types").ObjectId<"TLDROcrContext">, image: import("../core-types").Image) => Promise<import("../core-types").Page>;
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
        }) => Promise<import("../core-types").ObjectId<"TextPatternScanner">>;
        scanTextLine: <ImageType_3 extends import("../core-types").Image>(scannerToken: import("../core-types").ObjectId<"TextPatternScanner">, image: ImageType_3) => Promise<import("../core-types").TextPatternScannerResult & {
            originalImage: ImageType_3;
        }>;
        cleanTextLineScanningQueue: (scannerToken: import("../core-types").ObjectId<"TextPatternScanner">) => Promise<void>;
        createVinScanner: (configuration: {
            extractVINFromBarcode?: boolean;
            ocrResolutionLimit?: number;
            maximumNumberOfAccumulatedFrames?: number;
            minimumNumberOfRequiredFramesWithEqualScanningResult?: number;
            _marker?: () => void;
        }) => Promise<import("../core-types").ObjectId<"VinScanner">>;
        scanVin: <ImageType_4 extends import("../core-types").Image>(scannerToken: import("../core-types").ObjectId<"VinScanner">, image: ImageType_4) => Promise<import("../core-types").VinScannerResult & {
            originalImage: ImageType_4;
        }>;
        cleanVinScanningQueue: (scannerToken: import("../core-types").ObjectId<"VinScanner">) => Promise<void>;
        createDocumentQualityAnalyzer: (options: {
            qualityThresholds?: {
                readonly symbolQuality?: number;
                readonly symbolRatio?: number;
                _marker?: () => void;
            }[];
            qualityIndices?: import("../core-types").DocumentQuality[];
            detectOrientation?: boolean;
            maxImageSize?: number;
            minEstimatedNumberOfSymbolsForDocument?: number;
            minProcessedFraction?: number;
            maxProcessedFraction?: number;
            earlyStopIfNSymbolsFound?: number;
            tileSize?: number;
            _marker?: () => void;
        }) => Promise<import("../core-types").ObjectId<"DocumentQualityAnalyzer">>;
        documentQualityAnalyzerAnalyze: (dqaToken: import("../core-types").ObjectId<"DocumentQualityAnalyzer">, image: import("../core-types").Image) => Promise<import("../core-types").DocumentQualityAnalyzerResult>;
        imageApplyFilter: (image: import("../core-types").Image, filter: import("../core-types").DeepPartial<import("../core-types").ParametricFilter>) => Promise<import("../core-types").RawImage>;
        imageCrop: (image: import("../core-types").Image, polygon: [import("../core-types").Point, import("../core-types").Point, import("../core-types").Point, import("../core-types").Point]) => Promise<import("../core-types").RawImage>;
        imageResize: (image: import("../core-types").Image, destinationSize: number) => Promise<import("../core-types").RawImage>;
        imageRotate: (image: import("../core-types").Image, rotations: import("../core-types").ImageRotation) => Promise<import("../core-types").RawImage>;
        documentDataExtractorCreate: (parameters: {
            resultAccumulationConfig?: {
                confirmationMethod?: import("../core-types").ConfirmationMethod;
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
                expectedCountry?: import("../core-types").EuropeanHealthInsuranceCardIssuingCountry;
                _marker?: () => void;
            } | {
                readonly _type?: "MRZFallbackConfiguration";
                acceptedCountries?: string[];
                acceptedMRZTypes?: import("../core-types").MrzDocumentType[];
                _marker?: () => void;
            } | {
                readonly _type?: "DocumentDataExtractorCommonConfiguration";
                acceptedDocumentTypes?: string[];
                _marker?: () => void;
            })[];
            _marker?: () => void;
        }) => Promise<import("../core-types").ObjectId<"DocumentDataExtractor">>;
        documentDataExtractorExtract: <ImageType_5 extends import("../core-types").Image>(gdrToken: import("../core-types").ObjectId<"DocumentDataExtractor">, image: ImageType_5, parameters: {
            mode?: import("../core-types").DocumentDataExtractionMode;
            _marker?: () => void;
        }) => Promise<import("../core-types").DocumentDataExtractionResult & {
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
        getLicenseInfo: () => Promise<import("../core-types").SdkLicenseInfo>;
        encodeJpeg: (image: import("../core-types").Image) => Promise<Uint8Array>;
        detectDocument: (image: import("../core-types").Image, options: {
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
        }) => Promise<import("../core-types").DocumentDetectionResult>;
        detectAndCropDocument: (image: import("../core-types").Image) => Promise<import("../core-types").CroppedDetectionResult>;
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
        }) => Promise<import("../core-types").ObjectId<"DocumentScanner">>;
        documentScannerDetect: <ImageType extends import("../core-types").Image>(documentScannerToken: import("../core-types").ObjectId<"DocumentScanner">, image: ImageType) => Promise<import("../core-types").DocumentDetectionResult & {
            originalImage: ImageType;
        }>;
        parseBarcodeDocument: (options: import("../core-types").BarcodeDocumentFormat[], data: string) => Promise<import("../core-types").GenericDocument>;
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
                gs1Handling?: import("../core-types").Gs1Handling;
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
                gs1Handling?: import("../core-types").Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataBarExpandedConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                gs1Handling?: import("../core-types").Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataBarLimitedConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                minimum1DQuietZoneSize?: number;
                gs1Handling?: import("../core-types").Gs1Handling;
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
                checksumAlgorithms?: import("../core-types").MsiPlesseyChecksumAlgorithm[];
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
                extensions?: import("../core-types").UpcEanExtensionBehavior;
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
                gs1Handling?: import("../core-types").Gs1Handling;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatQRCodeConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("../core-types").Gs1Handling;
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
                gs1Handling?: import("../core-types").Gs1Handling;
                strictMode?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatMicroPDF417Configuration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("../core-types").Gs1Handling;
                strictMode?: boolean;
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatDataMatrixConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("../core-types").Gs1Handling;
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
                australiaPostCustomerFormat?: import("../core-types").AustraliaPostCustomerFormat;
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
                gs1Handling?: import("../core-types").Gs1Handling;
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
                gs1Handling?: import("../core-types").Gs1Handling;
                strictMode?: boolean;
                formats?: import("../core-types").BarcodeFormat[];
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCommonTwoDConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                gs1Handling?: import("../core-types").Gs1Handling;
                strictMode?: boolean;
                formats?: import("../core-types").BarcodeFormat[];
                _marker?: () => void;
            } | {
                readonly _type?: "BarcodeFormatCommonFourStateConfiguration";
                regexFilter?: string;
                minimumSizeScore?: number;
                addAdditionalQuietZone?: boolean;
                formats?: import("../core-types").BarcodeFormat[];
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
                gs1Handling?: import("../core-types").Gs1Handling;
                strictMode?: boolean;
                formats?: import("../core-types").BarcodeFormat[];
                _marker?: () => void;
            })[];
            extractedDocumentFormats?: import("../core-types").BarcodeDocumentFormat[];
            onlyAcceptDocuments?: boolean;
            returnBarcodeImage?: boolean;
            engineMode?: import("../core-types").BarcodeScannerEngineMode;
            live?: boolean;
            _marker?: () => void;
        }) => Promise<import("../core-types").ObjectId<"BarcodeScanner">>;
        scanBarcodes: <ImageType_1 extends import("../core-types").Image>(barcodeScannerToken: import("../core-types").ObjectId<"BarcodeScanner">, image: ImageType_1) => Promise<import("../core-types").BarcodeScannerResult & {
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
            pageSize?: import("../core-types").PageSize;
            pageDirection?: import("../core-types").PageDirection;
            pageFit?: import("../core-types").PageFit;
            dpi?: number;
            jpegQuality?: number;
            resamplingMethod?: import("../core-types").ResamplingMethod;
            _marker?: () => void;
        }) => Promise<import("../core-types").ObjectId<"PdfGenerationContext">>;
        addPageToPdf: (pdfOperation: import("../core-types").ObjectId<"PdfGenerationContext">, image: import("../core-types").Image) => Promise<void>;
        completePdf: (pdfOperation: import("../core-types").ObjectId<"PdfGenerationContext">) => Promise<Uint8Array>;
        beginTiff: (options: {
            compression?: import("../core-types").CompressionMode;
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
                outputMode?: import("../core-types").OutputMode;
                _marker?: () => void;
            } | {
                readonly _type?: "CustomBinarizationFilter";
                outputMode?: import("../core-types").OutputMode;
                denoise?: number;
                radius?: number;
                preset?: import("../core-types").BinarizationFilterPreset;
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
        }) => Promise<import("../core-types").ObjectId<"TiffGenerationContext">>;
        addPageToTiff: (tiffOperation: import("../core-types").ObjectId<"TiffGenerationContext">, image: import("../core-types").Image, binarization: import("../core-types").Binarization) => Promise<unknown>;
        completeTiff: (tiffOperation: import("../core-types").ObjectId<"TiffGenerationContext">) => Promise<Uint8Array>;
        createMRZScanner: (configuration: {
            frameAccumulationConfiguration?: {
                maximumNumberOfAccumulatedFrames?: number;
                minimumNumberOfRequiredFramesWithEqualScanningResult?: number;
                _marker?: () => void;
            };
            enableDetection?: boolean;
            incompleteResultHandling?: import("../core-types").MrzIncompleteResultHandling;
            _marker?: () => void;
        }) => Promise<import("../core-types").ObjectId<"MRZScannerContext">>;
        scanMRZ: <ImageType_2 extends import("../core-types").Image>(mrzScannerToken: import("../core-types").ObjectId<"MRZScannerContext">, image: ImageType_2) => Promise<import("../core-types").MrzScannerResult & {
            originalImage: ImageType_2;
        }>;
        releaseObject: <T>(objectToken: import("../core-types").ObjectId<T>) => Promise<void>;
        createOcrEngine: () => Promise<import("../core-types").ObjectId<"TLDROcrContext">>;
        performOcr: (tldrOcrToken: import("../core-types").ObjectId<"TLDROcrContext">, image: import("../core-types").Image) => Promise<import("../core-types").Page>;
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
        }) => Promise<import("../core-types").ObjectId<"TextPatternScanner">>;
        scanTextLine: <ImageType_3 extends import("../core-types").Image>(scannerToken: import("../core-types").ObjectId<"TextPatternScanner">, image: ImageType_3) => Promise<import("../core-types").TextPatternScannerResult & {
            originalImage: ImageType_3;
        }>;
        cleanTextLineScanningQueue: (scannerToken: import("../core-types").ObjectId<"TextPatternScanner">) => Promise<void>;
        createVinScanner: (configuration: {
            extractVINFromBarcode?: boolean;
            ocrResolutionLimit?: number;
            maximumNumberOfAccumulatedFrames?: number;
            minimumNumberOfRequiredFramesWithEqualScanningResult?: number;
            _marker?: () => void;
        }) => Promise<import("../core-types").ObjectId<"VinScanner">>;
        scanVin: <ImageType_4 extends import("../core-types").Image>(scannerToken: import("../core-types").ObjectId<"VinScanner">, image: ImageType_4) => Promise<import("../core-types").VinScannerResult & {
            originalImage: ImageType_4;
        }>;
        cleanVinScanningQueue: (scannerToken: import("../core-types").ObjectId<"VinScanner">) => Promise<void>;
        createDocumentQualityAnalyzer: (options: {
            qualityThresholds?: {
                readonly symbolQuality?: number;
                readonly symbolRatio?: number;
                _marker?: () => void;
            }[];
            qualityIndices?: import("../core-types").DocumentQuality[];
            detectOrientation?: boolean;
            maxImageSize?: number;
            minEstimatedNumberOfSymbolsForDocument?: number;
            minProcessedFraction?: number;
            maxProcessedFraction?: number;
            earlyStopIfNSymbolsFound?: number;
            tileSize?: number;
            _marker?: () => void;
        }) => Promise<import("../core-types").ObjectId<"DocumentQualityAnalyzer">>;
        documentQualityAnalyzerAnalyze: (dqaToken: import("../core-types").ObjectId<"DocumentQualityAnalyzer">, image: import("../core-types").Image) => Promise<import("../core-types").DocumentQualityAnalyzerResult>;
        imageApplyFilter: (image: import("../core-types").Image, filter: import("../core-types").DeepPartial<import("../core-types").ParametricFilter>) => Promise<import("../core-types").RawImage>;
        imageCrop: (image: import("../core-types").Image, polygon: [import("../core-types").Point, import("../core-types").Point, import("../core-types").Point, import("../core-types").Point]) => Promise<import("../core-types").RawImage>;
        imageResize: (image: import("../core-types").Image, destinationSize: number) => Promise<import("../core-types").RawImage>;
        imageRotate: (image: import("../core-types").Image, rotations: import("../core-types").ImageRotation) => Promise<import("../core-types").RawImage>;
        documentDataExtractorCreate: (parameters: {
            resultAccumulationConfig?: {
                confirmationMethod?: import("../core-types").ConfirmationMethod;
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
                expectedCountry?: import("../core-types").EuropeanHealthInsuranceCardIssuingCountry;
                _marker?: () => void;
            } | {
                readonly _type?: "MRZFallbackConfiguration";
                acceptedCountries?: string[];
                acceptedMRZTypes?: import("../core-types").MrzDocumentType[];
                _marker?: () => void;
            } | {
                readonly _type?: "DocumentDataExtractorCommonConfiguration";
                acceptedDocumentTypes?: string[];
                _marker?: () => void;
            })[];
            _marker?: () => void;
        }) => Promise<import("../core-types").ObjectId<"DocumentDataExtractor">>;
        documentDataExtractorExtract: <ImageType_5 extends import("../core-types").Image>(gdrToken: import("../core-types").ObjectId<"DocumentDataExtractor">, image: ImageType_5, parameters: {
            mode?: import("../core-types").DocumentDataExtractionMode;
            _marker?: () => void;
        }) => Promise<import("../core-types").DocumentDataExtractionResult & {
            originalImage: ImageType_5;
        }>;
        version: () => Promise<string>;
        __hasModuleFunction: (functionName: string) => Promise<any>;
        __callModuleFunction: (functionName: string, args?: any[]) => Promise<any>;
    };
    private getCoreForCommand;
    destroy(): void;
}
