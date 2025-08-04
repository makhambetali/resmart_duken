import ScanbotSDK from '../scanbot-sdk';
import type { ObjectId, Image, MrzScannerResult } from "../core-types";
import { ConsumeType } from "../consume-type";
export default class SimpleMrzRecognizer {
    private _sdk;
    private _mrzRecognizerToken;
    constructor(_sdk: ScanbotSDK, _mrzRecognizerToken: Promise<ObjectId<"MRZScannerContext">>);
    recognize<ImageType extends Image>(image: ImageType, consumeImage?: ConsumeType): Promise<MrzScannerResult & {
        originalImage: ImageType;
    }>;
    recognizeURL(imageURL: string): Promise<MrzScannerResult | undefined>;
    release(): Promise<void>;
}
