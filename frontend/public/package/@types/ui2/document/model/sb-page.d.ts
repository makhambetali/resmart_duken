import { Image } from "../../../core/worker/ScanbotSDK.Core";
import { ParametricFilter } from "../../../core/bridge/compiled/ParametricFilters";
import { Point } from "../../../utils/dto/Point";
import { SBPageData } from "./utils/sb-page-data";
import { RawImage } from "../../../core/bridge/common";
import { SBDocument } from "./sb-document";
export interface SBPageEditParams {
    rotations?: number;
    polygon?: Point[];
    filters?: [ParametricFilter];
}
export interface SBPageCropData {
    crop: Point[];
    rotations: number;
    image: Image;
}
/**
 * https://scanbotsdk.github.io/documentation/ios/documentation/scanbotsdk/sbsdkscannedpage/
 */
export declare class SBPage {
    private readonly document;
    private readonly data;
    get id(): number;
    getData(): SBPageData;
    /** @internal Use SBDocument.addPage instead.*/
    constructor(document: SBDocument, data: SBPageData);
    private static readonly ROTATIONS;
    private static readonly FULL_SIZE_POLYGON;
    private sdk;
    loadOriginalImage(): Promise<Image>;
    loadDocumentImage(): Promise<Image | null>;
    /** @internal */
    getPolygon(): Point[];
    /** @internal */
    cropData(): Promise<SBPageCropData>;
    private _finalImageUrl;
    /** @internal */
    finalRawImage(): Promise<RawImage>;
    /** @internal */
    finalImageUrl(): Promise<string>;
    /** @internal */
    invalidateImage(): Promise<void>;
}
