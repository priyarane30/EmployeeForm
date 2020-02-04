import { IBasicDetailState } from "../state/IBasicDetailState";
import { ActionTypes } from "../AppConstants";
export const basicState: IBasicDetailState = {
    FirstName: '',
    LastName: '',
    DateofJoining: new Date(), //datetime?
    Designation: '',
    Technology: [],
    CompanyEmail: '',
    designationOptions: [],
    technologyOptions: [],
}
export const BasicDetailSectionReducer = (state: IBasicDetailState = null, action) => {
    switch (action.type) {
        // Gets the values for dropdown fields from SharePoint master/choice columns.
        case ActionTypes.GetBasicFormControls:
            state = {
                ...state,
                FirstName: action.payload.FirstName,
                LastName: action.payload.LastName,
                DateofJoining: action.payload.DateofJoining, //datetime?
                Designation: action.payload.Designation,
                Technology: action.payload.Technology,
                CompanyEmail: action.payload.CompanyEmail,
                designationOptions: action.payload.designationOptions,
                technologyOptions: action.payload.technologyOptions,
            };
            break;
    }
    return state;
};