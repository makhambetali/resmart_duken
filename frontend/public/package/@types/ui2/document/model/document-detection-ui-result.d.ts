import type { CroppedDetectionResult } from "../../../core-types";
import type { PageImageSource } from "../../configuration/native/PageImageSource";
export type DocumentDetectionUIResult = {
    value: CroppedDetectionResult;
    source: PageImageSource;
};
export type RtuDocumentDetectionResultPromise = undefined | Promise<DocumentDetectionUIResult | null>;
export declare function createRtuDocumentDetectionResultPromise(croppedDetectionResult: Promise<CroppedDetectionResult>, source: PageImageSource): RtuDocumentDetectionResultPromise;
