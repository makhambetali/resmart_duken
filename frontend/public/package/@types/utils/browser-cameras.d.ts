import { CameraFacingMode, CameraInfo } from "../model/camera-info";
/**
 * The {@link BrowserCameras} can provide information about the browser's cameras in two different ways.
 *
 *  - `SLOW`:
 *       Slow but accurate.
 *       This mode discovers camera information by starting a camera stream for each of the cameras that the
 *       browsers offers access to. This is done because the browser offers the most accurate information about
 *       a camera only when a stream of that camera is running.
 *       Using this data, {@link BrowserCameras.getMainCamera} can make the best possible predictions of which
 *       camera is the "main" one.
 *       On most devices, this method of starting all camera streams will cause the "camera is running" indicator
 *       light or notification to be displayed. Other effects like clicking camera lenses might also be observable.
 *       This process can be slow. On some devices, this mode has a running time of several seconds.
 *
 *  - `FAST`:
 *       Fast but less accurate.
 *       This mode discovers camera information by guess-parsing the browser-provided camera labels.
 *       Using this data, {@link BrowserCameras.getMainCamera} can make good predictions of which camera is the "main" one.
 *       However, this technique is limited and cannot provide information about the torch control capabilities.
 *       Additionally, information about the camera resolution might be missing.
 *       On most devices, this mode has a runtime of less than 500ms.
 */
export type DiscoverCameraMode = 'FAST' | 'SLOW';
/**
 * Describes the strategy used to obtain information about the browser's cameras in {@link BrowserCameras}.
 * This information is used to automatically choose the best (=main) camera on devices with multiple cameras.
 * - If `SLOW_DEFERRED` or `FAST_DEFERRED` is used, the camera information is obtained when a scanner is opened for the
 *   first time. Because querying the camera information takes some time, this might cause a small delay when the
 *   scanner is opened.
 * - If `SLOW` or `FAST` is used, the camera information is being gathered in the background as soon as you start the
 *   SDK's initialization. When you open a scanner a bit later, the necessary camera information might already be
 *   gathered and the scanner opens a bit faster than with the `*_DEFERRED` modes.
 *   Please note that this might trigger the user's camera permission dialog when you initialize the SDK.
 * - If `NONE` is used, no additional camera information is gathered. On multi-camera devices, the choice of the
 *   camera is left to the browser. On a few devices, the browser chooses a camera with a 'fish-eye' or telephoto lens
 *   which is usually undesirable for scans.
 *
 * For the difference between `SLOW` and `FAST` see {@link DiscoverCameraMode}.
 *
 * @default `SLOW_DEFERRED`
 *
 * @see {@link BrowserCameras.load}
 */
export type CameraDetectionStrategy = 'SLOW' | 'FAST' | 'SLOW_DEFERRED' | 'FAST_DEFERRED' | 'NONE';
/**
 * This class has two purposes:
 *   1.  It provides a list of the cameras that the browser offers access to.
 *   2.  It tries to answer the difficult question of "which of these cameras is the main one".
 */
export declare class BrowserCameras {
    private static _INSTANCE?;
    static get INSTANCE(): BrowserCameras;
    /**
     * @internal
     * Most likely, you want to use {@link INSTANCE} instead.
     * */
    constructor();
    /** Call {@link load} to populate this list. */
    listOfCameras: CameraInfo[];
    private loadSlowResult?;
    private loadFastResult?;
    private strategy;
    /** @internal */
    initialize(strategy?: CameraDetectionStrategy): void;
    /**
     * This method populates the internally cached list of cameras.
     * Results to this method are cached and subsequent calls will faster.
     * See {@link DiscoverCameraMode} for a detailed description of this function's behavior.
     * If no value for `mode` is given, the global default set during SDK initialization is used.
     * @returns The gathered camera information
     */
    load(mode?: DiscoverCameraMode): Promise<CameraInfo[]>;
    private loadSlow;
    private loadFast;
    /**
     * You need to call {@link load} before calling this function to populate the list of cameras.
     * @return The "main" camera of the device. Typically, this is the camera with the highest resolution. Typically, it
     *         has a "regular" lens (i.e. not fish-eye or telephoto lens).
     */
    getMainCamera(facingMode: 'front' | 'back'): CameraInfo | null;
    private getVideoDevices;
    private stopStream;
    private static guessparseCameraLabelFacingMode;
    private static guessparseCameraLabelMaxNumPixels;
    private assertPermissionsAreOk;
    /** @internal */
    static getCameraInfoFromStream(stream: MediaStream): CameraInfo;
    private getUserMedia;
}
export declare function parseFacingMode(browserFacingMode?: string): CameraFacingMode;
export declare function getMaxNumPixelsFromCapabilities(capabilities?: MediaTrackCapabilities): number | undefined;
