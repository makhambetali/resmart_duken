import { DeepPartial, PartiallyConstructible } from "../common";
/**
Status of the license plate scanner.

- `OKAY`:
   License is valid and accepted.
- `TRIAL`:
   No license set yet. The SDK is in trial mode.
- `FAILURE_NOT_SET`:
   No license set yet. The SDK's trial mode is over.
- `FAILURE_CORRUPTED`:
   No license active. The set license was unreadable or has an invalid format.
- `FAILURE_WRONG_OS`:
   No license active. The set license does not cover the current operating system.
- `FAILURE_APP_ID_MISMATCH`:
   No license active. The set license does not cover the current app's bundle identifier.
- `FAILURE_EXPIRED`:
   No license active. The set license is valid but it has expired.
*/
export type LicenseStatus = "OKAY" | "TRIAL" | "FAILURE_NOT_SET" | "FAILURE_CORRUPTED" | "FAILURE_WRONG_OS" | "FAILURE_APP_ID_MISMATCH" | "FAILURE_EXPIRED";
export declare const LicenseStatusValues: LicenseStatus[];
/**
Information about the SDK license.
*/
export declare class SdkLicenseInfo extends PartiallyConstructible {
    /**
    Status of the license
    */
    status: LicenseStatus;
    /**
    Message describing the license status
    */
    licenseStatusMessage: string;
    /**
    Expiration date of the license in ISO8601 date-time format. May be empty if no valid license is set or the trial license is used.
    */
    expirationDateString: string;
    /** @param source {@displayType `DeepPartial<SdkLicenseInfo>`} */
    constructor(source?: DeepPartial<SdkLicenseInfo>);
}
