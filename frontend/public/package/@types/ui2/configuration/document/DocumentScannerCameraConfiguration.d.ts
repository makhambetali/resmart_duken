import { AspectRatio } from "../Geometry";
import { CameraModule } from "../common/CameraConfiguration";
import { DeepPartial, PartiallyConstructible } from "../utils";
import { Resolution } from "../common/CameraConfiguration";
/**
Configuration of the camera behavior.
*/
export declare class DocumentScannerCameraConfiguration extends PartiallyConstructible {
    /**
      Determines which camera module to use on start-up.
      @defaultValue "BACK";
      */
    cameraModule: CameraModule;
    /**
      Determines whether the document should be cropped automatically after a manual snap or not.
      @defaultValue true;
      */
    autoCropOnManualSnap: boolean;
    /**
      Determines whether the flashlight is enabled or not on start-up.
      @defaultValue false;
      */
    flashEnabled: boolean;
    /**
      The ideal resolution for the camera preview. Actual resolution may vary depending on browser and device capabilities.
      @defaultValue new Resolution({
          "width": 1920,
          "height": 1080
      });
      */
    idealPreviewResolution: Resolution;
    /**
      The minimum pitch/skew angle of the document to be accepted. The value must be between 0.0 and 1.0.
      @defaultValue 0.75;
      */
    acceptedAngleScore: number;
    /**
      The minimum size of the document in relation to the screen preview to be accepted. The value must be between 0.0 and 1.0.
      @defaultValue 0.75;
      */
    acceptedSizeScore: number;
    /**
      Controls the auto snapping speed. The sensitivity must be between 0.0 and 1.0. A value of 1.0 triggers auto snapping immediately, while a value of 0.0 delays the auto snapping by 3 seconds. The default value is 0.66 (2 seconds).
      @defaultValue 0.66;
      */
    autoSnappingSensitivity: number;
    /**
      After a page has been snapped, the delay in milliseconds before auto snapping resumes for the next page.
      @defaultValue 200;
      */
    autoSnappingDelay: number;
    /**
      The minimum brightness value to accept a detected document.
      @defaultValue 50;
      */
    acceptedBrightnessThreshold: number;
    /**
      Determines if auto snapping is enabled or not.
      @defaultValue true;
      */
    autoSnappingEnabled: boolean;
    /**
      The required aspect ratios for the document to be accepted.
      @defaultValue [];
      */
    requiredAspectRatios: AspectRatio[];
    /**
      Determines whether a landscape document will be detected when the camera is in portrait mode (and vice versa) or not. This parameter will be ignored if required aspect ratios have been explicitly defined.
      @defaultValue true;
      */
    ignoreBadAspectRatio: boolean;
    /** @param source {@displayType `DeepPartial<DocumentScannerCameraConfiguration>`} */
    constructor(source?: DeepPartial<DocumentScannerCameraConfiguration>);
}
