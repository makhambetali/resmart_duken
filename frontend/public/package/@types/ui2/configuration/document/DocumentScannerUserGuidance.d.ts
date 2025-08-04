import { BackgroundStyle } from "../common/Common";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { StyledText } from "../common/Common";
import { UserGuidanceVisibility } from "../document/DocumentScannerGuidanceVisibility";
/**
Configure the titles of the user guidance hints for different states.
*/
export declare class UserGuidanceStates extends PartiallyConstructible {
    /**
      The user guidance text displayed when no document is found.
      @defaultValue "?cameraUserGuidanceNoDocumentFound";
      */
    noDocumentFound: string;
    /**
      The user guidance text displayed when a landscape document is detected when the camera is in portrait mode (and vice versa).
      @defaultValue "?cameraUserGuidanceBadAspectRatio";
      */
    badAspectRatio: string;
    /**
      The user guidance text displayed when the document pitch/skew angle is unacceptable.
      @defaultValue "?cameraUserGuidanceBadAngles";
      */
    badAngles: string;
    /**
      The user guidance text displayed when the document is not centered in the finder view.
      @defaultValue "?cameraUserGuidanceTextHintOffCenter";
      */
    textHintOffCenter: string;
    /**
      The user guidance text displayed when the document is too far from camera.
      @defaultValue "?cameraUserGuidanceTooSmall";
      */
    tooSmall: string;
    /**
      The user guidance text displayed when the background is too noisy.
      @defaultValue "?cameraUserGuidanceTooNoisy";
      */
    tooNoisy: string;
    /**
      The user guidance text displayed when it is too dark to capture an adequate image.
      @defaultValue "?cameraUserGuidanceTooDark";
      */
    tooDark: string;
    /**
      The user guidance text displayed when the device is in energy saving mode. iOS only.
      @defaultValue "?cameraUserGuidanceEnergySaveMode";
      */
    energySaveMode: string;
    /**
      The user guidance text displayed when the document is ready to be captured in 'auto snapping' mode.
      @defaultValue "?cameraUserGuidanceReadyToCapture";
      */
    readyToCapture: string;
    /**
      The user guidance text displayed when the document is being captured and user needs to hold the device still.
      @defaultValue "?cameraUserGuidanceReadyToCapture";
      */
    capturing: string;
    /**
      The user guidance text displayed when the document is ready to be captured in 'manual snapping' mode.
      @defaultValue "?cameraUserGuidanceReadyToCaptureManual";
      */
    captureManual: string;
    /** @param source {@displayType `DeepPartial<UserGuidanceStates>`} */
    constructor(source?: DeepPartial<UserGuidanceStates>);
}
/**
Configuration of the hints guiding users through the scanning process.
*/
export declare class DocumentScannerUserGuidance extends PartiallyConstructible {
    /**
      Determines when the user guidance hints should be visible.
      @defaultValue "ENABLED";
      */
    visibility: UserGuidanceVisibility;
    /**
      Configure the text style for the user guidance hints.
      @defaultValue new StyledText({
          "text": "?cameraUserGuidanceStart",
          "color": "?sbColorOnPrimary"
      });
      */
    title: StyledText;
    /**
      Configure the background style for the user guidance hints.
      @defaultValue new BackgroundStyle({
          "strokeColor": "#00000000",
          "fillColor": "?sbColorSurfaceHigh"
      });
      */
    background: BackgroundStyle;
    /**
      Configure the titles of the user guidance hints for different states.
      @defaultValue new UserGuidanceStates({});
      */
    statesTitles: UserGuidanceStates;
    /** @param source {@displayType `DeepPartial<DocumentScannerUserGuidance>`} */
    constructor(source?: DeepPartial<DocumentScannerUserGuidance>);
}
