export interface IBasicDetailState {
    //form controls
    FirstName: string;
    LastName: string;
    DateofJoining: Date; //datetime?
    Designation: string;
    Grade:string;
    Band:string;
    RefferedBy:string;
    Department:string;
    RefferalSource:string;
    WillingnessToTravelForProjectPurpose:boolean;
    FlexibleOnWorkHoursOrTiming:boolean;
    Location:string;
    Technology: any[];
    CompanyEmail: string;
    designationOptions: string[];
    technologyOptions: string[];
    EmployeeCode: number;
    gradeOptions: string[];
    refferalSourceOptions:string[];
    locationOptions:string[];
    departmentOption:string[];

}