import { Size } from "./dto/Size";
import { Frame } from "./dto/Frame";
import { ImageDataWrapper } from "../model/image-data-wrapper";
export declare class ImageUtils {
    static toDataUrl(buffer: ArrayBuffer): Promise<string>;
    static getObjectFitSize(container: Size, size: Size, contains?: boolean): Frame;
    static loadFromUrl(imageURL: string): Promise<ImageData>;
    static saveImageData(data: ImageData): void;
    static createImageDataCanvas(data: ImageData): HTMLCanvasElement;
    static saveBlob(blob: Blob, name: string): void;
    static convertImageDataWrapperToImageData(imageDataWrapper: ImageDataWrapper): ImageData;
    static wrapperToBase64(wrapper: ImageDataWrapper): string;
    static toBase64(data: Uint8Array, stripIdentifier?: boolean): Promise<string>;
    static imageUrlToImageData(imageUrl: string): Promise<ImageData>;
}
