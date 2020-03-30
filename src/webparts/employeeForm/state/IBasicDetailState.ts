export interface IBasicDetailState {
    //form controls
    FirstName: string;
    LastName: string;
    DateofJoining: Date; //datetime?
    Designation: string;
    Technology: any[];
    CompanyEmail: string;
    designationOptions: string[];
    technologyOptions: string[];
    EmployeeCode: number;
}