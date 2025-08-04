import { ButtonConfiguration } from "../common/Common";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { IconStyle } from "../common/Common";
import { StyledText } from "../common/Common";
/**
Configuration of the camera permission request view.
*/
export declare class CameraPermissionScreen extends PartiallyConstructible {
    /**
      Background color of the camera permission request.
      @defaultValue "?sbColorSurface";
      */
    background: string;
    /**
      Background color of the icon used in the camera permission request.
      @defaultValue "?sbColorOutline";
      */
    iconBackground: string;
    /**
      Configuration of the icon used in the camera permission request.
      @defaultValue new IconStyle({
          "visible": true,
          "color": "?sbColorOnSurface"
      });
      */
    icon: IconStyle;
    /**
      Configuration of the camera permission request's close button.
      @defaultValue new ButtonConfiguration({
          "text": "Close",
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
      });
      */
    closeButton: ButtonConfiguration;
    /**
      Configuration of the camera permission request's title.
      @defaultValue new StyledText({
          "text": "Camera permission denied!",
          "color": "?sbColorOnSurface"
      });
      */
    enableCameraTitle: StyledText;
    /**
      Configuration of the camera permission request's explanatory text.
      @defaultValue new StyledText({
          "text": "Please allow the usage of the camera to start the scanning process.",
          "color": "?sbColorOnSurfaceVariant"
      });
      */
    enableCameraExplanation: StyledText;
    /** @param source {@displayType `DeepPartial<CameraPermissionScreen>`} */
    constructor(source?: DeepPartial<CameraPermissionScreen>);
}
