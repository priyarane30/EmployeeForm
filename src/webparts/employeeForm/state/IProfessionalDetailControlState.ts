export interface IProfessionalDetailState {
    //form controls
    organizationDetails: Array<
        {
            organization: string;
            designation: string;
            startDate: string;//dateTime?
            endDate: string; //dateTime?
            reportingTo: string;
            reportingDesignation: string;
            totalExp: string;
            reasonForLeaving: string;
            // Represent the choices to be displayed in dropdown when the form loads.
            reasonOfLeavingOptions: string[];
        }>
    technologyDetails: Array<
        {
            Technology:string;
            SinceWhen:string;
            Expertise:string;
            Rating:string;
            
        }>
} 