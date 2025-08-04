import ScanbotSDK from '../scanbot-sdk';
import { ObjectId, Image, TextPatternScannerResult } from '../core-types';
import { ConsumeType } from "../consume-type";
export default class TextPatternScanner {
    private _sdk;
    private _textPatternScannerToken;
    constructor(_sdk: ScanbotSDK, _textPatternScannerToken: Promise<ObjectId<"TextPatternScanner">>);
    recognize<ImageType extends Image>(image: ImageType, consumeImage?: ConsumeType): Promise<TextPatternScannerResult & {
        originalImage: ImageType;
    }>;
    cleanRecognitionQueue(): Promise<void>;
    recognizeURL(imageURL: string): Promise<TextPatternScannerResult>;
    release(): Promise<void>;
}
