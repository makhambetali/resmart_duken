import { GenericDocument, Field } from './GenericDocument';
export type CreditCardDocumentModelRootType = typeof CreditCardDocumentType;
export declare const CreditCardDocumentType = "CreditCard";
/** Credit Card Document */
export declare class CreditCard {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** The card number of the recognized credit card */
    get cardNumber(): Field;
    /** The cardholder name of the recognized credit card */
    get cardholderName(): Field | undefined;
    /** The expiry date of the recognized credit card */
    get expiryDate(): Field | undefined;
}
