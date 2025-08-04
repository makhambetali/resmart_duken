import { DeepPartial, PartiallyConstructible } from "../common";
import { MrzDocumentType } from "./MrzTypes";
/**
Base class for all generic document configuration elements.
*/
export type DocumentDataExtractorConfigurationElement = DateValidationConfiguration | EuropeanHealthInsuranceCardConfiguration | MrzFallbackConfiguration | DocumentDataExtractorCommonConfiguration;
/** @internal */
export declare namespace DocumentDataExtractorConfigurationElement {
    /** @internal */
    function From(source: {
        [key: string]: any;
    }): DocumentDataExtractorConfigurationElement;
}
/**
Date validation configuration.
This configuration element does not enable the scanning of any document types by itself.
Add to recognizer configuration to require date validation checks for specific document types.
*/
export declare class DateValidationConfiguration extends PartiallyConstructible {
    readonly _type: "DateValidationConfiguration";
    /**
    Minimum year that is considered valid.
    @defaultValue 0;
    */
    minYear: number;
    /**
    Maximum year that is considered valid.
    @defaultValue 2999;
    */
    maxYear: number;
    /**
    Name, FullName, or NormalizedName of field type for which the year bounds should be applied.
    */
    fieldTypeName: string;
    /** @param source {@displayType `DeepPartial<DateValidationConfiguration>`} */
    constructor(source?: DeepPartial<DateValidationConfiguration>);
}
/**
European Health Insurance Card (EHIC) issuing country.

- `AUSTRIA`:
   Austria (Validation on the personal identification number is performed as described in "site:www.sozialversicherung.at Was ist die Versicherungsnummer?").
- `BELGIUM`:
   Belgium.
- `BULGARIA`:
   Bulgaria.
- `CROATIA`:
   Croatia.
- `CYPRUS`:
   Cyprus.
- `CZECH_REPUBLIC`:
   Czech Republic.
- `DENMARK`:
   Denmark.
- `ESTONIA`:
   Estonia.
- `FINLAND`:
   Finland.
- `FRANCE`:
   France.
- `GERMANY`:
   Germany (Validation performed according to "Spezifikation für Musterkarten und Testkarten (eGK, HBA, SMC), Anhang A" and "GS1 Struktur der Kenn-Nummer (ICCSN) der elektronischen Gesundheitskarte").
- `GREECE`:
   Greece.
- `HUNGARY`:
   Hungary.
- `IRELAND`:
   Ireland.
- `ITALY`:
   Italy.
- `LATVIA`:
   Latvia.
- `LITHUANIA`:
   Lithuania.
- `LUXEMBOURG`:
   Luxembourg.
- `MALTA`:
   Malta.
- `NETHERLANDS`:
   Netherlands.
- `POLAND`:
   Poland.
- `PORTUGAL`:
   Portugal.
- `ROMANIA`:
   Romania.
- `SLOVAKIA`:
   Slovakia.
- `SLOVENIA`:
   Slovenia.
- `SPAIN`:
   Spain.
- `SWEDEN`:
   Sweden.
- `SWITZERLAND`:
   Switzerland.
*/
export type EuropeanHealthInsuranceCardIssuingCountry = "AUSTRIA" | "BELGIUM" | "BULGARIA" | "CROATIA" | "CYPRUS" | "CZECH_REPUBLIC" | "DENMARK" | "ESTONIA" | "FINLAND" | "FRANCE" | "GERMANY" | "GREECE" | "HUNGARY" | "IRELAND" | "ITALY" | "LATVIA" | "LITHUANIA" | "LUXEMBOURG" | "MALTA" | "NETHERLANDS" | "POLAND" | "PORTUGAL" | "ROMANIA" | "SLOVAKIA" | "SLOVENIA" | "SPAIN" | "SWEDEN" | "SWITZERLAND";
export declare const EuropeanHealthInsuranceCardIssuingCountryValues: EuropeanHealthInsuranceCardIssuingCountry[];
/**
European Health Insurance Card (EHIC) configuration element. Add to extractor configuration to scan EHICs.
*/
export declare class EuropeanHealthInsuranceCardConfiguration extends PartiallyConstructible {
    readonly _type: "EuropeanHealthInsuranceCardConfiguration";
    /**
    If an expected country is selected, validation rules for the given country are used, a
    and if the expected country cannot be inferred or the inferred country doesn't  match the given country,
    the result of extract() will be IncompleteValidation.
    @defaultValue null;
    */
    expectedCountry: EuropeanHealthInsuranceCardIssuingCountry | null;
    /** @param source {@displayType `DeepPartial<EuropeanHealthInsuranceCardConfiguration>`} */
    constructor(source?: DeepPartial<EuropeanHealthInsuranceCardConfiguration>);
}
/**
MRZ fallback configuration element.
This configuration element does not enable the scanning of any document types by itself.
Add to extractor configuration to enable recognizing the MRZ only, specifically for documents that are otherwise not supported.
Note that this may enable scanning of documents that were not enabled through the accepted document types.
*/
export declare class MrzFallbackConfiguration extends PartiallyConstructible {
    readonly _type: "MRZFallbackConfiguration";
    /**
    List of ISO 3166-1 alpha-3 country codes for which the MRZ fallback is enabled. (e.g. "DEU" for Germany).
    @defaultValue [];
    */
    acceptedCountries: string[];
    /**
    List of MRZ document types for which MRZ fallback is enabled.
    @defaultValue [];
    */
    acceptedMRZTypes: MrzDocumentType[];
    /** @param source {@displayType `DeepPartial<MrzFallbackConfiguration>`} */
    constructor(source?: DeepPartial<MrzFallbackConfiguration>);
}
/**
Convenience configuration element for enabling the scanning of multiple document types with a common configuration.
Add to extractor configuration to enable the scanning of multiple document types.
*/
export declare class DocumentDataExtractorCommonConfiguration extends PartiallyConstructible {
    readonly _type: "DocumentDataExtractorCommonConfiguration";
    /**
    List of document types to scan. By default, the list is empty.
    */
    acceptedDocumentTypes: string[];
    /** @param source {@displayType `DeepPartial<DocumentDataExtractorCommonConfiguration>`} */
    constructor(source?: DeepPartial<DocumentDataExtractorCommonConfiguration>);
}
