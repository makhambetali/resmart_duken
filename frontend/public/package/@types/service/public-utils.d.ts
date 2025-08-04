/**
 * Utils with a public API. Initialized in ScanbotSDK entry point
 */
export declare class PublicUtils {
    saveImageAsJpeg(data: Uint8Array, name?: string): void;
    isCameraSupported(): boolean;
    flash(): void;
    private findFlashElement;
    private animateFlashOpacity;
    private getOrCreateElement;
    private createElement;
    cssToString(input: any): string;
    private getElementByClassName;
}
