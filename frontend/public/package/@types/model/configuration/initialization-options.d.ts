import { CameraDetectionStrategy } from "../../utils/browser-cameras";
export interface InitializationOptions {
    /**
     * Scanbot Web SDK License key. Required
     */
    licenseKey: string;
    /**
     * Location of the Core WebAssembly Engine. Mandatory.
     */
    enginePath: string;
    /**
     * Determines whether the SDK should use multithreading. Defaults to true.
     * Multithreading will only affect supported Android devices and desktop browsers. Multithreading on
     * iOS is currently not supported.
     * On supported devices, multithreading will improve performance significantly.
     * Note that multithreading will only work on crossOriginIsolated sites. To enable this for your site, certain
     * HTTP headers need to be set. Please consult our documentation for more information. If multithreading was
     * requested but the site is not in a crossOriginIsolated context, the SDK will print a warning and fallback to
     * single-threaded operation.
     */
    allowThreads?: boolean;
    /**
     * Determines whether the SDK should log debug messages. Defaults to false.
     */
    verboseLogging?: boolean;
    /**
     * The requestSuffix is appended to the HTTP requests made by the SDK to load necessary WASM and JS files.
     * It is meant to avoid any caching issues that may arise when the SDK is updated.
     * Defaults to '?CURRENT_SDK_VERSION'.
     */
    requestSuffix?: string;
    /**
     * On devices with multiple cameras, it is difficult to choose which camera to use for scanning.
     * You can choose from several different automatic detection strategies described by
     * {@link CameraDetectionStrategy}.
     * Defaults to `FAST_DEFERRED`.
     */
    bestCameraDetectionStrategy?: CameraDetectionStrategy;
}
