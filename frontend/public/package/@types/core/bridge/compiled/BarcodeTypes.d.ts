import { DeepPartial, PartiallyConstructible } from "../common";
/**
Enumerates barcode formats.

- `NONE`:
   Used as a return value if no valid barcode has been detected.
- `AZTEC`:
   Aztec (2D).
- `CODABAR`:
   CODABAR (1D).
- `CODE_39`:
   Code 39 (1D).
- `CODE_93`:
   Code 93 (1D).
- `CODE_128`:
   Code 128 (1D).
- `DATA_MATRIX`:
   Data Matrix (2D).
- `EAN_8`:
   EAN-8 (1D).
- `EAN_13`:
   EAN-13 (1D).
- `ITF`:
   ITF (Interleaved Two of Five) (1D).
- `MAXI_CODE`:
   MaxiCode (2D).
- `PDF_417`:
   PDF417 (2D).
- `QR_CODE`:
   QR Code (2D).
- `DATABAR`:
   GS1 DataBar-14 (formerly RSS-14) (1D).
- `DATABAR_EXPANDED`:
   GS1 DataBar Expanded (formerly RSS Expanded) (1D).
- `UPC_A`:
   UPC-A (1D).
- `UPC_E`:
   UPC-E (1D).
- `MSI_PLESSEY`:
   MSI PLESSEY.
- `IATA_2_OF_5`:
   IATA 2 of 5 (1D).
- `INDUSTRIAL_2_OF_5`:
   INDUSTRIAL 2 of 5 (1D).
- `CODE_25`:
   CODE 25 (1D).
- `MICRO_QR_CODE`:
   Micro QR Code (2D).
- `USPS_INTELLIGENT_MAIL`:
   USPS Intelligent Mail, a.k.a. USPS OneCode, USPS-STD-11.
- `ROYAL_MAIL`:
   Royal Mail Four-State Customer Code, a.k.a. RM4SCC, CBC, BPO 4 State Code.
- `JAPAN_POST`:
   Japan Post Four-State Barcode.
- `ROYAL_TNT_POST`:
   Royal TNT Post Four-State Barcode, a.k.a. KIX, Klant IndeX.
- `AUSTRALIA_POST`:
   Australia Post Four-State Customer Code.
- `DATABAR_LIMITED`:
   GS1 DataBar Limited.
- `MICRO_PDF_417`:
   Micro PDF417 (2D).
- `GS1_COMPOSITE`:
   GS1 COMPOSITE (combined linear and 2D).
- `RMQR_CODE`:
   Rectangular Micro QR Code (2D).
- `CODE_11`:
   Code 11 (1D).
- `CODE_32`:
   Code 32 (Italian Pharmacode) (1D).
- `PHARMA_CODE`:
   Pharmacode, a.k.a. One-Track Pharmacode, Pharmaceutical Binary Code (1D).
- `PHARMA_CODE_TWO_TRACK`:
   Two-Track Pharmacode, a.k.a. Pharmaceutical Binary Code.
- `PZN_7`:
   PZN7, legacy PZN (Pharmazentralnummer), invalid since 01.01.2020 (1D).
- `PZN_8`:
   PZN8, a.k.a. PZN, Pharmazentralnummer, German Pharmaceutical Central Number (1D).
*/
export type BarcodeFormat = "NONE" | "AZTEC" | "CODABAR" | "CODE_39" | "CODE_93" | "CODE_128" | "DATA_MATRIX" | "EAN_8" | "EAN_13" | "ITF" | "MAXI_CODE" | "PDF_417" | "QR_CODE" | "DATABAR" | "DATABAR_EXPANDED" | "UPC_A" | "UPC_E" | "MSI_PLESSEY" | "IATA_2_OF_5" | "INDUSTRIAL_2_OF_5" | "CODE_25" | "MICRO_QR_CODE" | "USPS_INTELLIGENT_MAIL" | "ROYAL_MAIL" | "JAPAN_POST" | "ROYAL_TNT_POST" | "AUSTRALIA_POST" | "DATABAR_LIMITED" | "MICRO_PDF_417" | "GS1_COMPOSITE" | "RMQR_CODE" | "CODE_11" | "CODE_32" | "PHARMA_CODE" | "PHARMA_CODE_TWO_TRACK" | "PZN_7" | "PZN_8";
export declare const BarcodeFormatValues: BarcodeFormat[];
/**
Lists of barcode formats to decode.
*/
export declare class BarcodeFormats extends PartiallyConstructible {
    /** @param source {@displayType `DeepPartial<BarcodeFormats>`} */
    constructor(source?: DeepPartial<BarcodeFormats>);
}
export declare namespace BarcodeFormats {
    /**
    List of 1D barcode formats.
    @defaultValue ["CODABAR", "CODE_11", "CODE_25", "CODE_32", "CODE_39", "CODE_93", "CODE_128", "DATABAR", "DATABAR_EXPANDED", "DATABAR_LIMITED", "EAN_8", "EAN_13", "IATA_2_OF_5", "INDUSTRIAL_2_OF_5", "ITF", "MSI_PLESSEY", "PHARMA_CODE", "PZN_7", "PZN_8", "UPC_A", "UPC_E"];
    */
    const oned: BarcodeFormat[];
    /**
    List of 2D barcode formats.
    @defaultValue ["AZTEC", "DATA_MATRIX", "MAXI_CODE", "MICRO_QR_CODE", "MICRO_PDF_417", "PDF_417", "QR_CODE", "RMQR_CODE"];
    */
    const twod: BarcodeFormat[];
    /**
    List of postal barcode formats.
    @defaultValue ["AUSTRALIA_POST", "JAPAN_POST", "ROYAL_MAIL", "ROYAL_TNT_POST", "USPS_INTELLIGENT_MAIL"];
    */
    const postal: BarcodeFormat[];
    /**
    List of pharmaceutical barcode formats.
    @defaultValue ["CODE_32", "PHARMA_CODE", "PHARMA_CODE_TWO_TRACK", "PZN_7", "PZN_8"];
    */
    const pharma: BarcodeFormat[];
    /**
    List of common barcode formats.
    @defaultValue ["AZTEC", "CODABAR", "CODE_39", "CODE_93", "CODE_128", "DATA_MATRIX", "DATABAR", "DATABAR_EXPANDED", "DATABAR_LIMITED", "EAN_13", "EAN_8", "ITF", "MICRO_QR_CODE", "PDF_417", "QR_CODE", "UPC_A", "UPC_E"];
    */
    const common: BarcodeFormat[];
    /**
    List of all barcode formats.
    @defaultValue ["AUSTRALIA_POST", "AZTEC", "CODABAR", "CODE_11", "CODE_25", "CODE_32", "CODE_39", "CODE_93", "CODE_128", "DATA_MATRIX", "DATABAR", "DATABAR_EXPANDED", "DATABAR_LIMITED", "EAN_13", "EAN_8", "GS1_COMPOSITE", "IATA_2_OF_5", "INDUSTRIAL_2_OF_5", "ITF", "JAPAN_POST", "MAXI_CODE", "MICRO_PDF_417", "MICRO_QR_CODE", "MSI_PLESSEY", "PDF_417", "PHARMA_CODE", "PHARMA_CODE_TWO_TRACK", "PZN_7", "PZN_8", "QR_CODE", "RMQR_CODE", "ROYAL_MAIL", "ROYAL_TNT_POST", "UPC_A", "UPC_E", "USPS_INTELLIGENT_MAIL"];
    */
    const all: BarcodeFormat[];
}
/**
GS1 message handling options.
The GS1 standard defines a a key-value format for business-centric data that can be encoded into many 1D and 2D barcode types.
https://ref.gs1.org/standards/genspecs/

GS1 messages have two representations or formats: a human-readable format and a
machine-readable format. The human-readable format uses parentheses to wrap the keys in each
pair. For example, the string "(01)012345678901(37)02(3922)00278" contains three AI keys:
01, 37, and 3922. The corresponding values are 012345678901, 02, and 00278.

The machine-readable format uses the special ASCII \x1D character to terminate key-value
pairs in the string in cases where the given key implies that the value is variable-length.
The equivalent machine-readable string for the above example is
"010123456789013702\x1D392200278".
In the above example, the 01 AI key is fixed-length, so the \x1D character is not necessary.
The 37 AI keys is variable-length, so the \x1D character is necessary after the value in the
pair. The 3922 AI key is also variable-length, but it is the last pair in the message, so
the \x1D character is not necessary at the end.

The character \x1D is UNPRINTABLE - this means that if you try to print or otherwise
visualize a GS1 message containing the \x1D character, you may see a number of different
results, depending on how the system handles unprintable characters. You may see a question
mark, a box, an escape sequence, a space or nothing at all.

- `PARSE`:
   This is the default. GS1 messages are converted to the machine-readable format per
   the GS1 spec (the special FNC1 character is converted to ASCII \x1D).
   The implied 01 AI key is prepended to DataBar results.
   No validation is performed.
- `VALIDATE_STRUCTURE`:
   Same as PARSE. Additionally, messages containing unknown AI keys, or containing values
   that don't fulfill the length, character set or regex requirements for known keys, are rejected.
- `DECODE_STRUCTURE`:
   Same as VALIDATE_STRUCTURE. Additionally, GS1 strings are converted to the human-readable format,
   instead (with parentheses used to wrap AI keys, e.g. "(01)123456789"). The \x1D character is
   never used in this representation.
- `VALIDATE_FULL`:
   Includes all validations from VALIDATE_STRUCTURE. Additionally, GS1 messages which have missing or incompatible combinations of AI keys are rejected. Additionally, values are checked against a list of known linting rules, e.g. checksums are calculated and verified, dates are checked for validity, etc. Results that fail any of the linter rules are rejected. The complete set of linter rules from the GS1 Syntax Dictionary are implemented.
- `DECODE_FULL`:
   Combines the validations of VALIDATE_FULL and the human-readable output format of DECODE_STRUCTURE.
*/
export type Gs1Handling = "PARSE" | "VALIDATE_STRUCTURE" | "DECODE_STRUCTURE" | "VALIDATE_FULL" | "DECODE_FULL";
export declare const Gs1HandlingValues: Gs1Handling[];
/**
Behavior when scanning UPC/EAN barcodes with EAN-2 or EAN-5 extensions.

- `REQUIRE_2`:
   Only barcodes with a 2-digit extension are accepted.
- `REQUIRE_5`:
   Only barcodes with a 5-digit extension are accepted.
- `REQUIRE_ANY`:
   Only barcodes with either a 2-digit or a 5-digit extension are accepted.
- `IGNORE`:
   Always ignore the extension.
- `ALLOW_2`:
   Return detected 2-digit extension if present, but do not require it. Ignore the 5-digit extension.
- `ALLOW_5`:
   Return detected 5-digit extension if present, but do not require it. Ignore the 2-digit extension.
- `ALLOW_ANY`:
   Return any detected extension if present, but do not require it.
*/
export type UpcEanExtensionBehavior = "REQUIRE_2" | "REQUIRE_5" | "REQUIRE_ANY" | "IGNORE" | "ALLOW_2" | "ALLOW_5" | "ALLOW_ANY";
export declare const UpcEanExtensionBehaviorValues: UpcEanExtensionBehavior[];
