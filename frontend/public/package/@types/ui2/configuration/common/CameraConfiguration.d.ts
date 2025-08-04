import { DeepPartial, PartiallyConstructible } from "../utils";
/**
Ideal resolution of the camera preview.
*/
export declare class Resolution extends PartiallyConstructible {
    /**
      Width of the resolution.
      */
    width: number;
    /**
      Height of the resolution.
      */
    height: number;
    /** @param source {@displayType `DeepPartial<Resolution>`} */
    constructor(source?: DeepPartial<Resolution>);
}
/**
Determine which camera module to use on start-up.

- `FRONT`:
   Use the front camera.
- `BACK`:
   Use the default back camera.
*/
export type CameraModule = "FRONT" | "BACK";
export declare const CameraModuleValues: CameraModule[];
/**
Configuration of the camera settings to be used while scanning.
*/
export declare class CameraConfiguration extends PartiallyConstructible {
    /**
      Which camera module to use on start-up.
      @defaultValue "BACK";
      */
    cameraModule: CameraModule;
    /**
      The number of zoom steps available to the user.
      @defaultValue [1.0, 2.0, 5.0];
      */
    zoomSteps: number[];
    /**
      The default zoom factor on start-up.
      @defaultValue 1.0;
      */
    defaultZoomFactor: number;
    /**
      Whether the flash is enabled by default.
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
    /** @param source {@displayType `DeepPartial<CameraConfiguration>`} */
    constructor(source?: DeepPartial<CameraConfiguration>);
}
