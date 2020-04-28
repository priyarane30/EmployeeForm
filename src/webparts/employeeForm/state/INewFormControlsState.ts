// Represents a employee detail
export interface INewFormState {
    //form controls
    PersonalEmail: string;
    Mobile: string;
    DateOfBirth: Date;//dateTime?
    Age: number;
    BloodGroup: string;
    FatherName: string;
    MotherName: string;
    MaritalStatus: string;
    SpouceName: string;
    SpouseOccupation: string;
    SpouceDOB: Date; //dateTime?
    EmergencyNo: string;
    RelationWithEmergencyNo: string;
    CurrentResidentialNumber:string;
    CurrentResidentialName:string;
    CurrentRoadStreet:string;
    CurrentLocalityArea:string;
    CurrentLandmark:string;
    CurrentPincode:string;
    CurrentCity:string;
    CurrentState:string;
    AccomodationType:string;
    IsSameAsCurrAddress: boolean;
    PermanentResidentialNumber:string;
    PermanentResidentialName:string;
    PermanentRoadStreet:string;
    PermanentLocalityArea:string;
    PermanentLandmark:string;
    PermanentPincode:string;
    PermanentState:string;
    PermanentCity:string;
    PanNo: string;
    AadharNo: string;
    IsPassAvail: boolean;
    PassportNo: string;
    PassportValidity: Date; //datetime?
    Gender: string;
    MarraigeAnniversary:Date;


    // Represent the choices to be displayed in dropdown when the form loads.
    genderOptions: string[];
    designationOptions: string[];
    maritalStatusOptions: string[];
    technologyOptions: string[];

    //tran list Items
    childDetailItems: Array<{
        childDetailId: number;
        ChildName: string;
        DateOfBirth: Date;
    }>;

    visaDetailItems: Array<{
        visaDetailId:number;
        ValidVisa: boolean;
        VisaOfCountry: string;
        VisaNo: string;
        Entry: string;
        VisaValidity: Date;
        IsTravelled: boolean;
    }>;
}

