export interface IHRState {
    //form controls
    UserAlies: string;
    ADLogin: string;
    Manager: string;
    employementStatus: string;
    DateOfLeaving: Date;
    reasonForLeaving: string;
    ResigntionDate: string; //datetime?
    EligibleforRehire: boolean;


    // Represent the choices to be displayed in dropdown when the form loads.
    employmentStatusOptions: string[];
    reasonOfLeavingOptions: string[];
}  