import { LicenseInfo } from "../response/license-info";
export declare class LicenseError extends Error {
    constructor(licenseInfo: LicenseInfo);
}
