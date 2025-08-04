import { DeepPartial, PartiallyConstructible } from "../common";
import { DocumentDetectionResult } from "./DocumentScannerTypes";
import { Point } from "../common";
import { RawImage } from "../common";
/**
Parameters for the medical certificate scanning. The scanner supports
Form 1 (Arbeitsunfähigkeitsbescheinigung) and
Form 21a (Ärztliche Bescheinigung für den Bezug von Krankengeld bei Erkrankung eines Kindes)
from the KBV (Kassenärztliche Bundesvereinigung) list of forms.
*/
export declare class MedicalCertificateScanningParameters extends PartiallyConstructible {
    /**
    Document will be detected and cropped before recognition.
    If false, a cropped image of a document is assumed.
    @defaultValue true;
    */
    shouldCropDocument: boolean;
    /**
    All data in the patient info box will be extracted.
    If false, the patient info box is ignored.
    @defaultValue true;
    */
    recognizePatientInfoBox: boolean;
    /**
    Some forms are printed with an extra barcode that encodes the same information as the document.
    Reading the barcode is more reliable than OCR and is recommended when possible.
    If false, the barcode will not be scanned.
    @defaultValue true;
    */
    recognizeBarcode: boolean;
    /**
    If true, cropped document image will be extracted and returned.
    @defaultValue false;
    */
    extractCroppedImage: boolean;
    /**
    If true, the image is sharpened before processing.
    @defaultValue false;
    */
    preprocessInput: boolean;
    /** @param source {@displayType `DeepPartial<MedicalCertificateScanningParameters>`} */
    constructor(source?: DeepPartial<MedicalCertificateScanningParameters>);
}
/**
Type of the checkbox.

- `UNKNOWN`:
   Unknown checkbox type.
- `WORK_ACCIDENT`:
   (Form 1) Work accident (Arbeitsunfall, Arbeitsunfall-folgen, Berufskrankheit) checkbox.
- `ASSIGNED_TO_ACCIDENT_INSURANCE_DOCTOR`:
   (Form 1) Assigned to accident insurance doctor (dem Durchgangsarzt zugewiesen) checkbox.
- `INITIAL_CERTIFICATE`:
   (Form 1) Initial certificate (Erstbescheinigung) checkbox.
- `RENEWED_CERTIFICATE`:
   (Form 1) Renewed certificate (Folgebescheinigung) checkbox.
- `INSURED_PAY_CASE`:
   (Form 1) Insured pay case (ab 7. AU-Woche oder sonstiger Krankengeldfall) checkbox.
- `FINAL_CERTIFICATE`:
   (Form 1) Final certificate (Endbescheinigung) checkbox.
- `REQUIRES_CARE_YES`:
   (Form 21a) Requires care yes (Die Art der Erkrankung macht die Betreuung und Beaufsichtigung notwendig... ja) checkbox.
- `REQUIRES_CARE_NO`:
   (Form 21a) Requires care no (Die Art der Erkrankung macht die Betreuung und Beaufsichtigung notwendig... nein) checkbox.
- `ACCIDENT_YES`:
   (Form 21a) Accident yes (Unfall... ja) checkbox.
- `ACCIDENT_NO`:
   (Form 21a) Accident no (Unfall... nein) checkbox.
- `OTHER_ACCIDENT`:
   (Form 1) Other accident (Sonstiger Unfall, Unfallfolgen) checkbox.
- `ENTITLEMENT_TO_CONTINUED_PAYMENT_YES`:
   (Form 21a) Entitlement to continued payment yes (Anspruch auf Entgeltfortzahlung) checkbox.
- `ENTITLEMENT_TO_CONTINUED_PAYMENT_NO`:
   (Form 21a) Entitlement to continued payment no (keinen Anspruch auf Entgeltfortzahlung) checkbox.
- `SICK_PAY_WAS_CLAIMED_NO`:
   (Form 21a) Sick pay was claimed no (Krankengeld aus Anlass einer früheren Erkrankung des umseitig genannten Kindes wurde in diesem Kalenderjahr NICHT bezogen) checkbox.
- `SICK_PAY_WAS_CLAIMED_YES`:
   (Form 21a) Sick pay was claimed yes (Krankengeld aus Anlass einer früheren Erkrankung des umseitig genannten Kindes wurde in diesem Kalenderjahr bezogen) checkbox.
- `SINGLE_PARENT_NO`:
   (Form 21a) Single parent no (Ich bin Alleinerziehende(r)... nein) checkbox.
- `SINGLE_PARENT_YES`:
   (Form 21a) Single parent yes (Ich bin Alleinerziehende(r)... ja) checkbox.
*/
export type MedicalCertificateCheckBoxType = "UNKNOWN" | "WORK_ACCIDENT" | "ASSIGNED_TO_ACCIDENT_INSURANCE_DOCTOR" | "INITIAL_CERTIFICATE" | "RENEWED_CERTIFICATE" | "INSURED_PAY_CASE" | "FINAL_CERTIFICATE" | "REQUIRES_CARE_YES" | "REQUIRES_CARE_NO" | "ACCIDENT_YES" | "ACCIDENT_NO" | "OTHER_ACCIDENT" | "ENTITLEMENT_TO_CONTINUED_PAYMENT_YES" | "ENTITLEMENT_TO_CONTINUED_PAYMENT_NO" | "SICK_PAY_WAS_CLAIMED_NO" | "SICK_PAY_WAS_CLAIMED_YES" | "SINGLE_PARENT_NO" | "SINGLE_PARENT_YES";
export declare const MedicalCertificateCheckBoxTypeValues: MedicalCertificateCheckBoxType[];
/**
Structure to contain full information about found box.
*/
export declare class MedicalCertificateCheckBox extends PartiallyConstructible {
    /**
    Box type.
    @defaultValue "UNKNOWN";
    */
    readonly type: MedicalCertificateCheckBoxType;
    /**
    True if the box is checked.
    @defaultValue false;
    */
    readonly checked: boolean;
    /**
    Confidence of the checked/unchecked prediction.
    @defaultValue 0.0;
    */
    readonly checkedConfidence: number;
    /**
    Points of the box
    */
    readonly quad: Point[];
    /** @param source {@displayType `DeepPartial<MedicalCertificateCheckBox>`} */
    constructor(source?: DeepPartial<MedicalCertificateCheckBox>);
}
/**
Type of a date record.

- `INCAPABLE_OF_WORK_SINCE`:
   (Form 1) Incapable of work since (arbeitsunfähig seit) date.
- `INCAPABLE_OF_WORK_UNTIL`:
   (Form 1) Incapable of work until (voraussichtlich arbeitsunfähig bis einschließlich oder letzter Tag der Arbeitsunfähigkeit) date.
- `DIAGNOSED_ON`:
   (Form 1) Diagnosed on (festgestellt am) date.
- `DOCUMENT_DATE`:
   Document date.
- `BIRTH_DATE`:
   Birthdate (geb. am).
- `CHILD_NEEDS_CARE_FROM`:
   (Form 21a) Child needs care from (Das genannte Kind bedarf/bedurfte vom) date.
- `CHILD_NEEDS_CARE_UNTIL`:
   (Form 21a) Child needs care until (Das genannte Kind bedarf/bedurfte bis einschließlich) date.
- `UNDEFINED`:
   Undefined date type.
*/
export type MedicalCertificateDateRecordType = "INCAPABLE_OF_WORK_SINCE" | "INCAPABLE_OF_WORK_UNTIL" | "DIAGNOSED_ON" | "DOCUMENT_DATE" | "BIRTH_DATE" | "CHILD_NEEDS_CARE_FROM" | "CHILD_NEEDS_CARE_UNTIL" | "UNDEFINED";
export declare const MedicalCertificateDateRecordTypeValues: MedicalCertificateDateRecordType[];
/**
Structure to contain date record information.
*/
export declare class MedicalCertificateDateRecord extends PartiallyConstructible {
    /**
    Date box
    */
    readonly quad: Point[];
    /**
    Validated date string.
    @defaultValue "";
    */
    readonly value: string;
    /**
    Raw date string.
    @defaultValue "";
    */
    readonly rawString: string;
    /**
    Date type.
    @defaultValue "UNDEFINED";
    */
    readonly type: MedicalCertificateDateRecordType;
    /**
    Confidence in the recognized value.
    @defaultValue 0.0;
    */
    readonly recognitionConfidence: number;
    /** @param source {@displayType `DeepPartial<MedicalCertificateDateRecord>`} */
    constructor(source?: DeepPartial<MedicalCertificateDateRecord>);
}
/**
Type of a field in the patient info box.

- `INSURANCE_PROVIDER`:
   Insurance provider (Krankenkasse bzw. Kostenträger).
- `FIRST_NAME`:
   First name (Vorname des Versicherten).
- `LAST_NAME`:
   Last name (Name des Versicherten).
- `ADDRESS_STRING1`:
   First line of address.
- `ADDRESS_STRING2`:
   Second line of address.
- `DIAGNOSE`:
   Diagnose.
- `HEALTH_INSURANCE_NUMBER`:
   Number of the health insurance provider (Kostenträgerkennung).
- `INSURED_PERSON_NUMBER`:
   Personal number of the insured person (Versicherten-Nr.).
- `STATUS`:
   Status.
- `PLACE_OF_OPERATION_NUMBER`:
   Number of the place of operation (Betriebsstätten-Nr.).
- `DOCTOR_NUMBER`:
   Number of the doctor (Arzt-Nr.).
- `UNDEFINED`:
   Undefined.
*/
export type MedicalCertificatePatientInfoFieldType = "INSURANCE_PROVIDER" | "FIRST_NAME" | "LAST_NAME" | "ADDRESS_STRING1" | "ADDRESS_STRING2" | "DIAGNOSE" | "HEALTH_INSURANCE_NUMBER" | "INSURED_PERSON_NUMBER" | "STATUS" | "PLACE_OF_OPERATION_NUMBER" | "DOCTOR_NUMBER" | "UNDEFINED";
export declare const MedicalCertificatePatientInfoFieldTypeValues: MedicalCertificatePatientInfoFieldType[];
/**
Patient information field.
*/
export declare class MedicalCertificatePatientInfoField extends PartiallyConstructible {
    /**
    Field type
    */
    readonly type: MedicalCertificatePatientInfoFieldType;
    /**
    Field value
    */
    readonly value: string;
    /**
    Confidence in the recognized value
    */
    readonly recognitionConfidence: number;
    /** @param source {@displayType `DeepPartial<MedicalCertificatePatientInfoField>`} */
    constructor(source?: DeepPartial<MedicalCertificatePatientInfoField>);
}
/**
Patient information box.
*/
export declare class MedicalCertificatePatientInfoBox extends PartiallyConstructible {
    /**
    Four corners of the patient info box
    */
    readonly quad: Point[];
    /**
    Vector of found fields
    */
    readonly fields: MedicalCertificatePatientInfoField[];
    /**
    Whether the patient info box has contents.
    @defaultValue false;
    */
    readonly hasContents: boolean;
    /** @param source {@displayType `DeepPartial<MedicalCertificatePatientInfoBox>`} */
    constructor(source?: DeepPartial<MedicalCertificatePatientInfoBox>);
}
/**
Type of the medical certificate form.

- `UNKNOWN`:
   Unknown form type.
- `FORM_1A`:
   Form 1A.
- `FORM_1B`:
   Form 1B.
- `FORM_1C`:
   Form 1C.
- `FORM_1D`:
   Form 1D.
- `FORM_21A`:
   Form 21A.
- `FORM_21A_BACK`:
   Form 21A back.
- `FORM_1B_CUSTOM`:
   Form 1B custom.
*/
export type MedicalCertificateFormType = "UNKNOWN" | "FORM_1A" | "FORM_1B" | "FORM_1C" | "FORM_1D" | "FORM_21A" | "FORM_21A_BACK" | "FORM_1B_CUSTOM";
export declare const MedicalCertificateFormTypeValues: MedicalCertificateFormType[];
/**
The result of the medical certificate scanning.
*/
export declare class MedicalCertificateScanningResult extends PartiallyConstructible {
    /**
    True if scanning was successful.
    @defaultValue false;
    */
    readonly scanningSuccessful: boolean;
    /**
    Patient info box
    */
    readonly patientInfoBox: MedicalCertificatePatientInfoBox;
    /**
    Found checkboxes
    */
    readonly checkBoxes: MedicalCertificateCheckBox[];
    /**
    Found dates
    */
    readonly dates: MedicalCertificateDateRecord[];
    /**
    Form type.
    @defaultValue "UNKNOWN";
    */
    readonly formType: MedicalCertificateFormType;
    /**
    The number of 90-degree clockwise rotations that were applied to the original image.
    The same number of counter-clockwise rotations are necessary to make the image upright again.
    @defaultValue 0;
    */
    readonly clockwiseRotations: number;
    /**
    The cropped image used for recognition.
    @defaultValue null;
    */
    readonly croppedImage: RawImage | null;
    /**
    The scale factor used to scale the image to the recognition size.
    @defaultValue 1.0;
    */
    readonly scaleX: number;
    /**
    The scale factor used to scale the image to the recognition size.
    @defaultValue 1.0;
    */
    readonly scaleY: number;
    /**
    Result of the document detection in the input image. Is available only if the shouldCropDocument parameter is set to true.
    */
    readonly documentDetectionResult: DocumentDetectionResult | null;
    /** @param source {@displayType `DeepPartial<MedicalCertificateScanningResult>`} */
    constructor(source?: DeepPartial<MedicalCertificateScanningResult>);
}
