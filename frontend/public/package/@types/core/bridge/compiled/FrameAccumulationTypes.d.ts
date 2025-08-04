import { DeepPartial, PartiallyConstructible } from "../common";
/**
Method used to confirm a result.

- `EXACT`:
   Require seeing the same result multiple times to confirm it.
   E.g. if the seen values are "John B. Doe", "John B.", "B. Doe", "John B. Doe" then the confirmation count for
   the value "John B. Doe" is 2 and for the rest it's 1.
   A field's value is considered CONFIRMED if its confirmation count is greater or equal to minConfirmations.
- `INTERPOLATE`:
   Interpolate between seen values to generate the most likely true value.
   E.g. if the seen values are "John X. Doe", "John B.", "B. Doe" then the most likely true value
   can be interpolated to be "John B. Doe".
   The interpolated value is considered CONFIRMED if each character
   in it has been seen at least minConfirmations times.
*/
export type ConfirmationMethod = "EXACT" | "INTERPOLATE";
export declare const ConfirmationMethodValues: ConfirmationMethod[];
/**
Configuration for how to accumulate results.
*/
export declare class ResultAccumulationConfiguration extends PartiallyConstructible {
    /**
    Method used to confirm a result.
    @defaultValue "EXACT";
    */
    confirmationMethod: ConfirmationMethod;
    /**
    Number of confirmations required to consider a result confirmed (see ConfirmationMethod).
    Requiring more confirmations will increase the reliability of the result but also the time to
    gather enough confirmations.
    @defaultValue 3;
    */
    minConfirmations: number;
    /**
    Minimum confidence required to consider a field confirmed.
    @defaultValue 0.8;
    */
    minConfidenceForStableField: number;
    /**
    Will auto-clear the cache if this number of frames have been a different document type or empty.
    @defaultValue 4;
    */
    autoClearThreshold: number;
    /** @param source {@displayType `DeepPartial<ResultAccumulationConfiguration>`} */
    constructor(source?: DeepPartial<ResultAccumulationConfiguration>);
}
/**
Configure the frame accumulation process.
*/
export declare class AccumulatedResultsVerifierConfiguration extends PartiallyConstructible {
    /**
    Maximum number of accumulated frames to inspect to verify a scan result.
    @defaultValue 3;
    */
    maximumNumberOfAccumulatedFrames: number;
    /**
    Minimum number of accumulated frames that have an equal result in order for the result to be considered verified.
    @defaultValue 2;
    */
    minimumNumberOfRequiredFramesWithEqualScanningResult: number;
    /** @param source {@displayType `DeepPartial<AccumulatedResultsVerifierConfiguration>`} */
    constructor(source?: DeepPartial<AccumulatedResultsVerifierConfiguration>);
}
