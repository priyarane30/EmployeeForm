export interface IHRState {
    //form controls
    UserAlies: string;
    ADLogin: string;
    Manager: string;
    employementStatus: string;
    DateofLeft: Date;
    reasonForLeaving: string;
    ResigntionDate: Date; //datetime?
    EligibleforRehire: boolean;


    // Represent the choices to be displayed in dropdown when the form loads.
    employmentStatusOptions: string[];
    reasonOfLeavingOptions: string[];
}  