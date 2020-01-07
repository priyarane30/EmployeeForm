import { IHRState } from '../state/IHRSectionControlsState';

//Initialise state of Employee Detail
export const hrInitialState: IHRState = {
    userAlias: '',
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


export const HRSectionReducer = (state: IHRState = hrInitialState, action) => {
    switch (action.type) {

        // Gets the values for dropdown fields from SharePoint master/choice columns.
        case "GET_DEFAULT_FORM_CONTROLS":
            state = {
                ...state,
                employmentStatusOptions: action.payload.employmentStatusOptions,
                reasonOfLeavingOptions: action.payload.reasonOfLeavingOptions
            };
            break;
        case "ADD_NEW_EMPLOYEE":
            state = {
                ...state,
                userAlias: action.payload.userAlias,
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