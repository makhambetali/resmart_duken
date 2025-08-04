import ScanbotSDK from '../scanbot-sdk';
import { ObjectId, Image } from '../core-types';
import { ConsumeType } from "../consume-type";
export default class VinScanner {
    private _sdk;
    private _token;
    constructor(_sdk: ScanbotSDK, _token: Promise<ObjectId<"VinScanner">>);
    recognize<ImageType extends Image>(image: ImageType, consumeImage?: ConsumeType): Promise<import("../core-types").VinScannerResult & {
        originalImage: ImageType;
    }>;
    cleanRecognitionQueue(): Promise<void>;
    recognizeURL(imageURL: string): Promise<import("../core-types").VinScannerResult & {
        originalImage: ImageData;
    }>;
    release(): Promise<void>;
}
