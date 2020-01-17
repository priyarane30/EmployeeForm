export interface IBasicDetailState {
    //form controls
    FirstName: string;
    LastName: string;
    DateofJoining: Date; //datetime?
    Designation: string;
    Technology: string;
    CompanyEmail: string;
    designationOptions: string[];
    technologyOptions: string[];
}