import { BarcodeFormat } from "./BarcodeTypes";
import { DeepPartial, PartiallyConstructible } from "../common";
/**
Type of barcode document format used.

- `AAMVA`:
   American Association of Motor Vehicle Administrators barcode document.
- `BOARDING_PASS`:
   Boarding pass barcode document.
- `DE_MEDICAL_PLAN`:
   German medication plan barcode document.
- `MEDICAL_CERTIFICATE`:
   German medical certificate barcode document.
- `ID_CARD_PDF_417`:
   ID card barcode document.
- `SEPA`:
   SEPA barcode (aka GiroCode) document.
- `SWISS_QR`:
   Swiss QR barcode document.
- `VCARD`:
   VCard barcode document.
- `GS1`:
   GS1 barcode document.
- `HIBC`:
   Health industry barcode document.
*/
export type BarcodeDocumentFormat = "AAMVA" | "BOARDING_PASS" | "DE_MEDICAL_PLAN" | "MEDICAL_CERTIFICATE" | "ID_CARD_PDF_417" | "SEPA" | "SWISS_QR" | "VCARD" | "GS1" | "HIBC";
export declare const BarcodeDocumentFormatValues: BarcodeDocumentFormat[];
/**
Barcode document formats.
*/
export declare class BarcodeDocumentFormats extends PartiallyConstructible {
    /** @param source {@displayType `DeepPartial<BarcodeDocumentFormats>`} */
    constructor(source?: DeepPartial<BarcodeDocumentFormats>);
}
export declare namespace BarcodeDocumentFormats {
    /**
    All barcode document formats.
    @defaultValue ["AAMVA", "BOARDING_PASS", "DE_MEDICAL_PLAN", "MEDICAL_CERTIFICATE", "ID_CARD_PDF_417", "SEPA", "SWISS_QR", "VCARD", "GS1", "HIBC"];
    */
    const all: BarcodeDocumentFormat[];
    /**
    Barcode types that are used to encode documents.
    @defaultValue {
        "AAMVA": ["PDF_417"],
        "ID_CARD_PDF_417": ["PDF_417"],
        "SEPA": ["QR_CODE"],
        "MEDICAL_CERTIFICATE": ["PDF_417"],
        "DE_MEDICAL_PLAN": ["DATA_MATRIX"],
        "BOARDING_PASS": ["PDF_417", "AZTEC"],
        "VCARD": ["QR_CODE"],
        "SWISS_QR": ["QR_CODE"],
        "GS1": ["CODE_128", "AZTEC", "DATA_MATRIX", "DATABAR", "DATABAR_EXPANDED", "DATABAR_LIMITED", "EAN_13", "EAN_8", "GS1_COMPOSITE", "ITF", "MICRO_PDF_417", "PDF_417", "QR_CODE", "UPC_A", "UPC_E"],
        "HIBC": ["CODE_39", "CODE_128", "AZTEC", "DATA_MATRIX", "MICRO_PDF_417", "PDF_417", "QR_CODE"]
    };
    */
    const documentBarcodeFormats: {
        [key in BarcodeDocumentFormat]: BarcodeFormat[];
    };
}
