export declare class MediaError extends Error {
    static readonly PERMISSION_STATE: {
        GRANTED: string;
        DENIED: string;
        PROMPT: string;
        UNKNOWN: string;
    };
    static readonly MESSAGE: {
        DEVICES_UNDEFINED: string;
        DEVICE_NOT_FOUND: string;
        ENUMERATE_FAILED: string;
        PERMISSION_DENIED: string;
        UNKNOWN: string;
    };
    name: string;
    webApiError?: string;
    private constructor();
    static mediaDevicesUndefined(): MediaError;
    static enumerateDevicesFailed(): MediaError;
    static mediaDeviceNotFound(webApiError?: string): MediaError;
    static permissionDenied(webApiError?: string): MediaError;
    static unknown(webApiError?: string): MediaError;
    private static permissionState;
    static tryCheckPermission(): Promise<void>;
    static hasDeniedPermission(): boolean;
    static hasCheckedPermission(): boolean;
    static createFromDOMException(err: DOMException | unknown): MediaError;
}
