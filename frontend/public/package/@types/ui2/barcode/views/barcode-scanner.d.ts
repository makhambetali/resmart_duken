import React from "react";
import { ArOverlayFindAndPickConfiguration, ArOverlayGeneralConfiguration } from "../../configuration/barcode/ArTrackingOverlayConfiguration";
import type { ActionBarConfiguration } from "../../configuration/common/ActionBarConfiguration";
import { BarcodeScannerViewConfiguration as BarcodeScannerViewConfig } from "../../../model/configuration/barcode-scanner-view-configuration";
import { ViewFinderPadding } from "../../../view/view-finder";
import BarcodePolygon from "../../../view/barcode-polygon/barocode-polygon";
import BarcodePolygonLabel from "../../../view/barcode-polygon/barcode-polygon-label";
import type { CameraConfiguration } from "../../configuration/common/CameraConfiguration";
import type { BarcodeItem } from "../../configuration";
export declare class Props {
    cameraConfiguration: CameraConfiguration;
    arOverlay: ArOverlayGeneralConfiguration | ArOverlayFindAndPickConfiguration;
    actionBarConfig: ActionBarConfiguration;
    actionBarBottomPadding: number;
    arOnBarcodeEnter: (code: BarcodeItem, polygon: BarcodePolygon, label: BarcodePolygonLabel) => void;
    arOnBarcodeClick: (barcode: BarcodeItem) => void;
    scanningPaused: boolean;
    barcodeScannerViewConfig: BarcodeScannerViewConfig;
    viewFinderPadding: ViewFinderPadding;
    containerId: string;
    onCameraPermissionDenied: () => void;
    setActionButtonsVisible: (visible: boolean) => void;
    onLicenseError?: () => void;
}
export declare function BarcodeScanner(props: Props): React.JSX.Element;
