import { DeepPartial, PartiallyConstructible } from "../common";
import { EuropeanHealthInsuranceCardIssuingCountry } from "./DocumentDataExtractorConfigurationTypes";
/**
The result of the health insurance card recognition.
*/
export declare class EuropeanHealthInsuranceCardRecognitionResult extends PartiallyConstructible {
    /**
    Health insurance card fields
    */
    readonly fields: EuropeanHealthInsuranceCardRecognitionResult.Field[];
    /**
    Recognition status.
    @defaultValue "FAILED_DETECTION";
    */
    readonly status: EuropeanHealthInsuranceCardRecognitionResult.RecognitionStatus;
    /** @param source {@displayType `DeepPartial<EuropeanHealthInsuranceCardRecognitionResult>`} */
    constructor(source?: DeepPartial<EuropeanHealthInsuranceCardRecognitionResult>);
}
export declare namespace EuropeanHealthInsuranceCardRecognitionResult {
    /**
    Card recognition status.

    - `SUCCESS`:
       Detection successful. The fields array is filled with all of the extracted data. All validatable fields have passed validation.
    - `FAILED_DETECTION`:
       No document found or the document doesn't look like the back of an EHIC.
    - `INCOMPLETE_VALIDATION`:
       A potential EHIC was found but one or more fields failed validation.
    */
    type RecognitionStatus = "SUCCESS" | "FAILED_DETECTION" | "INCOMPLETE_VALIDATION";
    const RecognitionStatusValues: RecognitionStatus[];
    /**
    Health insurance card field.
    */
    class Field extends PartiallyConstructible {
        /**
        Health insurance card field type
        */
        readonly type: EuropeanHealthInsuranceCardRecognitionResult.Field.FieldType;
        /**
        Recognized value
        */
        readonly value: string;
        /**
        Recognition confidence
        */
        readonly confidence: number;
        /**
        Field validation status.
        @defaultValue "NOT_VALIDATED";
        */
        readonly validationStatus: EuropeanHealthInsuranceCardRecognitionResult.Field.ValidationStatus;
        /** @param source {@displayType `DeepPartial<Field>`} */
        constructor(source?: DeepPartial<Field>);
    }
    namespace Field {
        /**
        Health insurance card field validation status.

        - `NOT_VALIDATED`:
           Field shouldn't be validated.
        - `FAILURE`:
           Field is not valid.
        - `SUCCESS`:
           Field is valid.
        - `CONFIRMED`:
           Field is valid and confirmed across multiple frames.
        */
        type ValidationStatus = "NOT_VALIDATED" | "FAILURE" | "SUCCESS" | "CONFIRMED";
        const ValidationStatusValues: ValidationStatus[];
        /**
        Health insurance card field type.

        - `SURNAME`:
           Surname.
        - `GIVEN_NAME`:
           Given name.
        - `DATE_OF_BIRTH`:
           Date of birth.
        - `PERSONAL_IDENTIFICATION_NUMBER`:
           Personal identification number.
        - `INSTITUTION_NUMBER`:
           Institution number.
        - `INSTITUTION_NAME`:
           Institution name.
        - `CARD_NUMBER`:
           Card number.
        - `CARD_EXPIRATION_DATE`:
           Card expiration date.
        - `COUNTRY`:
           Country.
        */
        type FieldType = "SURNAME" | "GIVEN_NAME" | "DATE_OF_BIRTH" | "PERSONAL_IDENTIFICATION_NUMBER" | "INSTITUTION_NUMBER" | "INSTITUTION_NAME" | "CARD_NUMBER" | "CARD_EXPIRATION_DATE" | "COUNTRY";
        const FieldTypeValues: FieldType[];
    }
}
/**
Configuration for the European health insurance card (EHIC) recognizer.
*/
export declare class EuropeanHealthInsuranceCardRecognizerConfiguration extends PartiallyConstructible {
    /**
    List of allowed countries for the EHIC. If:
    - single country: validation rules for the given country are used starting from the first
                    frame. If the country cannot be inferred or the inferred country doesn't
                    match the given country, the result of recognize() will be IncompleteValidation.
    - multiple countries: the country is inferred from the card number first.
                    Until the country is detected, the document fields are not OCR'd and
                    accumulated. Once the country is inferred, the field accumulation starts
                    and the inferred country validation rules are applied.
                    If the country cannot be inferred or the inferred country doesn't match
                    any of the countries in the list, the result status will be IncompleteValidation.
    - empty list: same as "multiple countries" with one additional detail.
    
    If the country cannot be inferred within `maxCountryDetectionAttempts` successive frames in which the
    part of the card number that stores the country code was successfully OCR'd, then the country is
    inferred to be Unknown and no validation rules are applied. Field accumulation then proceeds normally.
    In this case recognize() can eventually return Success and the document will have a CountryType of Unknown.
    @defaultValue [];
    */
    allowedCountries: EuropeanHealthInsuranceCardIssuingCountry[];
    /**
    Minimum year of birth.
    @defaultValue 0;
    */
    minBirthYear: number;
    /**
    Maximum year of birth.
    @defaultValue 2999;
    */
    maxBirthYear: number;
    /**
    Minimum card expiration year.
    @defaultValue 0;
    */
    minExpirationYear: number;
    /**
    Maximum card expiration year.
    @defaultValue 2999;
    */
    maxExpirationYear: number;
    /**
    Maximum number of attempts before giving up on country detection. After the specified number of
    attempts, the country field is considered to be unknown and validation is skipped.
    This option is ignored if allowedCountries is not empty.
    @defaultValue 5;
    */
    maxCountryDetectionAttempts: number;
    /**
    Minimum number of accumulated frames that should have equal result for a field.
    Once satisfied, the corresponding field is considered to be successfully-recognized and won't be considered in the subsequent frames.
    @defaultValue 4;
    */
    minEqualFrameCount: number;
    /**
    Maximum number of partial frame results to keep in cache while waiting to gather minEqualFrameCount equal results.
    @defaultValue 10;
    */
    maxAccumulatedFrameCount: number;
    /** @param source {@displayType `DeepPartial<EuropeanHealthInsuranceCardRecognizerConfiguration>`} */
    constructor(source?: DeepPartial<EuropeanHealthInsuranceCardRecognizerConfiguration>);
}
