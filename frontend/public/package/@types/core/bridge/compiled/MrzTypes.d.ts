import { AccumulatedResultsVerifierConfiguration } from "./FrameAccumulationTypes";
import { DeepPartial, PartiallyConstructible } from "../common";
import { GenericDocument } from "./GenericDocument";
/**
Type of document containing the MRZ.

- `UNKNOWN`:
   Undefined.
- `CREW_MEMBER_CERTIFICATE`:
   Crew member certificate.
- `ID_CARD`:
   ID card.
- `PASSPORT`:
   Passport.
- `VISA`:
   Visa card.
- `CH_DRIVING_LICENSE`:
   Swiss driver license.
*/
export type MrzDocumentType = "UNKNOWN" | "CREW_MEMBER_CERTIFICATE" | "ID_CARD" | "PASSPORT" | "VISA" | "CH_DRIVING_LICENSE";
export declare const MrzDocumentTypeValues: MrzDocumentType[];
/**
Container for result of MRZ scanning attempt.
*/
export declare class MrzScannerResult extends PartiallyConstructible {
    /**
    Scanning successful.
    @defaultValue false;
    */
    readonly success: boolean;
    /**
    Raw string value of MRZ
    */
    readonly rawMRZ: string;
    /**
    Generic document containing MRZ data
    */
    readonly document: GenericDocument | null;
    /** @param source {@displayType `DeepPartial<MrzScannerResult>`} */
    constructor(source?: DeepPartial<MrzScannerResult>);
}
/**
Defines how to handle incomplete MRZ results (e.g. caused by failed validation).

- `ACCEPT`:
   Accept incomplete results. Fields failing validation will have a validation status of INVALID. Typically used for single-shot scanning.
- `REJECT`:
   Reject incomplete results. If any fields are missing or fail validation, the result document will be empty. Typically used for live scanning.
*/
export type MrzIncompleteResultHandling = "ACCEPT" | "REJECT";
export declare const MrzIncompleteResultHandlingValues: MrzIncompleteResultHandling[];
/**
Configuration for MRZ scanner.
*/
export declare class MrzScannerConfiguration extends PartiallyConstructible {
    /**
    Configure the frame accumulation process.
    @defaultValue new AccumulatedResultsVerifierConfiguration({});
    */
    frameAccumulationConfiguration: AccumulatedResultsVerifierConfiguration;
    /**
    Enable MRZ detection. If disabled, the scanner skips the detection step and assumes that the input image is a crop of the MRZ area.
    @defaultValue true;
    */
    enableDetection: boolean;
    /**
    Defines how to handle incomplete MRZ results (e.g. caused by failed validation).
    @defaultValue "ACCEPT";
    */
    incompleteResultHandling: MrzIncompleteResultHandling;
    /** @param source {@displayType `DeepPartial<MrzScannerConfiguration>`} */
    constructor(source?: DeepPartial<MrzScannerConfiguration>);
}
