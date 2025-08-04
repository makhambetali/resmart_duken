/**
The source of an image.

- `UNDEFINED`:
   The source of the image is not known.
- `MANUAL_SNAP`:
   The image was captured manually.
- `AUTO_SNAP`:
   The image was captured automatically.
- `IMPORTED`:
   The image originates from the photo/media gallery.
*/
export type PageImageSource = "UNDEFINED" | "MANUAL_SNAP" | "AUTO_SNAP" | "IMPORTED";
export declare const PageImageSourceValues: PageImageSource[];
