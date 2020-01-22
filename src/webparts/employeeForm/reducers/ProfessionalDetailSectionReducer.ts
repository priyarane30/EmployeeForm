import { IProfessionalDetailState } from "../state/IProfessionalDetailControlState";

export const professionalDetailState: IProfessionalDetailState = {
    IsFresher: false,
    organizationDetails: [],
    technologyDetails: []
};

export const ProfessionalDetailSectionReducer = (state: IProfessionalDetailState = professionalDetailState, action) => {
    switch (action.type) {
        // Gets the values for dropdown fields from SharePoint master/choice columns.
        case "GET_PROFESSIONALDETAIL_FORM_CONTROLS":
            state = {
                ...state,
            };
            break;

        case "ADD_PROFESSIONALDETAILS_VALUE":
            state = {
                ...state,
            };
            break;

        //educationDetail section
        // Sets initial or already filled values in state from sp list 
        case "SET_INITIAL_PROFESSIONALDETAIL_FORM_STATE":

            state = {
                ...state,
                IsFresher: action.payload.IsFresher,
                organizationDetails: action.payload.organizationDetails
            };
            break;
        //adds empty array from payload to state.professionaldetail
        case "ADD_NEW_PROFESSIONAL_DETAIL_ROW":
            state = {
                ...state,
                organizationDetails: [...state.organizationDetails, action.payload]
            };
            break;
        //removes array from state.professionaldetail on index
        case "REMOVE_PROFESSIONALDETAIL_ROW":
            state = {
                ...state,
                organizationDetails: [
                    ...state.organizationDetails.slice(0, action.payload),
                    ...state.organizationDetails.slice(action.payload + 1)
                ]
            };
            break;

        //CertiDetails section
        //sets already set values from sp list to state
        case "SET_INITIAL_TECHNOLOGY_FORM_STATE":
            state = {
                ...state,
                IsFresher: action.payload.IsFresher,
                technologyDetails: action.payload.technologyDetails
            };
            break;
        //adds empty array from payload to state
        case "ADD_NEW_TECHNOLOGY_ROW":
            state = {
                ...state,
                technologyDetails: [
                    ...state.technologyDetails, action.payload
                ]
            };
            break;
        //removes row from state based on index
        case "REMOVE_TECHNOLOGY_ROW":
            state = {
                ...state,
                technologyDetails:
                    [
                        ...state.technologyDetails.slice(0, action.payload),
                        ...state.technologyDetails.slice(action.payload + 1)
                    ]
            };
            break;
    }
    return state;

}