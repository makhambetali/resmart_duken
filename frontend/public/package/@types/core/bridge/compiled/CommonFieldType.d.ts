/**
Common field types.

- `ID`:
   Document ID.
- `SURNAME`:
   Person surname field.
- `MAIDEN_NAME`:
   Person maiden name field.
- `GIVEN_NAMES`:
   Person given names field.
- `BIRTH_DATE`:
   Person birth date field.
- `NATIONALITY`:
   Person nationality field.
- `BIRTHPLACE`:
   Person birthplace field.
- `EXPIRY_DATE`:
   Document expiry date field.
- `EYE_COLOR`:
   Person height field.
- `HEIGHT`:
   Person height field.
- `ISSUE_DATE`:
   Document issue date field.
- `ISSUING_AUTHORITY`:
   Document issuing authority field.
- `ADDRESS`:
   Address field.
- `PSEUDONYM`:
   Pseudonym field.
- `MRZ`:
   MRZ field.
- `COUNTRY_CODE`:
   Country code (ISO-3166 Alpha-3) field.
- `GENDER`:
   Gender field.
- `SIGNATURE`:
   Signature field.
- `PHOTO`:
   Photo field.
- `VALID_FROM_DATE`:
   Date of start of validity field.
- `ROUTING_NUMBER`:
   Check routing number.
- `ACCOUNT_NUMBER`:
   Check account number.
- `PLACE_OF_ISSUE`:
   Place of issue for the identity card.
- `TITLE_TYPE`:
   Type of the title field in the identity document.
- `REMARKS`:
   Remarks field in the identity document.
- `NAME`:
   Full name field.
- `CARD_ACCESS_NUMBER`:
   Card access number field.
*/
export type CommonFieldType = "ID" | "SURNAME" | "MAIDEN_NAME" | "GIVEN_NAMES" | "BIRTH_DATE" | "NATIONALITY" | "BIRTHPLACE" | "EXPIRY_DATE" | "EYE_COLOR" | "HEIGHT" | "ISSUE_DATE" | "ISSUING_AUTHORITY" | "ADDRESS" | "PSEUDONYM" | "MRZ" | "COUNTRY_CODE" | "GENDER" | "SIGNATURE" | "PHOTO" | "VALID_FROM_DATE" | "ROUTING_NUMBER" | "ACCOUNT_NUMBER" | "PLACE_OF_ISSUE" | "TITLE_TYPE" | "REMARKS" | "NAME" | "CARD_ACCESS_NUMBER";
export declare const CommonFieldTypeValues: CommonFieldType[];
