import { ActionBarConfiguration } from "../common/ActionBarConfiguration";
import { BarcodeScannerConfiguration as BarcodeScannerConfigurationBarcodeScannerConfiguration } from "../barcode/BarcodeScannerConfiguration";
import { BarcodeTextLocalization } from "../barcode/BarcodeTextLocalization";
import { BarcodeUseCase } from "../barcode/BarcodeUseCase";
import { CameraConfiguration } from "../common/CameraConfiguration";
import { CameraPermissionScreen } from "../common/CameraPermission";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { Palette } from "../common/Common";
import { Sound } from "../common/Common";
import { Timeouts } from "../common/Common";
import { TopBarConfiguration } from "../common/TopBarConfiguration";
import { UserGuidanceConfiguration } from "../common/UserGuidanceConfiguration";
import { Vibration } from "../common/Common";
import { ViewFinderConfiguration } from "../common/ViewFinderConfiguration";
/**
Configuration of the barcode scanner screen.
*/
export declare class BarcodeScannerScreenConfiguration extends PartiallyConstructible {
    /**
    Version number of the configuration object.
    @defaultValue "1.0";
    */
    readonly version: string;
    /**
    The configuration object should be applied for this screen.
    @defaultValue "BarcodeScanner";
    */
    readonly screen: string;
    /**
    Define the screen's base color values from which other colors are derived.
    @defaultValue new Palette({
        "sbColorPrimary": "#C8193C",
        "sbColorPrimaryDisabled": "#F5F5F5",
        "sbColorNegative": "#FF3737",
        "sbColorPositive": "#4EFFB4",
        "sbColorWarning": "#FFCE5C",
        "sbColorSecondary": "#FFEDEE",
        "sbColorSecondaryDisabled": "#F5F5F5",
        "sbColorOnPrimary": "#FFFFFF",
        "sbColorOnSecondary": "#C8193C",
        "sbColorSurface": "#FFFFFF",
        "sbColorOutline": "#EFEFEF",
        "sbColorOnSurfaceVariant": "#707070",
        "sbColorOnSurface": "#000000",
        "sbColorSurfaceLow": "#00000026",
        "sbColorSurfaceHigh": "#0000007A",
        "sbColorModalOverlay": "#000000A3"
    });
    */
    palette: Palette;
    /**
    Configuration of the all strings for barcode scanner.
    @defaultValue new BarcodeTextLocalization({});
    */
    localization: BarcodeTextLocalization;
    /**
    Color of the screen's background.
    @defaultValue "?sbColorSurfaceLow";
    */
    backgroundColor: string;
    /**
    Configuration of the top bar.
    @defaultValue new TopBarConfiguration({
        "title": new StyledText({
            "text": "?topBarTitle",
            "color": "?sbColorOnPrimary"
        }),
        "mode": "SOLID",
        "backgroundColor": "?sbColorPrimary",
        "cancelButton": new ButtonConfiguration({
            "visible": true,
            "text": "?topBarCancelButton",
            "background": new BackgroundStyle({
                "strokeColor": "#00000000",
                "fillColor": "#00000000",
                "strokeWidth": 0.0
            }),
            "foreground": new ForegroundStyle({
                "iconVisible": true,
                "color": "?sbColorOnPrimary",
                "useShadow": false
            })
        })
    });
    */
    topBar: TopBarConfiguration;
    /**
    Configuration of the action bar.
    @defaultValue new ActionBarConfiguration({
        "flashButton": new RoundButton({
            "visible": true,
            "backgroundColor": "?sbColorSurfaceHigh",
            "foregroundColor": "?sbColorOnPrimary",
            "activeBackgroundColor": "?sbColorWarning",
            "activeForegroundColor": "#1C1B1F"
        }),
        "zoomButton": new RoundButton({
            "visible": true,
            "backgroundColor": "?sbColorSurfaceHigh",
            "foregroundColor": "?sbColorOnPrimary",
            "activeBackgroundColor": "?sbColorSurfaceHigh",
            "activeForegroundColor": "?sbColorOnPrimary"
        }),
        "flipCameraButton": new RoundButton({
            "visible": true,
            "backgroundColor": "?sbColorSurfaceHigh",
            "foregroundColor": "?sbColorOnPrimary",
            "activeBackgroundColor": "?sbColorSurfaceHigh",
            "activeForegroundColor": "?sbColorOnPrimary"
        })
    });
    */
    actionBar: ActionBarConfiguration;
    /**
    Configuration of the view finder.
    @defaultValue new ViewFinderConfiguration({
        "visible": true,
        "style": new FinderCorneredStyle({
            "strokeColor": "?sbColorSurface",
            "strokeWidth": 2.0,
            "cornerRadius": 10.0
        }),
        "overlayColor": "?sbColorSurfaceLow",
        "aspectRatio": new AspectRatio({
            "width": 1.0,
            "height": 1.0
        })
    });
    */
    viewFinder: ViewFinderConfiguration;
    /**
    Configuration of the text hint guiding users to move the view finder over a barcode.
    @defaultValue new UserGuidanceConfiguration({
        "visible": true,
        "title": new StyledText({
            "text": "?userGuidance",
            "color": "?sbColorOnPrimary"
        }),
        "background": new BackgroundStyle({
            "strokeColor": "#00000000",
            "fillColor": "?sbColorSurfaceLow",
            "strokeWidth": 0.0
        })
    });
    */
    userGuidance: UserGuidanceConfiguration;
    /**
    Configuration of the dialog for requesting camera permissions.
    @defaultValue new CameraPermissionScreen({
        "background": "?sbColorSurface",
        "iconBackground": "?sbColorOutline",
        "icon": new IconStyle({
            "visible": true,
            "color": "?sbColorOnSurface"
        }),
        "closeButton": new ButtonConfiguration({
            "visible": true,
            "text": "?cameraPermissionCloseButton",
            "background": new BackgroundStyle({
                "strokeColor": "#00000000",
                "fillColor": "#00000000",
                "strokeWidth": 0.0
            }),
            "foreground": new ForegroundStyle({
                "iconVisible": false,
                "color": "?sbColorPrimary",
                "useShadow": false
            })
        }),
        "enableCameraTitle": new StyledText({
            "text": "?cameraPermissionEnableCameraTitle",
            "color": "?sbColorOnSurface"
        }),
        "enableCameraExplanation": new StyledText({
            "text": "?cameraPermissionEnableCameraExplanation",
            "color": "?sbColorOnSurfaceVariant"
        })
    });
    */
    cameraPermission: CameraPermissionScreen;
    /**
    Configuration of the camera behavior.
    @defaultValue new CameraConfiguration({});
    */
    cameraConfiguration: CameraConfiguration;
    /**
    Configuration of the scanning behavior.
    @defaultValue new barcode / BarcodeScannerConfigurationBarcodeScannerConfiguration({});
    */
    scannerConfiguration: BarcodeScannerConfigurationBarcodeScannerConfiguration;
    /**
    Configuration of the barcode scanner screen's behavior.
    @defaultValue new SingleScanningMode({});
    */
    useCase: BarcodeUseCase;
    /**
    Configuration of the scan confirmation sound.
    @defaultValue new Sound({
        "successBeepEnabled": true,
        "soundType": "MODERN_BEEP"
    });
    */
    sound: Sound;
    /**
    Configuration of the scan scan confirmation vibration.
    @defaultValue new Vibration({
        "enabled": true
    });
    */
    vibration: Vibration;
    /**
    Configuration of timeouts.
    @defaultValue new Timeouts({
        "autoCancelTimeout": 0,
        "initialScanDelay": 0
    });
    */
    timeouts: Timeouts;
    /** @param source {@displayType `DeepPartial<BarcodeScannerScreenConfiguration>`} */
    constructor(source?: DeepPartial<BarcodeScannerScreenConfiguration>);
}
