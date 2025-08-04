/**
Determines the visibility mode for the document capturing user guidance labels.

- `ENABLED`:
   Enabled for both 'auto snapping' and 'manual snapping' modes.
- `AUTO_CAPTURE_ONLY`:
   Enabled only for the 'auto snapping' mode.
- `DISABLED`:
   Disabled for both 'auto snapping' and 'manual snapping' modes.
*/
export type UserGuidanceVisibility = "ENABLED" | "AUTO_CAPTURE_ONLY" | "DISABLED";
export declare const UserGuidanceVisibilityValues: UserGuidanceVisibility[];
