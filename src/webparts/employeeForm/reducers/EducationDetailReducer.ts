import { IEducationDetailState } from "../state/IEducationDetailState";
//Initialise state of Education 
export const eduDetailState: IEducationDetailState = {
  educationDetails: [],
  certificationDetails: []
};


 export  const EducationSectionReducer = (state: IEducationDetailState = eduDetailState, action) => {
    switch (action.type) {

        // Gets the values for dropdown fields from SharePoint master/choice columns.
        case "GET_DEFAULT_FORM_CONTROLS":
            state = {
                ...state,
                
            };
            break;
        case "SET_INITIAL_FORM_STATE":
            state = {
                ...state,
               
            };
            break;
        case "ADD_NEW_EMPLOYEE":
            state = {
                ...state,
               

            };
            break;
    }
    return state;
};
