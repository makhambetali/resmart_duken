/**
 * ConsumeImage describes how a SDK method should handle image data.
 *
 * - `CONSUME_IMAGE` - This will use less memory but the caller can no longer access the original image data after the call to the SDK function.
 *                     Internally, the image data is transferred to a web worker, see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects
 * - `COPY_IMAGE`    - For processing the image, a copy is made. The caller can still access the original image data. This approach uses more memory.
 */
export type ConsumeType = 'CONSUME_IMAGE' | 'COPY_IMAGE';
