import { IBasicDetailState } from "../state/IBasicDetailState";
import { ActionTypes } from "../AppConstants";
//Initialise state of Education 
// export const BasicDetailState: IBasicDetailState = {
//     FirstName: '',
//     LastName: '',
//     Gender: '',
//     DateofJoining: '', //datetime?
//     Designation: '',
//     Technology: '',
//     CompanyEmail: '',
// };

export const BasicDetailSectionReducer = (state: IBasicDetailState = null, action) => {
    switch (action.type) {

        // Gets the values for dropdown fields from SharePoint master/choice columns.
        case ActionTypes.GetBasicFormControls:
            console.log(action)
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
        // case ActionTypes.SetTabName:
        //     state = {
        //         ...state,
        //         CurrentForm: action.payload.CurrentForm
        //     };
        //     break;
        // case "ADD_BASIC_FORM":
        //     state = {
        //         ...state,


        //     };
        //     break;
    }
    return state;
};