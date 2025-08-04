import ScanbotSDK from '../scanbot-sdk';
import { Image, ObjectId, Page } from "../core-types";
import { ConsumeType } from "../consume-type";
export interface Rect {
    x: number;
    y: number;
    height: number;
    width: number;
}
export interface OcrData {
    text: string;
    confidence: number;
    boundingBox: Rect;
}
export default class OcrEngine {
    private _sdk;
    private _OcrEngineToken;
    /** @internal */
    constructor(_sdk: ScanbotSDK, _OcrEngineToken: ObjectId<"TLDROcrContext">);
    performOcr(image: Image, consumeImage?: ConsumeType): Promise<Page>;
    recognizeURL(imageURL: string): Promise<Page>;
    release(): Promise<void>;
}
