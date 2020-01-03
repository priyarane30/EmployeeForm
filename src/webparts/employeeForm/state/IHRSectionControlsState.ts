export interface IHRState {
    //form controls
    userAlias: string;
    ADLoginName: string;
    manager: string;
    employmentStatus: string; 
    dateOfLeaving: string; //dateTime?
    reasonForLeaving: string;
    resignationDate: string; //datetime?
    eligibleToRehire: boolean;
    

    // Represent the choices to be displayed in dropdown when the form loads.
    employmentStatusOptions: string[];
    reasonOfLeavingOptions: string[];
}  