// Represents a employee detail
export interface INewFormState {
    //form controls
    firstName: string;
    lastName: string;
    gender: string;
    dateOfJoin: string; //datetime?
    designation: string;
    technology: string;
    personalEmail: string;
    mobileNo: string;
    dateOfBirth: string;//dateTime?
    age: number;
    bloodGroup: string;
    fatherName: string;
    motherName: string;
    maritalStatus: string;
    spouceName: string;
    spouceOccup: string;
    spouceDOB: string; //dateTime?
    emergencyContact: string;
    relWithEmergency: string;
    currentAddress: string;
    IsSamePermCurrAddress: boolean;
    permanentAddress: string;
    panNo: string;
    aadharNo: string;
    isPassAvail: boolean;
    passportNo: string;
    passportValidity: string;

    // Represent the choices to be displayed in dropdown when the form loads.
    genderOptions: string[];
    designationOptions: string[];
    maritalStatusOptions: string[];
    technologyOptions : string[];

    //tran list Items
    childDetailItems: IChildDetailItem[];
}  

// Represents one child detail in the Employee request.
export interface IChildDetailItem {
    childName: string;
    dateOfBirth: string;//dateTime??
}