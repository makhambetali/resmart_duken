import ScanbotSDK from '../scanbot-sdk';
import type { ObjectId, Image, Binarization } from "../core-types";
import { ConsumeType } from "../consume-type";
import { SBDocument } from "../ui2/document/model/sb-document";
export interface TiffPageOptions {
    binarize?: Binarization;
    consumeImage?: ConsumeType;
}
export declare class TiffGenerator {
    private _sdk;
    private _tiffOperation;
    /** @internal */
    constructor(_sdk: ScanbotSDK, _tiffOperation: ObjectId<"TiffGenerationContext">);
    /**
     * @param options.consumeImage - default: 'COPY_IMAGE'
     * @param options.binarize - default: 'IF_BINARIZATION_FILTER_SET'
     **/
    addPage(image: Image, options?: TiffPageOptions): Promise<void>;
    addPages(document: SBDocument, options?: Omit<TiffPageOptions, "consumeImage">): Promise<void>;
    complete(): Promise<ArrayBuffer>;
}
