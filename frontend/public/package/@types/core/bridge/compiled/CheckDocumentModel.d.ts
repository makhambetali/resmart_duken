import { GenericDocument, Field } from './GenericDocument';
export type CheckDocumentModelRootType = typeof USACheckDocumentType | typeof UAECheckDocumentType | typeof FRACheckDocumentType | typeof ISRCheckDocumentType | typeof KWTCheckDocumentType | typeof AUSCheckDocumentType | typeof INDCheckDocumentType | typeof CANCheckDocumentType | typeof UnknownCheckDocumentType;
export declare const CheckDocumentType = "Check";
export declare const USACheckDocumentType = "USACheck";
export declare const UAECheckDocumentType = "UAECheck";
export declare const FRACheckDocumentType = "FRACheck";
export declare const ISRCheckDocumentType = "ISRCheck";
export declare const KWTCheckDocumentType = "KWTCheck";
export declare const AUSCheckDocumentType = "AUSCheck";
export declare const INDCheckDocumentType = "INDCheck";
export declare const CANCheckDocumentType = "CANCheck";
export declare const UnknownCheckDocumentType = "UnknownCheck";
/** Check Document */
export declare abstract class Check {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    abstract requiredDocumentType(): string;
    /** type of check font */
    get fontType(): Field | undefined;
    /** Detected raw string */
    get rawString(): Field;
}
/** A check compatible with the ASC X9 standard used in the USA */
export declare class USACheck extends Check {
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Account number */
    get accountNumber(): Field;
    /** Auxiliary On-Us */
    get auxiliaryOnUs(): Field | undefined;
    /** Transit number */
    get transitNumber(): Field;
}
/** A check format commonly used in the United Arab Emirates */
export declare class UAECheck extends Check {
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Account number */
    get accountNumber(): Field;
    /** Cheque number */
    get chequeNumber(): Field;
    /** Routing number */
    get routingNumber(): Field;
}
/** A check format commonly used in France */
export declare class FRACheck extends Check {
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Account number */
    get accountNumber(): Field;
    /** Cheque number */
    get chequeNumber(): Field;
    /** Routing number */
    get routingNumber(): Field;
}
/** A check format commonly used in Israel */
export declare class ISRCheck extends Check {
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Account number */
    get accountNumber(): Field;
    /** Bank number */
    get bankNumber(): Field;
    /** Branch number */
    get branchNumber(): Field;
    /** Cheque number */
    get chequeNumber(): Field;
}
/** A check format commonly used in Kuwait */
export declare class KWTCheck extends Check {
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Account number */
    get accountNumber(): Field;
    /** Cheque number */
    get chequeNumber(): Field;
    /** Sort code */
    get sortCode(): Field;
}
/** A check compatible with the Australian Paper Clearing System cheque standard */
export declare class AUSCheck extends Check {
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Account number */
    get accountNumber(): Field;
    /** Auxiliary domestic */
    get auxDomestic(): Field | undefined;
    /** BSB */
    get bsb(): Field;
    /** Extra auxiliary domestic */
    get extraAuxDomestic(): Field | undefined;
    /** Transaction code */
    get transactionCode(): Field;
}
/** A check compatible with the CTS-2010 standard issued by the Reserve Bank of India in 2012 */
export declare class INDCheck extends Check {
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Account number */
    get accountNumber(): Field;
    /** Serial number */
    get serialNumber(): Field;
    /** Sort number */
    get sortNumber(): Field | undefined;
    /** Transaction code */
    get transactionCode(): Field;
}
/** A check format commonly used in Canada */
export declare class CANCheck extends Check {
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Account number */
    get accountNumber(): Field;
    /** Bank number */
    get bankNumber(): Field;
    /** Cheque number */
    get chequeNumber(): Field;
    /** Designation number */
    get designationNumber(): Field | undefined;
    /** Transaction code */
    get transactionCode(): Field | undefined;
    /** Transit number */
    get transitNumber(): Field;
}
/** A check that doesn't conform to any supported standard */
export declare class UnknownCheck extends Check {
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
}
