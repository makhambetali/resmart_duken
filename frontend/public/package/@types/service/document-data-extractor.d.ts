import ScanbotSDK from '../scanbot-sdk';
import { ObjectId, Image, DeepPartial, DocumentDataFrameExtractionParameters } from "../core-types";
import { ConsumeType } from "../consume-type";
export declare class DocumentDataExtractor {
    private _sdk;
    private _recognizer;
    /** @internal */
    constructor(_sdk: ScanbotSDK, _recognizer: ObjectId<"DocumentDataExtractor">);
    recognize<ImageType extends Image>(image: ImageType, parameters: DeepPartial<DocumentDataFrameExtractionParameters>, consumeImage?: ConsumeType): Promise<import("../core-types").DocumentDataExtractionResult & {
        originalImage: ImageType;
    }>;
    release(): Promise<void>;
}
