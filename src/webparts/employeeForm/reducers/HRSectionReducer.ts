import { IHRState } from '../state/IHRSectionControlsState';

export const HRSectionReducer = (state: IHRState = null, action) => {
    switch (action.type) {

        // Gets the values for all fields from SharePoint master/choice columns.
        case "GET_HR_FORM_CONTROLS":
            state = {
                ...state,
                employmentStatusOptions: action.payload.employmentStatusOptions,
                reasonOfLeavingOptions: action.payload.reasonOfLeavingOptions,
                LastDesignationOptions:action.payload.LastDesignationOptions,

                UserAlies: action.payload.UserAlies,
                ADLogin: action.payload.ADLogin,
                Manager: action.payload.Manager,
                employementStatus: action.payload.employementStatus,
                LastDesignation: action.payload.LastDesignation,
                LastPromotedDate: action.payload.LastPromotedDate,
                DateofLeft: action.payload.DateofLeft, //dateTime?
                reasonForLeaving: action.payload.reasonForLeaving,
                ResigntionDate: action.payload.ResigntionDate, //datetime?
                EligibleforRehire: action.payload.EligibleforRehire
            };
            break;
        case "ADD_VALUE_FROM_HR":
            state = {
                ...state,
                UserAlies: action.payload.UserAlies,
                ADLogin: action.payload.ADLogin,
                Manager: action.payload.Manager,
                employementStatus: action.payload.employementStatus,
                LastDesignation: action.payload.LastDesignation,
                LastPromotedDate: action.payload.LastPromotedDate,
                DateofLeft: action.payload.DateofLeft,
                reasonForLeaving: action.payload.reasonForLeaving,
                ResigntionDate: action.payload.ResigntionDate,
                EligibleforRehire: action.payload.EligibleforRehire,

                // Represent the choices to be displayed in dropdown when the form loads.
                employmentStatusOptions: action.payload.employmentStatusOptions,
                reasonOfLeavingOptions: action.payload.reasonOfLeavingOptions,
                LastDesignationOptions:action.payload.LastDesignationOptions

            };
            break;
    }
    return state;
};