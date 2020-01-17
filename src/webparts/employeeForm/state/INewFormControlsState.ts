// Represents a employee detail
export interface INewFormState {
    //form controls
    // FirstName: string;
    // LastName: string;
    // Gender: string;
    // DateofJoining: string; //datetime?
    // Designation: string;
    // Technology: string;
    // CompanyEmail: string;
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
    CurrentAddress: string;
    IsSameAsCurrAddress: boolean;
    PermanentAddress: string;
    PanNo: string;
    AadharNo: string;
    IsPassAvail: boolean;
    PassportNo: string;
    PassportValidity: Date; //datetime?
    Gender:string;

    // Represent the choices to be displayed in dropdown when the form loads.
    genderOptions: string[];
    designationOptions: string[];
    maritalStatusOptions: string[];
    technologyOptions: string[];

    //tran list Items
    childDetailItems: Array<{
        ChildName:string;
        DateOfBirth:Date;
    }>;
}

