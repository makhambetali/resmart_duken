import { CommonFieldType } from "./CommonFieldType";
import { DeepPartial, PartiallyConstructible } from "../common";
import { Point } from "../common";
import { RawImage } from "../common";
/**
Result of OCR text recognition.
*/
export declare class OcrResult extends PartiallyConstructible {
    /**
    Maximum number of accumulated frames to inspect before actual result is returned.
    */
    readonly text: string;
    /**
    Minimum number of accumulated frames that have equal result.
    */
    readonly confidence: number;
    /** @param source {@displayType `DeepPartial<OcrResult>`} */
    constructor(source?: DeepPartial<OcrResult>);
}
/**
Field validation status.

Optical character recognition (OCR) invariably introduces errors in the recognized text.
There are numerous ways to verify that what has been recognized is, in fact, what was
written in the document.

The best way to validate the value of a field is for it to have a known format or validation
logic. For example, an IBAN number has a known format and two check digits that make it
very unlikely that a value with OCR errors will pass validation. Fields with known
validation rules will have a validation status of either VALID or INVALID.

Fields whose value can be inferred from other fields, or from domain knowledge (for example,
the field may have the same value in every instance of this type of document), will have the
status INFERRED. Inferring the value of a field is a strong validation method, provided that
there are no unexpected changes to the document format.

Fields that do not have validation rules and cannot be inferred can still be validated by checking whether the same
value is recognized from multiple attempts, e.g. across multiple frames of a camera stream.
If the same value is recognized in multiple frames, the value is considered CONFIRMED, otherwise
it will have the status NONE. This is the least strict validation method, as it does not protect
from systemic OCR errors, but in practice it still provides good results for most fields.

- `INVALID`:
   Field value failed validation. This status is used for fields that have validation rules, like
   IBAN, date fields, etc. that have check digits or a known format that can be validated.
- `NONE`:
   Field value was not validated, typically because the field does not support validation and the value
   has not been seen enough times to confirm it.
   If the same value is seen in multiple frames, the validation status will transition to CONFIRMED,
   but only if that particular recognizer supports multiple frame accumulation.
- `CONFIRMED`:
   The same field value was recognized in multiple frames, thereby confirming the value.
   Occurs only for fields that have no validation rules otherwise.
   A CONFIRMED value gives a strong guarantee that the field value has been read out without errors,
   but not as strong as VALID. The value may still be incorrect, due to systemic OCR errors.
   In case of OCR errors, increase the number of frames needed to confirm the value in the
   recognizer configuration.
- `INFERRED`:
   Field value was inferred from other fields or from domain knowledge.
   The field value may differ from what is actually written in the document in unexpected situations.
- `VALID`:
   Field value passed validation. This status is used for fields that have validation rules, like
   IBAN, date fields, etc. that have check digits or a known format that can be validated.
   The VALID status gives the strongest guarantee that the field value has been read out without errors.
- `IGNORED`:
   The document contains a field of this type, but recognition for this field is disabled.
   The value of this field is always empty, although the field may be non-empty in the document.
*/
export type FieldValidationStatus = "INVALID" | "NONE" | "CONFIRMED" | "INFERRED" | "VALID" | "IGNORED";
export declare const FieldValidationStatusValues: FieldValidationStatus[];
/**
Type of parsing applied to field.

- `ISO_DATE`:
   Field value is parsed as ISO 8601 date in format YYYY-MM-DD.
- `ISO_COUNTRY_ALPHA_2`:
   Field value is parsed as ISO 3166-1 alpha-2 country code. E.g. "DE" for Germany.
- `ISO_COUNTRY_ALPHA_3`:
   Field value is parsed as ISO 3166-1 alpha-3 country code. E.g. "DEU" for Germany.
- `ISO_COUNTRY_NUMERIC`:
   Field value is parsed as ISO 3166-1 numeric country code. E.g. "276" for Germany.
- `ISO_COUNTRY_NAME`:
   Field value is parsed as ISO 3166-1 country name. E.g. "Germany".
- `GENDER`:
   Field value is parsed as "Male", "Female".
*/
export type FieldDataFormat = "ISO_DATE" | "ISO_COUNTRY_ALPHA_2" | "ISO_COUNTRY_ALPHA_3" | "ISO_COUNTRY_NUMERIC" | "ISO_COUNTRY_NAME" | "GENDER";
export declare const FieldDataFormatValues: FieldDataFormat[];
/**
Parsed data.
*/
export declare class FieldParsedData extends PartiallyConstructible {
    /**
    Parsing type
    */
    readonly type: FieldDataFormat;
    /**
    Parsed value
    */
    readonly value: string;
    /** @param source {@displayType `DeepPartial<FieldParsedData>`} */
    constructor(source?: DeepPartial<FieldParsedData>);
}
/**
Generic Document Type.
*/
export declare class FieldType extends PartiallyConstructible {
    /**
    Local field type name scoped to the containing document type
    */
    readonly name: string;
    /**
    Unique global field type name prefixed with the document types of all containing documents
    */
    readonly fullName: string;
    /**
    Normalized global field type name. Fields in document types derived from the same base document type in the schema will have the same normalized name.
    */
    readonly normalizedName: string;
    /**
    Commonly occurring fields that have the same semantic meaning in different document types will often have a set common type.
    */
    readonly commonType: CommonFieldType | null;
    /**
    A document can contain multiple fields of the same name, the property serves for storing natural order of such fields, null if multiple entries aren't allowed for this field.
    @defaultValue null;
    */
    readonly listIndex: number | null;
    /** @param source {@displayType `DeepPartial<FieldType>`} */
    constructor(source?: DeepPartial<FieldType>);
}
/**
Generic document field.
*/
export declare class Field extends PartiallyConstructible {
    /**
    The type of the field.
    */
    readonly type: FieldType;
    /**
    Value of the field. Applicable only to text fields.
    */
    readonly value: OcrResult | null;
    /**
    Confidence weight.
    @defaultValue 1.0;
    */
    readonly confidenceWeight: number;
    /**
    Crop of the field.
    @defaultValue null;
    */
    readonly image: RawImage | null;
    /**
    Coordinates of the field in the root document coordinate system
    */
    readonly polygonInRoot: Point[];
    /**
    Field validation status. Applicable only to fields that support some kind of validation.
    @defaultValue "NONE";
    */
    readonly validationStatus: FieldValidationStatus;
    /**
    Parsed data.
    @defaultValue [];
    */
    readonly parsedData: FieldParsedData[];
    /** @param source {@displayType `DeepPartial<Field>`} */
    constructor(source?: DeepPartial<Field>);
}
/**
Generic Document Type.
*/
export declare class GenericDocumentType extends PartiallyConstructible {
    /**
    Local document type name
    */
    readonly name: string;
    /**
    Unique global document type name prefixed with the document types of all containing documents
    */
    readonly fullName: string;
    /**
    Normalized global document type name. Common document types appearing as child documents in different places will often have the same normalized type name.
    */
    readonly normalizedName: string;
    /**
    A document can contain multiple fields of the same name, the property serves for storing natural order of such fields, null if multiple entries aren't allowed for this field.
    @defaultValue null;
    */
    readonly listIndex: number | null;
    /** @param source {@displayType `DeepPartial<GenericDocumentType>`} */
    constructor(source?: DeepPartial<GenericDocumentType>);
}
/**
Generic document.
*/
export declare class GenericDocument extends PartiallyConstructible {
    /**
    Document type
    */
    readonly type: GenericDocumentType;
    /**
    List of document fields
    */
    readonly fields: Field[];
    /**
    List of document sub-documents
    */
    readonly children: GenericDocument[];
    /**
    Coordinates of the document in the parent document coordinate system
    */
    readonly quad: Point[];
    /**
    Coordinates of the document in the root document coordinate system
    */
    readonly quadInRoot: Point[];
    /**
    Image crop of the document.
    @defaultValue null;
    */
    readonly crop: RawImage | null;
    /**
    The average confidence in the accuracy of the document recognition result.
    @defaultValue 0.0;
    */
    readonly confidence: number;
    /**
    The weight of the confidence. Can be used to calculate the weighted average confidence of two documents.
    @defaultValue 0.0;
    */
    readonly confidenceWeight: number;
    /** @param source {@displayType `DeepPartial<GenericDocument>`} */
    constructor(source?: DeepPartial<GenericDocument>);
}
