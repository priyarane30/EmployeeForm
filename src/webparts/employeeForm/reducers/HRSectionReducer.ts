import { IHRState } from '../state/IHRSectionControlsState';

//Initialise state of Employee Detail
export const hrInitialState: IHRState = {
    userAlias: '',
    ADLoginName: '',
    manager: '',
    employmentStatus: '',
    dateOfLeaving: '', //dateTime?
    reasonForLeaving: '',
    resignationDate: '', //datetime?
    eligibleToRehire: false,

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
                ADLoginName: action.payload.ADLoginName,
                manager: action.payload.manager,
                employmentStatus: action.payload.employmentStatus,
                dateOfLeaving: action.payload.dateOfLeaving,
                reasonForLeaving: action.payload.reasonForLeaving,
                resignationDate: action.payload.resignationDate,
                eligibleToRehire: action.payload.eligibleToRehire,

                // Represent the choices to be displayed in dropdown when the form loads.
                employmentStatusOptions: action.payload.employmentStatusOptions,
                reasonOfLeavingOptions: action.payload.reasonOfLeavingOptions

            };
            break;
    }
    return state;
};