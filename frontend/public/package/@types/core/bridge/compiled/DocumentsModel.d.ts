import { GenericDocument, Field } from './GenericDocument';
export type DocumentsModelRootType = typeof MRZDocumentType | typeof DeIdCardFrontDocumentType | typeof DeIdCardBackDocumentType | typeof DePassportDocumentType | typeof DeDriverLicenseFrontDocumentType | typeof DeDriverLicenseBackDocumentType | typeof DeResidencePermitFrontDocumentType | typeof DeResidencePermitBackDocumentType | typeof EuropeanHealthInsuranceCardDocumentType | typeof DeHealthInsuranceCardFrontDocumentType;
export declare const MRZDocumentType = "MRZ";
export declare const DeIdCardFrontDocumentType = "DeIdCardFront";
export declare const DeIdCardBackDocumentType = "DeIdCardBack";
export declare const DePassportDocumentType = "DePassport";
export declare const DeDriverLicenseFrontDocumentType = "DeDriverLicenseFront";
export declare const DeDriverLicenseBackDocumentType = "DeDriverLicenseBack";
export declare const DeDriverLicenseBackCategoryDocumentType = "Category";
export declare const DeDriverLicenseBackCategoriesDocumentType = "Categories";
export declare const DeDriverLicenseBackCategoriesADocumentType = "A";
export declare const DeDriverLicenseBackCategoriesA1DocumentType = "A1";
export declare const DeDriverLicenseBackCategoriesA2DocumentType = "A2";
export declare const DeDriverLicenseBackCategoriesAMDocumentType = "AM";
export declare const DeDriverLicenseBackCategoriesBDocumentType = "B";
export declare const DeDriverLicenseBackCategoriesB1DocumentType = "B1";
export declare const DeDriverLicenseBackCategoriesBEDocumentType = "BE";
export declare const DeDriverLicenseBackCategoriesCDocumentType = "C";
export declare const DeDriverLicenseBackCategoriesC1DocumentType = "C1";
export declare const DeDriverLicenseBackCategoriesC1EDocumentType = "C1E";
export declare const DeDriverLicenseBackCategoriesCEDocumentType = "CE";
export declare const DeDriverLicenseBackCategoriesDDocumentType = "D";
export declare const DeDriverLicenseBackCategoriesD1DocumentType = "D1";
export declare const DeDriverLicenseBackCategoriesD1EDocumentType = "D1E";
export declare const DeDriverLicenseBackCategoriesDEDocumentType = "DE";
export declare const DeDriverLicenseBackCategoriesLDocumentType = "L";
export declare const DeDriverLicenseBackCategoriesTDocumentType = "T";
export declare const DeResidencePermitFrontDocumentType = "DeResidencePermitFront";
export declare const DeResidencePermitBackDocumentType = "DeResidencePermitBack";
export declare const EuropeanHealthInsuranceCardDocumentType = "EuropeanHealthInsuranceCard";
export declare const DeHealthInsuranceCardFrontDocumentType = "DeHealthInsuranceCardFront";
/** MRZ part of the document */
export declare class MRZ {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Birth date */
    get birthDate(): Field;
    /** Check digit birth date */
    get checkDigitBirthDate(): Field | undefined;
    /** Check digit document number */
    get checkDigitDocumentNumber(): Field | undefined;
    /** Check digit expiry date */
    get checkDigitExpiryDate(): Field | undefined;
    /** Check  digit general */
    get checkDigitGeneral(): Field | undefined;
    /** Check digit personal number */
    get checkDigitPersonalNumber(): Field | undefined;
    /** Date of issuance */
    get dateOfIssuance(): Field | undefined;
    /** Document number */
    get documentNumber(): Field | undefined;
    /** Document type from the DocumentType enum */
    get documentType(): Field;
    /** Document type code */
    get documentTypeCode(): Field | undefined;
    /** Expiry date */
    get expiryDate(): Field | undefined;
    /** Gender */
    get gender(): Field | undefined;
    /** Given names */
    get givenNames(): Field;
    /** Issuing authority */
    get issuingAuthority(): Field | undefined;
    /** Language code */
    get languageCode(): Field | undefined;
    /** Nationality */
    get nationality(): Field;
    /** Office of issuance */
    get officeOfIssuance(): Field | undefined;
    /** TD1 Optional field (line 2) */
    get optional1(): Field | undefined;
    /** TD1 Optional field (line 3) */
    get optional2(): Field | undefined;
    /** PIN code */
    get pinCode(): Field | undefined;
    /** Personal number */
    get personalNumber(): Field | undefined;
    /** Surname */
    get surname(): Field;
    /** Travel document type */
    get travelDocType(): Field | undefined;
    /** Travel document type variant */
    get travelDocTypeVariant(): Field | undefined;
    /** Unknown */
    get unknown(): Field | undefined;
    /** Version number */
    get versionNumber(): Field | undefined;
    /** MRV-A/MRV-B (Travel Visa) Optional field */
    get visaOptional(): Field | undefined;
}
/** German ID card, front side */
export declare class DeIdCardFront {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Birth date */
    get birthDate(): Field;
    /** Birthplace */
    get birthplace(): Field;
    /** Six digit card access number */
    get cardAccessNumber(): Field;
    /** Expiry date */
    get expiryDate(): Field;
    /** Given names */
    get givenNames(): Field;
    /** Document ID number (in the top-right corner) */
    get id(): Field;
    /** Maiden name */
    get maidenName(): Field | undefined;
    /** Nationality */
    get nationality(): Field;
    /** Photo image */
    get photo(): Field;
    /** Signature image */
    get signature(): Field;
    /** Surname */
    get surname(): Field;
}
/** German ID card, back side */
export declare class DeIdCardBack {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Address */
    get address(): Field;
    /** Eye color */
    get eyeColor(): Field;
    /** Height */
    get height(): Field;
    /** Issue date */
    get issueDate(): Field;
    /** Issuing authority */
    get issuingAuthority(): Field;
    /** Pseudonym */
    get pseudonym(): Field | undefined;
    /** Raw MRZ text value */
    get rawMRZ(): Field;
    /** The child document of type "MRZ". */
    get mrz(): MRZ;
}
export declare namespace DeIdCardBack {
}
/** German travel passport (Reisepass) */
export declare class DePassport {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Birth date */
    get birthDate(): Field;
    /** Birthplace */
    get birthplace(): Field;
    /** Country code */
    get countryCode(): Field;
    /** Expiry date */
    get expiryDate(): Field;
    /** Gender */
    get gender(): Field;
    /** Given names */
    get givenNames(): Field;
    /** Document ID number (in the top-right corner) */
    get id(): Field;
    /** Issue date */
    get issueDate(): Field;
    /** Issuing authority */
    get issuingAuthority(): Field;
    /** Maiden name */
    get maidenName(): Field | undefined;
    /** Nationality */
    get nationality(): Field;
    /** Passport type */
    get passportType(): Field;
    /** Photo image */
    get photo(): Field;
    /** Raw MRZ text value */
    get rawMRZ(): Field;
    /** Signature image */
    get signature(): Field;
    /** Surname */
    get surname(): Field;
    /** The child document of type "MRZ". */
    get mrz(): MRZ;
}
export declare namespace DePassport {
}
/** German driver license (Führerschein), front side */
export declare class DeDriverLicenseFront {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Birth date (Field 3.) */
    get birthDate(): Field;
    /** Birthplace (Field 3.) */
    get birthplace(): Field;
    /** Expiry date (Field 4b.) */
    get expiryDate(): Field;
    /** Given names (Field 2.) */
    get givenNames(): Field;
    /** Document ID number (in the top-right corner, Field 5.) */
    get id(): Field;
    /** Issue date (Field 4a.) */
    get issueDate(): Field;
    /** Issuing authority (Field 4c.) */
    get issuingAuthority(): Field;
    /** Driver's license categories (Field 9.) */
    get licenseCategories(): Field;
    /** Photo image */
    get photo(): Field;
    /** Serial number (Field 5b. on Driver Qualification Card) */
    get serialNumber(): Field | undefined;
    /** Signature image (Field 7.) */
    get signature(): Field;
    /** Surname (Field 1.) */
    get surname(): Field;
}
/** German driver license (Führerschein), back side */
export declare class DeDriverLicenseBack {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Restrictions applied for the driver's license (Field 12.) */
    get restrictions(): Field | undefined;
    /** The child document of type "Categories". */
    get categories(): DeDriverLicenseBack.Categories;
}
export declare namespace DeDriverLicenseBack {
    /** A category row from the categories table */
    abstract class Category {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        abstract requiredDocumentType(): string;
        /** Restrictions (Column 12.) */
        get restrictions(): Field | undefined;
        /** Valid from (Column 10.) */
        get validFrom(): Field;
        /** Valid until (Column 11.) */
        get validUntil(): Field;
    }
    /** Categories table row container */
    class Categories {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
        /** The child document of type "A". */
        get a(): DeDriverLicenseBack.Categories.A;
        /** The child document of type "A1". */
        get a1(): DeDriverLicenseBack.Categories.A1;
        /** The child document of type "A2". */
        get a2(): DeDriverLicenseBack.Categories.A2;
        /** The child document of type "AM". */
        get am(): DeDriverLicenseBack.Categories.AM;
        /** The child document of type "B". */
        get b(): DeDriverLicenseBack.Categories.B;
        /** The child document of type "B1". */
        get b1(): DeDriverLicenseBack.Categories.B1 | undefined;
        /** The child document of type "BE". */
        get be(): DeDriverLicenseBack.Categories.BE;
        /** The child document of type "C". */
        get c(): DeDriverLicenseBack.Categories.C;
        /** The child document of type "C1". */
        get c1(): DeDriverLicenseBack.Categories.C1;
        /** The child document of type "C1E". */
        get c1E(): DeDriverLicenseBack.Categories.C1E;
        /** The child document of type "CE". */
        get ce(): DeDriverLicenseBack.Categories.CE;
        /** The child document of type "D". */
        get d(): DeDriverLicenseBack.Categories.D;
        /** The child document of type "D1". */
        get d1(): DeDriverLicenseBack.Categories.D1;
        /** The child document of type "D1E". */
        get d1E(): DeDriverLicenseBack.Categories.D1E;
        /** The child document of type "DE". */
        get de(): DeDriverLicenseBack.Categories.DE;
        /** The child document of type "L". */
        get l(): DeDriverLicenseBack.Categories.L;
        /** The child document of type "T". */
        get t(): DeDriverLicenseBack.Categories.T;
    }
    namespace Categories {
        /** DeDriverLicenseBack.Categories.A */
        class A extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.A1 */
        class A1 extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.A2 */
        class A2 extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.AM */
        class AM extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.B */
        class B extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.B1 */
        class B1 extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.BE */
        class BE extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.C */
        class C extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.C1 */
        class C1 extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.C1E */
        class C1E extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.CE */
        class CE extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.D */
        class D extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.D1 */
        class D1 extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.D1E */
        class D1E extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.DE */
        class DE extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.L */
        class L extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
        /** DeDriverLicenseBack.Categories.T */
        class T extends Category {
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
        }
    }
}
/** German Residence Permit (Aufenthaltstitel), Front side */
export declare class DeResidencePermitFront {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Birth date (Geburtsdatum) */
    get birthDate(): Field | undefined;
    /** Six digit card access number */
    get cardAccessNumber(): Field;
    /** Expiry date (Gültig bis) */
    get expiryDate(): Field;
    /** Gender (Geschlecht) */
    get gender(): Field | undefined;
    /** Given names */
    get givenNames(): Field;
    /** Document ID number (in the top-right corner) */
    get id(): Field;
    /** Nationality (Staatsangehörigkeit) */
    get nationality(): Field | undefined;
    /** Photo image */
    get photo(): Field;
    /** Place of issue (Ausstellungsort) */
    get placeOfIssue(): Field | undefined;
    /** Remarks (Anmerkungen) */
    get remarks(): Field;
    /** Signature image */
    get signature(): Field;
    /** Surname */
    get surname(): Field;
    /** Title type (Art des Titels) */
    get titleType(): Field;
    /** Valid from date (Gültig ab) */
    get validFrom(): Field | undefined;
}
/** German Residence Permit (Aufenthaltstitel), Back side */
export declare class DeResidencePermitBack {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Address (Anschrift) */
    get address(): Field;
    /** Birth date (Geburtsdatum) */
    get birthDate(): Field | undefined;
    /** Birthplace (Geburtsort) */
    get birthplace(): Field;
    /** Eye color (Augenfarbe) */
    get eyeColor(): Field;
    /** Gender (Geschlecht) */
    get gender(): Field | undefined;
    /** Height (Größe) */
    get height(): Field;
    /** Issuing authority (Ausländerbehörde) */
    get issuingAuthority(): Field;
    /** Nationality (Staatsangehörigkeit) */
    get nationality(): Field | undefined;
    /** Raw MRZ text value */
    get rawMRZ(): Field;
    /** Remarks (Anmerkungen) */
    get remarks(): Field | undefined;
    /** The child document of type "MRZ". */
    get mrz(): MRZ;
}
export declare namespace DeResidencePermitBack {
}
/** European Health Insurance Card (EHIC). Supports formats with both four and five lines of data.
 */
export declare class EuropeanHealthInsuranceCard {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Barcode image (only present in some formats) */
    get barcode(): Field | undefined;
    /** Birth date */
    get birthDate(): Field;
    /** Card number */
    get cardNumber(): Field;
    /** Country code (ISO 3166-1 alpha-2) */
    get countryCode(): Field;
    /** Expiry date */
    get expiryDate(): Field;
    /** Given names */
    get givenNames(): Field;
    /** Issuer name */
    get issuerName(): Field;
    /** Issuer number */
    get issuerNumber(): Field;
    /** Personal number */
    get personalNumber(): Field;
    /** Signature image */
    get signature(): Field | undefined;
    /** Surname */
    get surname(): Field;
}
/** Front side of the German health insurance card (elektronische Gesundheitskarte).
For the backside, see EuropeanHealthInsuranceCard.
 */
export declare class DeHealthInsuranceCardFront {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Six digit card access number */
    get cardAccessNumber(): Field | undefined;
    /** Issuer name */
    get issuerName(): Field;
    /** Issuer number (Versicherung bzw. Kennnummer des Trägers) */
    get issuerNumber(): Field;
    /** Full name with title */
    get name(): Field;
    /** Personal number (Versichertennummer) */
    get personalNumber(): Field;
}
