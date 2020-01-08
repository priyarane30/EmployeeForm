export interface IProfessionalDetailState {
    //form controls
    organization: string;
    designation: string;
    startDate: string;//dateTime?
    endDate: string; //dateTime?
    reportingTo: string;
    reportingDesignation: string;
    totalExp: string; 
    reasonForLeaving:string;

    // Represent the choices to be displayed in dropdown when the form loads.
    reasonOfLeavingOptions: string[];
} 