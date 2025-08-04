import React from "react";
import { BarcodeScannerUiResult, BarcodeScannerScreenConfiguration } from "../../configuration";
import { IBarcodeMapper } from "../utils/barcode-mapper/i-barcode-mapper";
declare class Props {
    configuration: BarcodeScannerScreenConfiguration;
    onCameraPermissionDenied: () => void;
    onSubmit: (barcodeScannerResult: BarcodeScannerUiResult) => void;
    onError: (error?: Error) => void;
    scanningEnabled: React.MutableRefObject<boolean>;
    barcodeMapper: IBarcodeMapper;
}
export declare function MultipleScanningModeController(props: Props): React.JSX.Element;
export {};
