import { IHRState } from '../state/IHRSectionControlsState';

//Initialise state of HR 
export const hrInitialState: IHRState = {
    UserAlias: '',
    ADLogin: '',
    Manager: '',
    employementStatus: '',
    DateOfLeaving: '', //dateTime?
    reasonForLeaving: '',
    ResigntionDate: '', //datetime?
    EligibleforRehire: false,

    // Represent the choices to be displayed in dropdown when the form loads.
    employmentStatusOptions: [],
    reasonOfLeavingOptions: []
};


export const HRSectionReducer = (state: IHRState = null, action) => {
    switch (action.type) {

        // Gets the values for dropdown fields from SharePoint master/choice columns.
        case "GET_HR_FORM_CONTROLS":
            state = {
                ...state,
                employmentStatusOptions: action.payload.employmentStatusOptions,
                reasonOfLeavingOptions: action.payload.reasonOfLeavingOptions,
                userAlias: '',
                ADLogin: '',
                Manager: '',
                employementStatus: '',
                DateOfLeaving: '', //dateTime?
                reasonForLeaving: '',
                ResigntionDate: '', //datetime?
                EligibleforRehire: false
            };
            break;
        case "SET_INITIAL_FORM_STATE":
            state = {
                ...state,
                UserAlias: action.payload.UserAlias,
                ADLogin: action.payload.ADLogin,
                Manager: action.payload.Manager,
                employementStatus: action.payload.employementStatus,
                DateOfLeaving: action.payload.DateOfLeaving,
                reasonForLeaving: action.payload.reasonForLeaving,
                ResigntionDate: action.payload.ResigntionDate,
                EligibleforRehire: action.payload.EligibleforRehire,
            };
            break;
        case "ADD_NEW_EMPLOYEE":
            state = {
                ...state,
                UserAlias: action.payload.UserAlias,
                ADLogin: action.payload.ADLogin,
                Manager: action.payload.Manager,
                employementStatus: action.payload.employementStatus,
                DateOfLeaving: action.payload.DateOfLeaving,
                reasonForLeaving: action.payload.reasonForLeaving,
                ResigntionDate: action.payload.ResigntionDate,
                EligibleforRehire: action.payload.EligibleforRehire,

                // Represent the choices to be displayed in dropdown when the form loads.
                employmentStatusOptions: action.payload.employmentStatusOptions,
                reasonOfLeavingOptions: action.payload.reasonOfLeavingOptions

            };
            break;
    }
    return state;
};