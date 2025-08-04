import ScanbotSDK from '../scanbot-sdk';
import { DocumentQualityAnalyzerResult, Image, ObjectId } from '../core-types';
import { ConsumeType } from "../consume-type";
export default class DocumentQualityAnalyzer {
    private _sdk;
    private _token;
    /** @internal */
    constructor(_sdk: ScanbotSDK, _token: ObjectId<"DocumentQualityAnalyzer">);
    analyze(image: Image, consumeImage?: ConsumeType): Promise<DocumentQualityAnalyzerResult>;
    release(): Promise<void>;
}
