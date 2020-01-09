import { IProfessionalDetailState } from '../state/IProfessionalDetailControlState';

//Initialise state of Employee Detail
export const professionalDetailInitialState: IProfessionalDetailState = {
    organization: '',
    designation: '',
    startDate: '',//dateTime?
    endDate: '',//dateTime?
    reportingTo: '', 
    reportingDesignation: '',
    totalExp: '', 
    reasonForLeaving: '',

    // Represent the choices to be displayed in dropdown when the form loads.
    reasonOfLeavingOptions: []
};


export const ProfessionalDetailSectionReducer = (state: IProfessionalDetailState = professionalDetailInitialState, action) => {
    switch (action.type) {

        // Gets the values for dropdown fields from SharePoint master/choice columns.
        case "GET_DEFAULT_FORM_CONTROLS":
            state = {
                ...state,
                reasonOfLeavingOptions: action.payload.reasonOfLeavingOptions
            };
            break;
            case "SET_INITIAL_FORM_STATE":
            state = {
                ...state,
                organization: action.payload.PD.organization,
                designation: action.payload.PD.designation,
                startDate: action.payload.PD.startDate,
                endDate: action.payload.PD.endDate,
                reportingTo: action.payload.PD.reportingTo,
                reportingDesignation: action.payload.PD.reportingDesignation,
                totalExp: action.payload.PD.totalExp,
                reasonForLeaving: action.payload.PD.reasonForLeaving,
            };
            break;
        case "ADD_NEW_EMPLOYEE":
            state = {
                ...state,
                organization: action.payload.organization,
                designation: action.payload.designation,
                startDate: action.payload.startDate,
                endDate: action.payload.endDate,
                reportingTo: action.payload.reportingTo,
                reportingDesignation: action.payload.reportingDesignation,
                totalExp: action.payload.totalExp,
                reasonForLeaving: action.payload.reasonForLeaving,

                // Represent the choices to be displayed in dropdown when the form loads.
                reasonOfLeavingOptions: action.payload.reasonOfLeavingOptions

            };
            break;
    }
    return state;
};