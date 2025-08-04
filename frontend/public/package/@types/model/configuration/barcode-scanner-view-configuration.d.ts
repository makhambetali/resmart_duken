import { SelectionOverlayConfiguration } from "./selection-overlay-configuration";
import { BarcodeCountConfiguration } from "./barcode-count-configuration";
import { ViewFinderScannerConfiguration } from "./view-finder-scanner-configuration";
import { BarcodeScannerConfiguration, type DeepPartial } from "../../core-types";
import type { BarcodeScannerResultWithSize } from "../barcode/barcode-result";
export declare class BarcodeScannerViewConfiguration extends ViewFinderScannerConfiguration {
    constructor();
    /**
     * Capture delay in milliseconds after detecting barcodes. Defaults to 1000
     */
    captureDelay?: number;
    overlay?: SelectionOverlayConfiguration;
    /** {@displayType `Omit<DeepPartial<BarcodeScannerConfiguration>, "live">`} {@link BarcodeScannerConfiguration}*/
    detectionParameters?: Omit<DeepPartial<BarcodeScannerConfiguration>, "live">;
    /**
     * Special property to enable barcode count mode.
     * This is a type of a ready-to-use user interface scanning and counting found barcodes.
     * It can be configured via its 'style' (BarcodeCountStyleConfiguration) property.
     * It returns results normally via 'onBarcodesDetected' callback.
     * Please note that results are returned for each consecutive scan, not only after the last scan
     */
    scanAndCount?: BarcodeCountConfiguration;
    /**
     * Digital zoom level of the video stream. Defaults to 1.0.
     * Please note that this is not the same as the optical zoom of the camera.
     */
    zoom?: number;
    /**
     */
    onBarcodesDetected?: (e: BarcodeScannerResultWithSize) => void;
    /**
     * Note that the ImageData is only available at the point in time when _onDetectionFailed is invoked.
     * The underlying buffer will be reused in the next detection cycle and will not be available anymore.
     * @internal
     * */
    _onDetectionFailed?: (originalImageSize: ImageData) => void;
    /**
     * If set, limit the resolution of the image that is used for barcode recognition.
     * A lower value will result in faster processing times but may reduce recognition quality.
     */
    desiredRecognitionResolution?: number;
    static fromJson(json: any): BarcodeScannerViewConfiguration;
}
