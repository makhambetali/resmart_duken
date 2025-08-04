import React from "react";
import { BarcodeScannerScreenConfiguration, BarcodeScannerUiResult } from "../../configuration";
import { IBarcodeMapper } from "../utils/barcode-mapper/i-barcode-mapper";
declare class Props {
    configuration: BarcodeScannerScreenConfiguration;
    onClose: () => void;
    onSubmit: (barcodeScannerUIResult: BarcodeScannerUiResult) => void;
    onError: (error?: Error) => void;
    onCameraPermissionDenied: () => void;
    scanningEnabled: React.MutableRefObject<boolean>;
    barcodeMapper: IBarcodeMapper;
}
export declare function SingleScanningModeController(props: Props): React.JSX.Element;
export {};
