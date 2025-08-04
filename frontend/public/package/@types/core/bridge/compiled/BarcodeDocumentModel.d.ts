import { GenericDocument, Field } from './GenericDocument';
export type BarcodeDocumentModelRootType = typeof BoardingPassDocumentType | typeof SwissQRDocumentType | typeof DEMedicalPlanDocumentType | typeof IDCardPDF417DocumentType | typeof GS1DocumentType | typeof SEPADocumentType | typeof MedicalCertificateDocumentType | typeof VCardDocumentType | typeof AAMVADocumentType | typeof HIBCDocumentType;
export declare const BoardingPassDocumentType = "BoardingPass";
export declare const BoardingPassLegDocumentType = "Leg";
export declare const SwissQRDocumentType = "SwissQR";
export declare const DEMedicalPlanDocumentType = "DEMedicalPlan";
export declare const DEMedicalPlanPatientDocumentType = "Patient";
export declare const DEMedicalPlanDoctorDocumentType = "Doctor";
export declare const DEMedicalPlanSubheadingDocumentType = "Subheading";
export declare const DEMedicalPlanSubheadingMedicineDocumentType = "Medicine";
export declare const DEMedicalPlanSubheadingMedicineSubstanceDocumentType = "Substance";
export declare const DEMedicalPlanSubheadingPrescriptionDocumentType = "Prescription";
export declare const IDCardPDF417DocumentType = "IDCardPDF417";
export declare const GS1DocumentType = "GS1";
export declare const GS1ElementDocumentType = "Element";
export declare const GS1ElementValidationErrorDocumentType = "ValidationError";
export declare const SEPADocumentType = "SEPA";
export declare const MedicalCertificateDocumentType = "MedicalCertificate";
export declare const VCardDocumentType = "VCard";
export declare const VCardEntryDocumentType = "Entry";
export declare const VCardVersionDocumentType = "Version";
export declare const VCardSourceDocumentType = "Source";
export declare const VCardKindDocumentType = "Kind";
export declare const VCardXMLDocumentType = "XML";
export declare const VCardNameDocumentType = "Name";
export declare const VCardFirstNameDocumentType = "FirstName";
export declare const VCardNicknameDocumentType = "Nickname";
export declare const VCardBirthdayDocumentType = "Birthday";
export declare const VCardAnniversaryDocumentType = "Anniversary";
export declare const VCardGenderDocumentType = "Gender";
export declare const VCardDeliveryAddressDocumentType = "DeliveryAddress";
export declare const VCardPhotoDocumentType = "Photo";
export declare const VCardTelephoneNumberDocumentType = "TelephoneNumber";
export declare const VCardEmailDocumentType = "Email";
export declare const VCardIMPPDocumentType = "IMPP";
export declare const VCardLanguagesDocumentType = "Languages";
export declare const VCardTimeZoneDocumentType = "TimeZone";
export declare const VCardGeoLocationDocumentType = "GeoLocation";
export declare const VCardTitleDocumentType = "Title";
export declare const VCardRoleDocumentType = "Role";
export declare const VCardLogoDocumentType = "Logo";
export declare const VCardOrganisationDocumentType = "Organisation";
export declare const VCardMemberDocumentType = "Member";
export declare const VCardRelatedDocumentType = "Related";
export declare const VCardCategoriesDocumentType = "Categories";
export declare const VCardNoteDocumentType = "Note";
export declare const VCardProductIdDocumentType = "ProductId";
export declare const VCardRevisionDocumentType = "Revision";
export declare const VCardSoundDocumentType = "Sound";
export declare const VCardUIDDocumentType = "UID";
export declare const VCardClientPIDMapDocumentType = "ClientPIDMap";
export declare const VCardURLDocumentType = "URL";
export declare const VCardPublicKeyDocumentType = "PublicKey";
export declare const VCardBusyTimeURLDocumentType = "BusyTimeURL";
export declare const VCardCalendarURIForRequestsDocumentType = "CalendarURIForRequests";
export declare const VCardCalendarURIDocumentType = "CalendarURI";
export declare const VCardCustomDocumentType = "Custom";
export declare const AAMVADocumentType = "AAMVA";
export declare const AAMVATitleDataDocumentType = "TitleData";
export declare const AAMVARegistrationDataDocumentType = "RegistrationData";
export declare const AAMVAMotorCarrierDataDocumentType = "MotorCarrierData";
export declare const AAMVARegistrantAndVehicleDataDocumentType = "RegistrantAndVehicleData";
export declare const AAMVAVehicleOwnerDataDocumentType = "VehicleOwnerData";
export declare const AAMVAVehicleDataDocumentType = "VehicleData";
export declare const AAMVAVehicleSafetyInspectionDataDocumentType = "VehicleSafetyInspectionData";
export declare const AAMVADLIDDocumentType = "DLID";
export declare const AAMVADriverLicenseDocumentType = "DriverLicense";
export declare const AAMVAIDCardDocumentType = "IDCard";
export declare const AAMVAEnhancedDriverLicenseDocumentType = "EnhancedDriverLicense";
export declare const AAMVARawDocumentDocumentType = "RawDocument";
export declare const HIBCDocumentType = "HIBC";
/** Boarding Pass */
export declare class BoardingPass {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Electronic Ticket */
    get electronicTicket(): Field;
    /** Name */
    get name(): Field;
    /** Number Of Legs */
    get numberOfLegs(): Field;
    /** Security Data */
    get securityData(): Field;
    /** An array of all children of type "Leg". */
    get legs(): BoardingPass.Leg[];
}
export declare namespace BoardingPass {
    /** Leg of the journey */
    class Leg {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
        /** Airline Designator Of Boarding Pass Issuer */
        get airlineDesignatorOfBoardingPassIssuer(): Field | undefined;
        /** Airline Numeric Code */
        get airlineNumericCode(): Field | undefined;
        /** Baggage Tag License Plate Numbers */
        get baggageTagLicensePlateNumbers(): Field | undefined;
        /** Check In Sequence Number */
        get checkInSequenceNumber(): Field;
        /** Compartment Code */
        get compartmentCode(): Field;
        /** Date Of Boarding Pass Issuance Julian */
        get dateOfBoardingPassIssuanceJulian(): Field | undefined;
        /** Date Of Flight Julian */
        get dateOfFlightJulian(): Field;
        /** Departure Airport Code */
        get departureAirportCode(): Field;
        /** Destination Airport Code */
        get destinationAirportCode(): Field;
        /** Document Form Serial Number */
        get documentFormSerialNumber(): Field | undefined;
        /** Document Type */
        get documentType(): Field | undefined;
        /** Fast Track */
        get fastTrack(): Field | undefined;
        /** First Non Consecutive Baggage Tag License Plate Number */
        get firstNonConsecutiveBaggageTagLicensePlateNumber(): Field | undefined;
        /** Flight Number */
        get flightNumber(): Field;
        /** For Individual Airline Use */
        get forIndividualAirlineUse(): Field | undefined;
        /** Free Baggage Allowance */
        get freeBaggageAllowance(): Field | undefined;
        /** Frequent Flyer Airline Designator */
        get frequentFlyerAirlineDesignator(): Field | undefined;
        /** Frequent Flyer Number */
        get frequentFlyerNumber(): Field | undefined;
        /** IDAD Indicator */
        get idadIndicator(): Field | undefined;
        /** International Documentation Verification */
        get internationalDocumentationVerification(): Field | undefined;
        /** Marketing Carrier Designator */
        get marketingCarrierDesignator(): Field | undefined;
        /** Operating Carrier Designator */
        get operatingCarrierDesignator(): Field;
        /** Operating Carrier PNR Code */
        get operatingCarrierPNRCode(): Field;
        /** Passenger Description */
        get passengerDescription(): Field | undefined;
        /** Passenger Status */
        get passengerStatus(): Field;
        /** Seat Number */
        get seatNumber(): Field;
        /** Second Non Consecutive Baggage Tag License Plate Number */
        get secondNonConsecutiveBaggageTagLicensePlateNumber(): Field | undefined;
        /** Selectee Indicator */
        get selecteeIndicator(): Field | undefined;
        /** Source Of Boarding Pass Issuance */
        get sourceOfBoardingPassIssuance(): Field | undefined;
        /** Source Of Check In */
        get sourceOfCheckIn(): Field | undefined;
        /** VersionNumber */
        get versionNumber(): Field | undefined;
    }
}
/** SwissQR */
export declare class SwissQR {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Additional Billing Information */
    get additionalBillingInformation(): Field | undefined;
    /** Additional Info Trailer */
    get additionalInfoTrailer(): Field | undefined;
    /** Additional Info Unstructured */
    get additionalInfoUnstructured(): Field | undefined;
    /** Alternative Procedure Parameter */
    get alternativeProcedureParameter(): Field | undefined;
    /** Amount */
    get amount(): Field | undefined;
    /** Currency */
    get currency(): Field | undefined;
    /** Debtor Address Type */
    get debtorAddressType(): Field | undefined;
    /** Debtor Building Or Address Line 2 */
    get debtorBuildingOrAddressLine2(): Field | undefined;
    /** Debtor Country */
    get debtorCountry(): Field | undefined;
    /** Debtor Name */
    get debtorName(): Field | undefined;
    /** Debtor Place */
    get debtorPlace(): Field | undefined;
    /** Debtor Postal Code */
    get debtorPostalCode(): Field | undefined;
    /** Debtor Street Or Address Line 1 */
    get debtorStreetOrAddressLine1(): Field | undefined;
    /** Due Date */
    get dueDate(): Field | undefined;
    /** Encoding */
    get encoding(): Field | undefined;
    /** Final Payee Address Type */
    get finalPayeeAddressType(): Field | undefined;
    /** Final Payee Building Or Address Line 2 */
    get finalPayeeBuildingOrAddressLine2(): Field | undefined;
    /** Final Payee Country */
    get finalPayeeCountry(): Field | undefined;
    /** Final Payee Name */
    get finalPayeeName(): Field | undefined;
    /** Final Payee Place */
    get finalPayeePlace(): Field | undefined;
    /** Final Payee Postal Code */
    get finalPayeePostalCode(): Field | undefined;
    /** Final Payee Street Or Address Line 1 */
    get finalPayeeStreetOrAddressLine1(): Field | undefined;
    /** IBAN */
    get iban(): Field | undefined;
    /** Major Version */
    get majorVersion(): Field;
    /** Payee Address Type */
    get payeeAddressType(): Field | undefined;
    /** Payee Building Or Address Line 2 */
    get payeeBuildingOrAddressLine2(): Field | undefined;
    /** Payee Country */
    get payeeCountry(): Field | undefined;
    /** Payee Name */
    get payeeName(): Field | undefined;
    /** Payee Place */
    get payeePlace(): Field | undefined;
    /** Payee Postal Code */
    get payeePostalCode(): Field | undefined;
    /** Payee Street Or Address Line 1 */
    get payeeStreetOrAddressLine1(): Field | undefined;
    /** Payment Reference */
    get paymentReference(): Field | undefined;
    /** Payment Reference Type */
    get paymentReferenceType(): Field | undefined;
}
/** Medical Plan */
export declare class DEMedicalPlan {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Current Page */
    get currentPage(): Field;
    /** Document Version Number */
    get documentVersionNumber(): Field;
    /** GUID */
    get guid(): Field;
    /** Language Country Code */
    get languageCountryCode(): Field;
    /** Patch Version Number */
    get patchVersionNumber(): Field;
    /** Total Number Of Pages */
    get totalNumberOfPages(): Field;
    /** The child document of type "Patient". */
    get patient(): DEMedicalPlan.Patient;
    /** The child document of type "Doctor". */
    get doctor(): DEMedicalPlan.Doctor;
    /** An array of all children of type "Subheading". */
    get subheadings(): DEMedicalPlan.Subheading[];
}
export declare namespace DEMedicalPlan {
    /** Patient */
    class Patient {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
        /** Allergies And Intolerances */
        get allergiesAndIntolerances(): Field | undefined;
        /** Birth Date */
        get birthDate(): Field | undefined;
        /** Breast Feeding */
        get breastFeeding(): Field | undefined;
        /** Creatinine Value */
        get creatinineValue(): Field | undefined;
        /** First Name */
        get firstName(): Field | undefined;
        /** Gender */
        get gender(): Field | undefined;
        /** Height */
        get height(): Field | undefined;
        /** Last Name */
        get lastName(): Field | undefined;
        /** Patient Free Text */
        get patientFreeText(): Field | undefined;
        /** Patient ID */
        get patientID(): Field | undefined;
        /** Pre Name */
        get preName(): Field | undefined;
        /** Pregnant */
        get pregnant(): Field | undefined;
        /** Name Suffix */
        get suffix(): Field | undefined;
        /** Title */
        get title(): Field | undefined;
        /** Weight */
        get weight(): Field | undefined;
    }
    /** Doctor */
    class Doctor {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
        /** Doctor Number */
        get doctorNumber(): Field | undefined;
        /** Email */
        get email(): Field | undefined;
        /** Hospital ID */
        get hospitalID(): Field | undefined;
        /** Issuer Name */
        get issuerName(): Field | undefined;
        /** Issuing Date And Time */
        get issuingDateAndTime(): Field | undefined;
        /** Pharmacy ID */
        get pharmacyID(): Field | undefined;
        /** Place */
        get place(): Field | undefined;
        /** Postal Code */
        get postalCode(): Field | undefined;
        /** Street */
        get street(): Field | undefined;
        /** Telephone Number */
        get telephoneNumber(): Field | undefined;
    }
    /** Subheading */
    class Subheading {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
        /** General Note */
        get generalNotes(): Field[];
        /** Key Words */
        get keyWords(): Field | undefined;
        /** Subheading Free Text */
        get subheadingFreeText(): Field | undefined;
        /** An array of all children of type "Medicine". */
        get medicines(): DEMedicalPlan.Subheading.Medicine[];
        /** An array of all children of type "Prescription". */
        get prescriptions(): DEMedicalPlan.Subheading.Prescription[];
    }
    namespace Subheading {
        /** Medicine */
        class Medicine {
            private _document;
            get document(): GenericDocument;
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
            /** Dosage Form */
            get dosageForm(): Field | undefined;
            /** Dosage Form Free Text */
            get dosageFormFreeText(): Field | undefined;
            /** Dosage Free Text */
            get dosageFreeText(): Field | undefined;
            /** Dosing Unit */
            get dosingUnit(): Field | undefined;
            /** Dosing Unit Free Text */
            get dosingUnitFreeText(): Field | undefined;
            /** Drug Name */
            get drugName(): Field | undefined;
            /** Evening Intake Dose */
            get evening(): Field | undefined;
            /** General Notes */
            get generalNotes(): Field | undefined;
            /** Midday Intake Dose */
            get midday(): Field | undefined;
            /** Morning Intake Dose */
            get morning(): Field | undefined;
            /** Night Intake Dose */
            get night(): Field | undefined;
            /** Pharmaceutical Number */
            get pharmaceuticalNumber(): Field | undefined;
            /** Reason For Treatment */
            get reasonForTreatment(): Field | undefined;
            /** Relevant Info */
            get relevantInfo(): Field | undefined;
            /** An array of all children of type "Substance". */
            get substances(): DEMedicalPlan.Subheading.Medicine.Substance[];
        }
        namespace Medicine {
            /** Substance */
            class Substance {
                private _document;
                get document(): GenericDocument;
                constructor(document: GenericDocument);
                requiredDocumentType(): string;
                /** Active Substance */
                get activeSubstance(): Field | undefined;
                /** Potency */
                get potency(): Field | undefined;
            }
        }
        /** Prescription */
        class Prescription {
            private _document;
            get document(): GenericDocument;
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
            /** General Information */
            get generalInformation(): Field | undefined;
            /** Prescription Free Text */
            get prescriptionFreeText(): Field | undefined;
        }
    }
}
/** ID Card */
export declare class IDCardPDF417 {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Birth Date. The format is ISO8601 with delimiters */
    get birthDate(): Field;
    /** Date Expired. The format is ISO8601 with delimiters */
    get dateExpired(): Field;
    /** Date Issued. The format is ISO8601 with delimiters */
    get dateIssued(): Field;
    /** Document Code */
    get documentCode(): Field;
    /** First Name */
    get firstName(): Field;
    /** Last Name */
    get lastName(): Field;
    /** Optional */
    get optional(): Field;
}
/** GS1 */
export declare class GS1 {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** An array of all children of type "Element". */
    get elements(): GS1.Element[];
}
export declare namespace GS1 {
    /** GS1 Element */
    class Element {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
        /** Application Identifier */
        get applicationIdentifier(): Field;
        /** Data Title */
        get dataTitle(): Field;
        /** Description */
        get elementDescription(): Field;
        /** Raw Value */
        get rawValue(): Field;
        /** An array of all children of type "ValidationError". */
        get validationErrors(): GS1.Element.ValidationError[];
    }
    namespace Element {
        /** Validation Errors */
        class ValidationError {
            private _document;
            get document(): GenericDocument;
            constructor(document: GenericDocument);
            requiredDocumentType(): string;
            /** Error Code */
            get code(): Field;
            /** Reason */
            get reason(): Field;
        }
    }
}
/** SEPA */
export declare class SEPA {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Amount */
    get amount(): Field | undefined;
    /** Character Set */
    get characterSet(): Field;
    /** Identification */
    get identification(): Field;
    /** Information */
    get information(): Field | undefined;
    /** Amount */
    get purpose(): Field | undefined;
    /** Receiver BIC */
    get receiverBIC(): Field;
    /** Receiver IBAN */
    get receiverIBAN(): Field;
    /** Receiver Name */
    get receiverName(): Field;
    /** Remittance */
    get remittance(): Field | undefined;
    /** Service Tag */
    get serviceTag(): Field;
    /** Version */
    get version(): Field;
}
/** Medical Certificate */
export declare class MedicalCertificate {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Accident */
    get accident(): Field | undefined;
    /** Assigned To Accident Insurance Doctor */
    get assignedToAccidentInsuranceDoctor(): Field | undefined;
    /** Birth Date. The format is ISO8601 with delimiters */
    get birthDate(): Field | undefined;
    /** Child Needs Care From */
    get childNeedsCareFrom(): Field | undefined;
    /** Child Needs Care Until */
    get childNeedsCareUntil(): Field | undefined;
    /** Diagnose */
    get diagnose(): Field | undefined;
    /** Diagnosed On. The format is ISO8601 with delimiters */
    get diagnosedOn(): Field | undefined;
    /** Doctor Number */
    get doctorNumber(): Field | undefined;
    /** Document Date. The format is ISO8601 with delimiters */
    get documentDate(): Field | undefined;
    /** First Name */
    get firstName(): Field | undefined;
    /** Health Insurance Number */
    get healthInsuranceNumber(): Field | undefined;
    /** Incapable Of Work Since. The format is ISO8601 with delimiters */
    get incapableOfWorkSince(): Field | undefined;
    /** Incapable Of Work Until. The format is ISO8601 with delimiters */
    get incapableOfWorkUntil(): Field | undefined;
    /** Initial Certificate */
    get initialCertificate(): Field | undefined;
    /** Insured Person Number */
    get insuredPersonNumber(): Field | undefined;
    /** Last Name */
    get lastName(): Field | undefined;
    /** Place Of Operation Number */
    get placeOfOperationNumber(): Field | undefined;
    /** Renewed Certificate */
    get renewedCertificate(): Field | undefined;
    /** Requires Care */
    get requiresCare(): Field | undefined;
    /** Status */
    get status(): Field | undefined;
    /** Work Accident */
    get workAccident(): Field | undefined;
}
/** VCard */
export declare class VCard {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** The child document of type "Version". */
    get version(): VCard.Version;
    /** The child document of type "Source". */
    get source(): VCard.Source | undefined;
    /** The child document of type "Kind". */
    get kind(): VCard.Kind | undefined;
    /** The child document of type "XML". */
    get xml(): VCard.XML | undefined;
    /** The child document of type "Name". */
    get name(): VCard.Name | undefined;
    /** The child document of type "FirstName". */
    get firstName(): VCard.FirstName | undefined;
    /** The child document of type "Nickname". */
    get nickname(): VCard.Nickname | undefined;
    /** The child document of type "Birthday". */
    get birthday(): VCard.Birthday | undefined;
    /** The child document of type "Anniversary". */
    get anniversary(): VCard.Anniversary | undefined;
    /** The child document of type "Gender". */
    get gender(): VCard.Gender | undefined;
    /** The child document of type "DeliveryAddress". */
    get deliveryAddress(): VCard.DeliveryAddress | undefined;
    /** The child document of type "Photo". */
    get photo(): VCard.Photo | undefined;
    /** The child document of type "TelephoneNumber". */
    get telephoneNumber(): VCard.TelephoneNumber | undefined;
    /** The child document of type "Email". */
    get email(): VCard.Email | undefined;
    /** The child document of type "IMPP". */
    get impp(): VCard.IMPP | undefined;
    /** The child document of type "Languages". */
    get languages(): VCard.Languages | undefined;
    /** The child document of type "TimeZone". */
    get timeZone(): VCard.TimeZone | undefined;
    /** The child document of type "GeoLocation". */
    get geoLocation(): VCard.GeoLocation | undefined;
    /** The child document of type "Title". */
    get title(): VCard.Title | undefined;
    /** The child document of type "Role". */
    get role(): VCard.Role | undefined;
    /** The child document of type "Logo". */
    get logo(): VCard.Logo | undefined;
    /** The child document of type "Organisation". */
    get organisation(): VCard.Organisation | undefined;
    /** The child document of type "Member". */
    get member(): VCard.Member | undefined;
    /** The child document of type "Related". */
    get related(): VCard.Related | undefined;
    /** The child document of type "Categories". */
    get categories(): VCard.Categories | undefined;
    /** The child document of type "Note". */
    get note(): VCard.Note | undefined;
    /** The child document of type "ProductId". */
    get productId(): VCard.ProductId | undefined;
    /** The child document of type "Revision". */
    get revision(): VCard.Revision | undefined;
    /** The child document of type "Sound". */
    get sound(): VCard.Sound | undefined;
    /** The child document of type "UID". */
    get uid(): VCard.UID | undefined;
    /** The child document of type "ClientPIDMap". */
    get clientPIDMap(): VCard.ClientPIDMap | undefined;
    /** The child document of type "URL". */
    get url(): VCard.URL | undefined;
    /** The child document of type "PublicKey". */
    get publicKey(): VCard.PublicKey | undefined;
    /** The child document of type "BusyTimeURL". */
    get busyTimeURL(): VCard.BusyTimeURL | undefined;
    /** The child document of type "CalendarURIForRequests". */
    get calendarURIForRequests(): VCard.CalendarURIForRequests | undefined;
    /** The child document of type "CalendarURI". */
    get calendarURI(): VCard.CalendarURI | undefined;
    /** An array of all children of type "Custom". */
    get customs(): VCard.Custom[];
}
export declare namespace VCard {
    /** VCard Entry */
    abstract class Entry {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        abstract requiredDocumentType(): string;
        /** Raw Value */
        get rawValue(): Field;
        /** Type Modifier */
        get typeModifiers(): Field[];
        /** Value */
        get values(): Field[];
    }
    /** Version */
    class Version extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Source */
    class Source extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Kind */
    class Kind extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** XML */
    class XML extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Name */
    class Name extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** First Name */
    class FirstName extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Nickname */
    class Nickname extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Birthday */
    class Birthday extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Anniversary */
    class Anniversary extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Gender */
    class Gender extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Delivery Address */
    class DeliveryAddress extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Photo */
    class Photo extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Telephone Number */
    class TelephoneNumber extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Email */
    class Email extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** IMPP */
    class IMPP extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Languages */
    class Languages extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Time Zone */
    class TimeZone extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Geo Location */
    class GeoLocation extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Title */
    class Title extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Role */
    class Role extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Logo */
    class Logo extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Organisation */
    class Organisation extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Member */
    class Member extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Related */
    class Related extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Categories */
    class Categories extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Note */
    class Note extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** ProductId */
    class ProductId extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Revision */
    class Revision extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Sound */
    class Sound extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** UID */
    class UID extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Client PID Map */
    class ClientPIDMap extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** URL */
    class URL extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Public Key */
    class PublicKey extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Busy Time URL */
    class BusyTimeURL extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Calendar URI For Requests */
    class CalendarURIForRequests extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Calendar URI */
    class CalendarURI extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Custom */
    class Custom extends Entry {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
}
/** AAMVA */
export declare class AAMVA {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Issuer Identification Number */
    get issuerIdentificationNumber(): Field;
    /** Jurisdiction Version Number */
    get jurisdictionVersionNumber(): Field | undefined;
    /** Version */
    get version(): Field;
    /** The child document of type "TitleData". */
    get titleData(): AAMVA.TitleData | undefined;
    /** The child document of type "RegistrationData". */
    get registrationData(): AAMVA.RegistrationData | undefined;
    /** The child document of type "MotorCarrierData". */
    get motorCarrierData(): AAMVA.MotorCarrierData | undefined;
    /** The child document of type "RegistrantAndVehicleData". */
    get registrantAndVehicleData(): AAMVA.RegistrantAndVehicleData | undefined;
    /** The child document of type "VehicleOwnerData". */
    get vehicleOwnerData(): AAMVA.VehicleOwnerData | undefined;
    /** The child document of type "VehicleData". */
    get vehicleData(): AAMVA.VehicleData | undefined;
    /** The child document of type "VehicleSafetyInspectionData". */
    get vehicleSafetyInspectionData(): AAMVA.VehicleSafetyInspectionData | undefined;
    /** The child document of type "DriverLicense". */
    get driverLicense(): AAMVA.DriverLicense | undefined;
    /** The child document of type "IDCard". */
    get idCard(): AAMVA.IDCard | undefined;
    /** The child document of type "EnhancedDriverLicense". */
    get enhancedDriverLicense(): AAMVA.EnhancedDriverLicense | undefined;
    /** The child document of type "RawDocument". */
    get rawDocument(): AAMVA.RawDocument;
}
export declare namespace AAMVA {
    /** Title Data. File type "TD". */
    class TitleData {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
        /** Data element ID "NAT". City portion of the owner’s address. */
        get addressCity(): Field | undefined;
        /** Data element ID "NAU". Jurisdiction portion of the owner’s address. */
        get addressJurisdictionCode(): Field | undefined;
        /** Data element ID "NAR". Street portion of the owner’s address. */
        get addressStreet(): Field | undefined;
        /** Data element ID "NAV". The ZIP code or Postal code portion of the owner’s address. */
        get addressZipCode(): Field | undefined;
        /** Data element ID "BBC". The name of business that owns the vehicle. */
        get businessName(): Field | undefined;
        /** Data element ID "NAA". Family name (commonly called surname or last name) of the owner of the vehicle. */
        get familyName(): Field | undefined;
        /** Data element ID "LAF". A code that uniquely identifies the first holder of a lien. */
        get firstLienHolderId(): Field | undefined;
        /** Data element ID "LAA". Name of the first lien holder of the vehicle. */
        get firstLienHolderName(): Field | undefined;
        /** Data element ID "NAE". Given name or names (includes all of what are commonly referred to as first and middle names) of the owner of the vehicle. */
        get givenName(): Field | undefined;
        /** Data element ID "TAW". This code represents whether the vehicle/vessel is new or used. Note: jurisdictions’ definitions of these classifications may vary a little due to state regulations on demo vehicles, slates between dealers, application of state taxes, etc. N = New, U = Used. */
        get newUsedIndicator(): Field | undefined;
        /** Data element ID "TAH". The date the odometer reading was recorded by the jurisdiction. */
        get odometerDate(): Field | undefined;
        /** Data element ID "TAG". This is the federal odometer mileage disclosure. The mandatory information is: (1) Actual vehicle mileage; (2) Mileage exceeds mechanical limitations; (3) Not actual mileage; (4) Mileage disclosure not required. */
        get odometerDisclosure(): Field | undefined;
        /** Data element ID "TAI". This is the odometer reading registered with the DMV either at the time of titling or registration renewal in kilometers. */
        get odometerReadingKilometers(): Field | undefined;
        /** Data element ID "TAF". This is the odometer reading registered with the DMV either at the time of titling or registration renewal. */
        get odometerReadingMileage(): Field | undefined;
        /** Data element ID "TAZ". The title number assigned to the vehicle by the previous titling jurisdiction. */
        get previousTitleNumber(): Field | undefined;
        /** Data element ID "TPJ". The code for the jurisdiction (U.S., Canadian, or Mexican) that titled the vehicle immediately prior to the current titling jurisdiction. */
        get previousTitlingJurisdiction(): Field | undefined;
        /** Data element ID "TAY". Code providing information about the brand applied to the title. */
        get titleBrand(): Field | undefined;
        /** Data element ID "TAV". The date the jurisdiction’s titling authority issued a title to the owner of the vehicle. The format is CCYYMMDD. */
        get titleIssueDate(): Field | undefined;
        /** Data element ID "TAA". The date the jurisdiction’s titling authority issued a title to the owner of the vehicle. The format is CCYYMMDD. */
        get titleNumber(): Field | undefined;
        /** Data element ID "TAC". A unique set of alphanumeric characters assigned by the titling jurisdiction to the certificate of title of a vehicle. */
        get titlingJurisdiction(): Field | undefined;
        /** Data element ID "VAO". The general configuration or shape of a vehicle distinguished by characteristics such as number of doors, seats, windows, roofline, and type of top. The vehicle body type is 2-character alphanumeric. */
        get vehicleBodyStyle(): Field | undefined;
        /** Data element ID "VBD". Where the vehicle/vessel is one color, this is the appropriate code describing that color. When the vehicle is two colors, this is the code for the top-most or front-most color. */
        get vehicleColor(): Field | undefined;
        /** Data element ID "VAD". A unique combination of alphanumeric characters that identifies a specific vehicle or component. The VIN is affixed to the vehicle in specific locations and formulated by the manufacturer. State agencies under some controlled instances may assign a VIN to a vehicle. */
        get vehicleIdentificationNumber(): Field | undefined;
        /** Data element ID "VAK". The distinctive (coded) name applied to a group of vehicles by a manufacturer. */
        get vehicleMake(): Field | undefined;
        /** Data element ID "VAM". A code denoting a family of vehicles (within a make), which has a degree of similarity in construction, such as body, chassis, etc. The field does not necessarily contain a standard code; it may contain a value provided by the originator of the field. */
        get vehicleModel(): Field | undefined;
        /** Data element ID "VAL". The year that is assigned to a vehicle by the manufacturer. The format is CCYY. */
        get vehicleModelYear(): Field | undefined;
        /** Data element ID "TAU". The date a vehicle was purchased by the current owner. The format is ISO8601 with delimiters. */
        get vehiclePurchaseDate(): Field | undefined;
    }
    /** Registration Data. File type "RG". */
    class RegistrationData {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
        /** Data element ID "RBK". City portion of the owner’s address. */
        get addressCity(): Field | undefined;
        /** Data element ID "RBL". Jurisdiction portion of the owner’s address. */
        get addressJurisdictionCode(): Field | undefined;
        /** Data element ID "RBI". Street portion of the owner’s address. */
        get addressStreet(): Field | undefined;
        /** Data element ID "RBM". The Zip code or Postal code of the vehicle owner’s residence address. */
        get addressZipCode(): Field | undefined;
        /** Data element ID "VBC". The number of common axles of rotation of one or more wheels of a vehicle, whether power driven or freely rotating. */
        get axles(): Field | undefined;
        /** Data element ID "BBC". The business name of the first registrant of a vehicle. */
        get businessName(): Field | undefined;
        /** Data element ID "FUL". The type of fuel used by the vehicle. In most cases, the fuel type would be diesel. */
        get fuel(): Field | undefined;
        /** Data element ID "VAT". The unladen weight of the vehicle (e.g., the single-unit truck, truck combination) plus the weight of the load being carried at a specific point in time. */
        get grossVehicleWeight(): Field | undefined;
        /** Data element ID "RBD". Family name (commonly called surname or last name) of the registered owner of a vehicle. */
        get registrantFamilyName(): Field | undefined;
        /** Data element ID "RBE". Given name or names (includes all of what are commonly referred to as first and middle names) of the registered owner of a vehicle. */
        get registrantGivenName(): Field | undefined;
        /** Data element ID "RAG". The date in which the registration expired. The format is ISO8601 with delimiters. */
        get registrationExpiryDate(): Field | undefined;
        /** Data element ID "RBB". The date in which the registration was issued. The format is ISO8601 with delimiters. */
        get registrationIssueDate(): Field | undefined;
        /** Data element ID "RAM". The characters assigned to a registration plate or tag affixed to the vehicle, assigned by the jurisdiction. */
        get registrationPlateNumber(): Field | undefined;
        /** Data element ID "RBU". A unique number printed on the tab/decal and stored as part of the registration record. */
        get registrationWindowStickerDecal(): Field | undefined;
        /** Data element ID "RBT". The year of registration. */
        get registrationYear(): Field | undefined;
        /** Data element ID "VAO". The general configuration or shape of a vehicle distinguished by characteristics such as number of doors, seats, windows, roofline, and type of top. The vehicle body type is 2-character alphanumeric. */
        get vehicleBodyStyle(): Field | undefined;
        /** Data element ID "VBD". Where the vehicle is one color, this is the appropriate code describing that color. When the vehicle is two colors, this is the code for the top-most or front-most color. */
        get vehicleColor(): Field | undefined;
        /** Data element ID "VAD". A unique combination of alphanumeric characters that identifies a specific vehicle or component. The VIN is affixed to the vehicle in specific locations and formulated by the manufacturer. State agencies under some controlled instances my assign a VIN to a vehicle. */
        get vehicleIdentificationNumber(): Field | undefined;
        /** Data element ID "VAK". The distinctive (coded) name applied to a group of vehicles by a manufacturer. */
        get vehicleMake(): Field | undefined;
        /** Data element ID "VAM". A code denoting a family of vehicles (within a make), which has a degree of similarity in construction, such as body, chassis, etc. The field does not necessarily contain a standard code; it may contain a value provided by the originator of the field. */
        get vehicleModel(): Field | undefined;
        /** Data element ID "VAL". The year which is assigned to a vehicle by the manufacturer. The format is CCYY. */
        get vehicleModelYear(): Field | undefined;
        /** Data element ID "VPC". Indicates the use of the vehicle. */
        get vehicleUse(): Field | undefined;
    }
    /** Motor Carrier Data. File type "MC". */
    class MotorCarrierData {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
        /** Data element ID "MAA". The name of the carrier responsible for safety. This can be an individual, partnership or corporation responsible for the transportation of persons or property. This is the name that is recognized by law. */
        get carrierName(): Field | undefined;
        /** Data element ID "MAL". This is the city for the mailing address of the individual carrier. This information is utilized by the base jurisdiction to send information to the carrier that purchased the IRP credentials. */
        get city(): Field | undefined;
        /** Data element ID "MAI". This is the jurisdiction of the residential address of the individual carrier. This information is utilized by the base jurisdiction to send information to the carrier that purchased the IRP credentials. */
        get jurisdiction(): Field | undefined;
        /** Data element ID "MAK". This is the mailing address of the individual carrier. This information is utilized by the base jurisdiction to send information to the carrier that purchased the IRP credentials. */
        get streetAddress(): Field | undefined;
        /** Data element ID "MAN". A unique identifier assigned to the carrier responsible for safety issued by the U.S. Department of Transportation – Federal Motor Carrier Safety Administration. */
        get usdotNumber(): Field | undefined;
        /** Data element ID "MAO". The ZIP or Postal code of the resident address of the vehicle owner. */
        get zip(): Field | undefined;
    }
    /** Registrant And Vehicle Data. File type "IR". */
    class RegistrantAndVehicleData {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
        /** Data element ID "RBI". The first line of the registrant’s residence address. */
        get address(): Field | undefined;
        /** Data element ID "RAU". The declared base jurisdiction registration weight. */
        get baseJurisdictionRegisteredWeight(): Field | undefined;
        /** Data element ID "RBC". The name of the first registrant of a vehicle. Registrant’s name may be a combined individual name or the name of a business */
        get carrierNameRegistrant(): Field | undefined;
        /** Data element ID "RBK". The registrant’s residence city name. */
        get city(): Field | undefined;
        /** Data element ID "VAT". The unladen weight of the vehicle (e.g., single-unit truck, truck combination) plus the weight of the maximum load for which vehicle registration fees have been paid within a particular jurisdiction. */
        get grossVehicleWeight(): Field | undefined;
        /** Data element ID "RBL". The state or province of the registrant’s residence address. */
        get jurisdiction(): Field | undefined;
        /** Data element ID "VAL". The year which is assigned to a vehicle by the manufacturer. The format is YY. */
        get modelYear(): Field | undefined;
        /** Data element IDs "RAP", "VBC". The seat capacity of a commercial vehicle designed for transportation of more than then passengers. The number of common axles of rotation of one or more wheels of a vehicle, whether power design or freely rotating. */
        get numberOfSeats(): Field | undefined;
        /** Data element ID "RAD". The number assigned to the registration decal in those jurisdictions that issue decals. */
        get registrationDecalNumber(): Field | undefined;
        /** Data element ID "RAF". The registration enforcement date is the date that the current registration was enforced. This may or may not be the original registration date. The format is ISO8601 with delimiters */
        get registrationEnforcementDate(): Field | undefined;
        /** Data element ID "RAG". The date in which the registration expired. The format is ISO8601 with delimiters. */
        get registrationExpirationDate(): Field | undefined;
        /** Data element ID "IFJ". The date in which the registration was issued. The format is ISO8601 with delimiters. */
        get registrationIssueDate(): Field | undefined;
        /** Data element ID "RAM". The characters assigned to a registration plate or tag affixed to the vehicle, assigned by the jurisdiction. */
        get registrationPlateNumber(): Field | undefined;
        /** Data element ID "RBT". This field is the registration year assigned by the jurisdiction. The format is CCYY. */
        get registrationYear(): Field | undefined;
        /** Data element ID "VBB". The type of vehicle operated for the transportation of persons or property in the furtherance of any commercial or industrial enterprise, for hire or not for hire. Not all states will use all values. */
        get typeOfVehicle(): Field | undefined;
        /** Data element ID "IEG". A number, assigned by the registrant of the commercial vehicle or trailer, to identify the vehicle or trailer in the fleet. No two units in a fleet can have the same number. A.K.A vehicle unit number or owner’s equipment number. */
        get unitNumber(): Field | undefined;
        /** Data element ID "VAD". A unique combination of alphanumeric characters that identifies a specific vehicle or component. The VIN is affixed to the vehicle in specific locations and formulated by the manufacturer. State agencies under some controlled instances may assign a VIN to a vehicle. */
        get vehicleIdentificationNumber(): Field | undefined;
        /** Data element ID "VAK". The distinctive (coded) name applied to a group of vehicles by a manufacturer. */
        get vehicleMake(): Field | undefined;
        /** Data element ID "RBM". The ZIP or Postal code of the resident address of the registrant. */
        get zipCode(): Field | undefined;
    }
    /** Vehicle Owner Data. File type "OW". */
    class VehicleOwnerData {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
        /** Data element ID "NAX". The unique customer number/ID of the first vehicle owner. */
        get firstOwnerIdNumber(): Field | undefined;
        /** Data element ID "NAB". Last Name or Surname of the Owner. Hyphenated names acceptable, spaces between names acceptable, but no other use of special symbols. */
        get firstOwnerLastName(): Field | undefined;
        /** Data element ID "NBA". The legal status of the first vehicle owner. This is only used when a vehicle has multiple owners. A legal status may be ("AND", "OR"). */
        get firstOwnerLegalStatus(): Field | undefined;
        /** Data element ID "NAD". Middle Name(s) or Initial(s) of the Owner. Hyphenated names acceptable, spaces, between names acceptable, but no other use of special symbols. */
        get firstOwnerMiddleName(): Field | undefined;
        /** Data element ID "NAC". First Name or Given Name of the Owner. Hyphenated names acceptable, but no other use of special symbols. */
        get firstOwnerName(): Field | undefined;
        /** Data element ID "NAA". Name of the (or one of the) individual(s) who owns the Vehicle as defined in the ANSI D- 20 Data Element Dictionary. (Lastname@Firstname@MI@Suffix if any.) */
        get firstOwnerTotalName(): Field | undefined;
        /** Data element ID "NAR". Street address line 1. (Mailing) */
        get mailingAddress1(): Field | undefined;
        /** Data element ID "NAS". Street address line 2. (Mailing) */
        get mailingAddress2(): Field | undefined;
        /** Data element ID "NAT". Name of city for mailing address. */
        get mailingCity(): Field | undefined;
        /** Data element ID "NAU". Jurisdiction code for mailing address. Conforms to Canadian, Mexican and US jurisdictions as appropriate. Codes for provinces (Canada) and states (US and Mexico). */
        get mailingJurisdictionCode(): Field | undefined;
        /** Data element ID "NAV". The ZIP code or Postal code used for mailing. (As used by Canadian, Mexican and US jurisdictions.) */
        get mailingZipCode(): Field | undefined;
        /** Data element ID "NAM". Street address line 1. (Mailing) */
        get residenceAddress1(): Field | undefined;
        /** Data element ID "NAN". Street address line 2. (Mailing) */
        get residenceAddress2(): Field | undefined;
        /** Data element ID "NAO". Name of city for mailing address. */
        get residenceCity(): Field | undefined;
        /** Data element ID "NAP". Jurisdiction code for mailing address. Conforms to Canadian, Mexican and US jurisdictions as appropriate. Codes for provinces (Canada) and states (US and Mexico). */
        get residenceJurisdictionCode(): Field | undefined;
        /** Data element ID "NAQ". The ZIP code or Postal code used for mailing. (As used by Canadian, Mexican and US jurisdictions). */
        get residenceZipCode(): Field | undefined;
        /** Data element ID "NAY". The unique customer number/ID of the second vehicle owner. */
        get secondOwnerIdNumber(): Field | undefined;
        /** Data element ID "NAF". Last Name or Surname of the Owner. Hyphenated names acceptable, spaces between names acceptable, but no other use of special symbols. */
        get secondOwnerLastName(): Field | undefined;
        /** Data element ID "NBB". The legal status of the second vehicle owner. This is only used when a vehicle has multiple owners. A legal status may be ("AND", "OR"). */
        get secondOwnerLegalStatus(): Field | undefined;
        /** Data element ID "NAH". Middle Name(s) or Initial(s) of the Owner. Hyphenated names acceptable, spaces between names acceptable, but no other use of special symbols. */
        get secondOwnerMiddleName(): Field | undefined;
        /** Data element ID "NAG". First Name or Given Name of the Owner. Hyphenated names acceptable, but no other use of special symbols. */
        get secondOwnerName(): Field | undefined;
        /** Data element ID "NAE". Name of the (or one of the) individual(s) who owns the Vehicle as defined in the ANSI D- 20 Data Element Dictionary. (Lastname@Firstname@MI@Suffix if any.) */
        get secondOwnerTotalName(): Field | undefined;
    }
    /** Vehicle Data. File type "VH". */
    class VehicleData {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
        /** Data element ID "VAO". Vehicle manufacture body style. */
        get bodyStyle(): Field | undefined;
        /** Data element ID "VAG". Date vehicle reported junked. The format is ISO8601 with delimiters. */
        get dateJunked(): Field | undefined;
        /** Data element ID "VAJ". Date vehicle reported recovered. The format is ISO8601 with delimiters. */
        get dateRecovered(): Field | undefined;
        /** Data element ID "VAI". Date vehicle reported stolen. The format is ISO8601 with delimiters. */
        get dateStolen(): Field | undefined;
        /** Data element ID "VAW". Manufacturer’s rated engine displacement. */
        get engineDisplacement(): Field | undefined;
        /** Data element ID "VAR". The size of a vehicle’s engine. */
        get engineSize(): Field | undefined;
        /** Data element ID "VAN". Type of fuel the vehicle utilizes. */
        get fuelType(): Field | undefined;
        /** Data element ID "VAU". Manufacturer’s rated horsepower. */
        get horsepower(): Field | undefined;
        /** Data element ID "VAY". International fuel tax indicator */
        get iftaIndicator(): Field | undefined;
        /** Data element ID "VAX". International registration plan indicator. */
        get irpIndicator(): Field | undefined;
        /** Data element ID "VAF". Vehicle has been junked. */
        get junkedIndicator(): Field | undefined;
        /** Data element ID "VAE". Manufacturer’s Suggested Retail Price. No decimal places. Right Justified Zero or space fill. */
        get msrp(): Field | undefined;
        /** Data element ID "VAA". State to provide definition. */
        get majorCode(): Field | undefined;
        /** Data element ID "VAL". Vehicle manufacture year. */
        get makeYear(): Field | undefined;
        /** Data element ID "VAT". Manufacturer’s gross vehicle weight rating. */
        get manufactureGrossWeight(): Field | undefined;
        /** Data element ID "VAB". State to provide definition. */
        get minorCode(): Field | undefined;
        /** Data element ID "VBC". Number of axles the vehicle has. */
        get numberOfAxles(): Field | undefined;
        /** Data element ID "VAQ". Number of cylinders the vehicle has. */
        get numberOfCylinders(): Field | undefined;
        /** Data element ID "VAP". Number of doors on the vehicle. */
        get numberOfDoors(): Field | undefined;
        /** Data element ID "VAH". Indicates stolen vehicle. */
        get stolenIndicator(): Field | undefined;
        /** Data element ID "VAC". Type of transmission the vehicle carries. */
        get transmissionCode(): Field | undefined;
        /** Data element ID "VAV". Gross weight of the vehicle unloaded. */
        get unladenWeight(): Field | undefined;
        /** Data element ID "VAZ". Vehicle license tax calculation from date of purchase. */
        get vltClacFromDate(): Field | undefined;
        /** Data element ID "VBA". Unique number to identify the vehicle record. */
        get vehicleIdNumber(): Field | undefined;
        /** Data element ID "VAD". A unique combination of alphanumeric characters that identifies a specific vehicle or component. The VIN is affixed to the vehicle in specific locations and formulated by the manufacturer. State agencies under some controlled instances may assign a VIN to a vehicle. */
        get vehicleIdentificationNumber(): Field | undefined;
        /** Data element ID "VAK". The distinctive (coded) name applied to a group of vehicles by a manufacturer. */
        get vehicleMake(): Field | undefined;
        /** Data element ID "VAM". Vehicle manufacture model. */
        get vehicleModel(): Field | undefined;
        /** Data element ID "VAS". This is the status of the vehicle (e.g., active, suspend, etc.) */
        get vehicleStatusCode(): Field | undefined;
        /** Data element ID "VBB". EPA vehicle classification. */
        get vehicleTypeCode(): Field | undefined;
    }
    /** Vehicle Safety Inspection Data. File type "VS". */
    class VehicleSafetyInspectionData {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
        /** Data element ID "IAN". The street name and number, city, state and zip code of the inspection facility. */
        get inspectionAddress(): Field | undefined;
        /** Data element ID "IPD". Identifies whether the pollution control devices meet the minimum inspection criteria. */
        get inspectionAirPollutionDeviceConditions(): Field | undefined;
        /** Data element ID "IFI". The unique number assigned to an inspection facility. */
        get inspectionFacilityIdentifier(): Field | undefined;
        /** Data element ID "INC". A unique number assigned to a current vehicle inspection form for identification purposes or a preprinted unique number on the motor vehicle inspection sticker currently issued to a motor vehicle which has passed inspection. */
        get inspectionFormOrStickerNumberCurrent(): Field | undefined;
        /** Data element ID "INP". The number of the last inspection form excluding the current inspection or the certification number of the last inspection sticker, excluding the current inspection. */
        get inspectionFormOrStickerNumberPrevious(): Field | undefined;
        /** Data element ID "ISC". An indicator that specifies whether or not the vehicle has a current smog certificate. */
        get inspectionSmogCertificateIndicator(): Field | undefined;
        /** Data element ID "ISN". Station number performing the inspection. */
        get inspectionStationNumber(): Field | undefined;
        /** Data element ID "IIN". A unique number assigned to each licensed vehicle inspector. */
        get inspectorIdentificationNumber(): Field | undefined;
        /** Data element ID "ORI". The vehicle’s odometer reading (to the nearest mile or kilometer) at the time of inspection. */
        get odometerReadingAtInspection(): Field | undefined;
        /** Data element ID "VAO". The general configuration or shape of a vehicle distinguished by characteristics such as number of doors, seats, windows, roofline, and type of top. The vehicle body type is 2- character alphanumeric. */
        get vehicleBodyType(): Field | undefined;
        /** Data element ID "VAK". The distinctive (coded) name applied to a group of vehicles by a manufacturer. */
        get vehicleMake(): Field | undefined;
        /** Data element ID "VAL". The year which is assigned to a vehicle by the manufacturer. The format is CCYY. */
        get vehicleModelYear(): Field | undefined;
    }
    /** Driver License Or ID Document */
    abstract class DLID {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        abstract requiredDocumentType(): string;
        /** Data element ID "DAI". City portion of the cardholder address. */
        get addressCity(): Field | undefined;
        /** Data element ID "DAJ". State portion of the cardholder address. */
        get addressJurisdictionCode(): Field | undefined;
        /** Data element ID "DAK". Postal code portion of the cardholder address in the U.S. and Canada. If the trailing portion of the postal code in the U.S. is not known, zeros will be used to fill the trailing set of numbers up to nine (9) digits. */
        get addressPostalCode(): Field | undefined;
        /** Data element ID "DAG". Street portion of the cardholder address. */
        get addressStreet1(): Field | undefined;
        /** Data element ID "DAH". Second line of street portion of the cardholder address. */
        get addressStreet2(): Field | undefined;
        /** Data element ID "DCJ". A string of letters and/or numbers that identifies when, where, and by whom a driver license/ID card was made. If audit information is not used on the card or the MRT, it must be included in the driver record. */
        get adultInformation(): Field | undefined;
        /** Data element ID "DBN". Other family name by which cardholder is known. */
        get aliasFamilyName(): Field | undefined;
        /** Data element ID "DBG". Other given name by which cardholder is known. */
        get aliasGivenName(): Field | undefined;
        /** Data element ID "DBQ". Other middle name by which cardholder is known. */
        get aliasMiddleName(): Field | undefined;
        /** Data element ID "DBR". Other prefix by which cardholder is known. */
        get aliasPrefixName(): Field | undefined;
        /** Data element ID "DBS". Other suffix by which cardholder is known. */
        get aliasSuffixName(): Field | undefined;
        /** Data element ID "DDB". DHS required field that indicates date of the most recent version change or modification to the visible format of the DL/ID. The format is ISO8601 with delimiters. */
        get cardRevisionDate(): Field | undefined;
        /** Data element ID "DDA". DHS required field that indicates compliance: "F" = compliant; and, "N" = non-compliant. */
        get complianceType(): Field | undefined;
        /** Data element ID "DCG". Country in which DL/ID is issued. U.S. = USA, Canada = CAN. */
        get countryIdentification(): Field | undefined;
        /** Data element ID "DCS". Family name of the cardholder. (Family name is sometimes also called “last name” or “surname.”) Collect full name for record, print as many characters as possible on portrait side of DL/ID. */
        get customerFamilyName(): Field | undefined;
        /** Data element ID "DAC". First name of the cardholder. */
        get customerFirstName(): Field | undefined;
        /** Data element ID "DCT". Given names of the cardholder. (Given names include all names other than the Family Name. This includes all those names sometimes also called “first” and “middle” names.) */
        get customerGivenNames(): Field | undefined;
        /** Data element ID "DAQ". The number assigned or calculated by the issuing authority. */
        get customerIdNumber(): Field | undefined;
        /** Data element ID "DAD". Middle name(s) of the cardholder. In the case of multiple middle names they shall be separated by a comma “,”. */
        get customerMiddleName(): Field | undefined;
        /** Data element ID "DBB". Date on which the cardholder was born. The format is ISO8601 with delimiters. */
        get dateOfBirth(): Field | undefined;
        /** Data element ID "DCF". Number must uniquely identify a particular document issued to that customer from others that may have been issued in the past. This number may serve multiple purposes of document discrimination, audit information number, and/or inventory control. */
        get documentDiscriminator(): Field | undefined;
        /** Data element ID "DBA". Date on which the driving and identification privileges granted by the document are no longer valid. The format is ISO8601 with delimtiers. */
        get documentExpirationDate(): Field | undefined;
        /** Data element ID "DBD". Date on which the document was issued. The format is ISO8601 with delimiters. */
        get documentIssueDate(): Field | undefined;
        /** Data element ID "DBL". Alternative dates given as date of birth. */
        get driverAliasDateOfBirthField(): Field | undefined;
        /** Data element ID "DBP". Alternative fist name or given name of the individual holding the Driver License or ID. Hyphenated names acceptable, but no other use of special symbols. */
        get driverAliasFirstName(): Field | undefined;
        /** Data element ID "DBO". Alternative last name or surname of the individual holding the Driver License or ID. Hyphenated names acceptable, but no other use of special symbols. */
        get driverAliasLastName(): Field | undefined;
        /** Data element ID "DBM". DriverAliasSocialSecurityNumber */
        get driverAliasSocialSecurityNumber(): Field | undefined;
        /** Data element ID "DAB". Last name or surname of the individual holding the Driver License or ID. Hyphenated names acceptable, but no other use of special symbols. */
        get driverLastName(): Field | undefined;
        /** Data element ID "DAR". A=Class A; B=Class B; C=Class C (Class A, B and C are defined by Federal Highway regulations); M=Class M motorcycle as defined by AAMVA; others are defined by DL Classification Code Standards. */
        get driverLicenseClassificationCode(): Field | undefined;
        /** Data element ID "DAT". Any endorsements on a driver license which authorize the operation of specified types of vehicles or the operation of vehicles carrying specified loads. Endorsements shall be specific to classification of a driver license. */
        get driverLicenseEndorsementsCode(): Field | undefined;
        /** Data element ID "DAA". Name of the individual holding the Driver License or ID as defined in ANSI D20 Data Dictionary. (Lastname@Firstname@MI@ suffix if any) (Machine, Mag Stripe uses ‘$’ and Bar Code uses ‘,’ in place of ‘@’) Firstname, Middle Initial, Lastname (Human) */
        get driverLicenseName(): Field | undefined;
        /** Data element ID "DAS". A restriction applicable to a driver license. */
        get driverLicenseRestrictionCode(): Field | undefined;
        /** Data element ID "DAF". Prefix to Driver Name. Not defined in ANSI D20. Freeform as defined by issuing jurisdiction. */
        get driverNamePrefix(): Field | undefined;
        /** Data element ID "DAE". An affix occurring at the end of a word, e.g.; Sr., Jr., II, III, IV, etc. */
        get driverNameSuffix(): Field | undefined;
        /** Data element ID "PAA". Identifies the type of permit as defined by ANSI D20. */
        get driverPermitClassificationCode(): Field | undefined;
        /** Data element ID "PAF". Permit endorsements as defined by ANSI D20. */
        get driverPermitEndorsementCode(): Field | undefined;
        /** Data element ID "PAD".  Date permit was issued. The format is ISO8601 with delimiters. */
        get driverPermitIssueDate(): Field | undefined;
        /** Data element ID "PAE". Permit restrictions as defined by ANSI D20. */
        get driverPermitRestrictionCode(): Field | undefined;
        /** Data element ID "DAN". Name of city for mailing address. */
        get driverResidenceCity(): Field | undefined;
        /** Data element ID "DAO". Jurisdiction code for mailing address. Conforms to Canadian, Mexican and US Jurisdictions as appropriate. Codes for provinces (Canada) and states (US and Mexico). */
        get driverResidenceJurisdictionCode(): Field | undefined;
        /** Data element ID "DAP". Postal code of residence */
        get driverResidencePostalCode(): Field | undefined;
        /** Data element ID "DAL". Street address line 1 (mailing). */
        get driverResidenceStreetAddress1(): Field | undefined;
        /** Data element ID "DAM". Street address line 2 (mailing). */
        get driverResidenceStreetAddress2(): Field | undefined;
        /** Data element ID "DDE". A code that indicates whether a field has been truncated (T), has not been truncated (N), or – unknown whether truncated (U). */
        get familyNameTruncation(): Field | undefined;
        /** Data element ID "DCH". Federal Commercial Vehicle Codes */
        get federalCommercialVehicleCodes(): Field | undefined;
        /** Data element ID "DDF". A code that indicates whether a field has been truncated (T), has not been truncated (N), or – unknown whether truncated (U). */
        get firstNameTruncation(): Field | undefined;
        /** Data element ID "DDC". Date on which the hazardous material endorsement granted by the document is no longer valid. The format is ISO8601 with delimiters. */
        get hazmatEndorsementExpirationDate(): Field | undefined;
        /** Data element ID "DAZ". Color of cardholder's hair. ANSI D-20 codes converted to human readable format according to the ANSI D20 Data Dictionary. */
        get hairColor(): Field | undefined;
        /** Data element ID "DAV". Height in centimeters */
        get height(): Field | undefined;
        /** Data element ID "DCK". A string of letters and/or numbers that is affixed to the raw materials (card stock, laminate, etc.) used in producing driver licenses and ID cards. (DHS recommended field). */
        get inventoryControlNumber(): Field | undefined;
        /** Data element ID "DBE". A string used by some jurisdictions to validate the document against their data base. */
        get issueTimeStamp(): Field | undefined;
        /** Data element ID "DCQ". Text that explains the jurisdiction-specific code(s) that indicates additional driving privileges granted to the cardholder beyond the vehicle class. */
        get jurisdictionSpecificEndorsementCodeDescription(): Field | undefined;
        /** Data element ID "DCD". Jurisdiction-specific codes that represent additional privileges granted to the cardholder beyond the vehicle class (such as transportation of passengers, hazardous materials, operation of motorcycles, etc.). */
        get jurisdictionSpecificEndorsementCodes(): Field | undefined;
        /** Data element ID "DCR". Text describing the jurisdiction-specific restriction code(s) that curtail driving privileges. */
        get jurisdictionSpecificRestrictionCodeDescription(): Field | undefined;
        /** Data element ID "DCB". Jurisdiction-specific codes that represent restrictions to driving privileges (such as airbrakes, automatic transmission, daylight only, etc.). */
        get jurisdictionSpecificRestrictionCodes(): Field | undefined;
        /** Data element ID "DCA". Jurisdiction-specific vehicle class / group code, designating the type of vehicle the cardholder has privilege to drive. */
        get jurisdictionSpecificVehicleClass(): Field | undefined;
        /** Data element ID "DCP". Text that explains the jurisdiction-specific code(s) for classifications of vehicles cardholder is authorized to drive. */
        get jurisdictionSpecificVehicleClassificationDescription(): Field | undefined;
        /** Data element ID "DDD". DHS required field that indicates that the cardholder has temporary lawful status = "1". */
        get limitedDurationDocumentIndicator(): Field | undefined;
        /** Data element ID "DDG". A code that indicates whether a field has been truncated (T), has not been truncated (N), or – unknown whether truncated (U). */
        get middleNameTruncation(): Field | undefined;
        /** Data element ID "DCU". Name Suffix (If jurisdiction participates in systems requiring name suffix (PDPS, CDLIS, etc.), the suffix must be collected and displayed on the DL/ID and in the MRT). Collect full name for record, print as many characters as possible on portrait side of DL/ID. JR (Junior), SR (Senior), 1ST or I (First), 2ND or II (Second),  3RD or III (Third),  4TH or IV (Fourth), 5TH or V (Fifth), 6TH or VI (Sixth), 7TH or VII (Seventh), 8TH or VIII (Eighth), 9TH or IX (Ninth). */
        get nameSuffix(): Field | undefined;
        /** Data element ID "DBI". "Y"; Used by some jurisdictions to indicate holder of the document is a non-resident. */
        get nonResidentIndicator(): Field | undefined;
        /** Data element ID "DBF". Number of duplicate cards issued for a license or ID if any. */
        get numberOfDuplicates(): Field | undefined;
        /** Data element ID "DBH". Organ Donor */
        get organDonor(): Field | undefined;
        /** Data element ID "DDK". Field that indicates that the cardholder is an organ donor = "1". */
        get organDonorIndicator(): Field | undefined;
        /** Data element ID "PAB". Date permit expires, The format is ISO8601 with delimiters. */
        get permitExpirationDate(): Field | undefined;
        /** Data element ID "PAC". Type of permit. */
        get permitIdentifier(): Field | undefined;
        /** Data element ID "DAY". Color of cardholder's eyes. ANSI D-20 codes converted to human readable format according to the ANSI D20 Data Dictionary. */
        get physicalDescriptionEyeColor(): Field | undefined;
        /** Data element ID "DAU". Height of cardholder. Inches (in): number of inches followed by " in" or Centimeters (cm): number of centimeters followed by " cm." */
        get physicalDescriptionHeight(): Field | undefined;
        /** Data element ID "DBC". Gender of the cardholder. "Male" or "Female". */
        get physicalDescriptionSex(): Field | undefined;
        /** Data element ID "DCE". Indicates the approximate weight range of the cardholder: 0 = up to 31 kg (up to 70 lbs), 1 = 32 – 45 kg (71 – 100 lbs), 2 = 46 - 59 kg (101 – 130 lbs), 3 = 60 - 70 kg (131 – 160 lbs), 4 = 71 - 86 kg (161 – 190 lbs), 5 = 87 - 100 kg (191 – 220 lbs), 6 = 101 - 113 kg (221 – 250 lbs), 7 = 114 - 127 kg (251 – 280 lbs), 8 = 128 – 145 kg (281 – 320 lbs), 9 = 146+ kg (321+ lbs). */
        get physicalDescriptionWeightRange(): Field | undefined;
        /** Data element ID "DCI". Country and municipality and/or state/province. */
        get placeOfBirth(): Field | undefined;
        /** Data element ID "DCL". Codes for race or ethnicity of the cardholder. ANSI D-20 codes converted to human readable format according to the ANSI D20 Data Dictionary. */
        get raceEthnicity(): Field | undefined;
        /** Data element ID "DBK". The number assigned to an individual by the Social Security Administration. */
        get socialSecurityNumber(): Field | undefined;
        /** Data element ID "DCN". Standard endorsement code(s) for cardholder. See codes in D20. This data element is a placeholder for future efforts to standardize endorsement codes. */
        get standardEndorsementCode(): Field | undefined;
        /** Data element ID "DCO". Standard restriction code(s) for cardholder. See codes in D20. This data element is a placeholder for future efforts to standardize restriction codes. */
        get standardRestrictionCode(): Field | undefined;
        /** Data element ID "DCM". Standard vehicle classification code(s) for cardholder. This data element is a placeholder for future efforts to standardize vehicle classifications. */
        get standardVehicleClassification(): Field | undefined;
        /** Data element ID "DDH". Date on which the cardholder turns 18 years old. The format is ISO8601 with delimiters. */
        get under18Until(): Field | undefined;
        /** Data element ID "DDI". Date on which the cardholder turns 19 years old. The format is ISO8601 with delimiters. */
        get under19Until(): Field | undefined;
        /** Data element ID "DDJ". Date on which the cardholder turns 21 years old. The format is ISO8601 with delimiters. */
        get under21Until(): Field | undefined;
        /** Data element ID "DBJ". A number or alphanumeric string used by some jurisdictions to identify a "customer" across multiple data bases. */
        get uniqueCustomerIdentifier(): Field | undefined;
        /** Data element ID "DDL". Field that indicates that the cardholder is a veteran = "1". */
        get veteranIndicator(): Field | undefined;
        /** Data element ID "DAX". Cardholder weight in kilograms Ex. 84 kg = "084" */
        get weightKilograms(): Field | undefined;
        /** Data element ID "DAW". Cardholder weight in pounds Ex. 185 lb = "185" */
        get weightPounds(): Field | undefined;
    }
    /** Driver License. File type "DL". */
    class DriverLicense extends DLID {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** ID Card. File type "ID". */
    class IDCard extends DLID {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** Enhanced Driver License. File type "EN". */
    class EnhancedDriverLicense extends DLID {
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
    /** The raw document as was parsed from the barcode. The original field key names and field values as they appear in the barcode are left as-is. The mnemonic field keys from the AAMVA specification are not replaced with human-readable names. No field value normalization, like ISO 8601 date reformatting, etc., is done. */
    class RawDocument {
        private _document;
        get document(): GenericDocument;
        constructor(document: GenericDocument);
        requiredDocumentType(): string;
    }
}
/** HIBC */
export declare class HIBC {
    private _document;
    get document(): GenericDocument;
    constructor(document: GenericDocument);
    requiredDocumentType(): string;
    /** Date of Manufacture */
    get dateOfManufacture(): Field | undefined;
    /** Expiry Date Day */
    get expiryDateDay(): Field | undefined;
    /** Expiry Date Hour */
    get expiryDateHour(): Field | undefined;
    /** Expiry Date Julian Day */
    get expiryDateJulianDay(): Field | undefined;
    /** Expiry Date Month */
    get expiryDateMonth(): Field | undefined;
    /** Expiry Date Year */
    get expiryDateYear(): Field | undefined;
    /** Information whether primary data is present. */
    get hasPrimaryData(): Field;
    /** Information whether secondary data is present. */
    get hasSecondaryData(): Field;
    /** Labeler Identification Code (LIC) */
    get labelerIdentificationCode(): Field;
    /** Labelers Product or Catalog Number (PCN). Alphanumeric data. */
    get labelersProductOrCatalogNumber(): Field;
    /** Link character to link standalone primary and secondary barcodes together. */
    get linkCharacter(): Field | undefined;
    /** Lot Number */
    get lotNumber(): Field | undefined;
    /** Quantity */
    get quantity(): Field | undefined;
    /** Serial Number */
    get serialNumber(): Field | undefined;
    /** Unit of Measure ID, Numeric value only, 0 through 9, where 0 always represents
a single unit. 1 to 8 are used to indicate different packaging levels above the unit of use.
The value 9 is used for variable quantity containers when manual key entry or scan of
a secondary will be used to collect specific quantity data.
The labeler should ensure consistency in this field within their packaging process.
 */
    get unitOfMeasureID(): Field;
}
