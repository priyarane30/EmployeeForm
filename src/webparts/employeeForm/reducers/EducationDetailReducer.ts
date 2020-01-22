import { IEducationDetailState } from "../state/IEducationDetailState";
import { ActionTypes, AppConstats, ListNames } from '../AppConstants';
import EducationDetail from "../components/tabs/EducationDetail";
import { actions } from "react-redux-form";
//Initialise state of Education 
export const eduDetailState: IEducationDetailState = {
  educationDetails:[],
  certificationDetails:[]
};


export const EducationSectionReducer = (state: IEducationDetailState = eduDetailState, action) => {
  
    switch (action.type) {
        // Gets the values for dropdown fields from SharePoint master/choice columns.
        case "GET_DEFAULT_FORM_CONTROLS":
            state = {
                ...state,
                
            };
            break;

        case "ADD_NEW_EMPLOYEE":
            state = {
                ...state,
                   
    
            };
            break;

        //educationDetail section
        // Sets initial or already filled values in state from sp list 
        case "SET_INITIAL_EDUDETAIL_FORM_STATE":
            state = {
                ...state,
                educationDetails:action.payload
            }
            break;
        //adds empty array from payload to state.educationdetails
        case ActionTypes.AddEducationDetailRow:
            state={
                ...state,
                educationDetails:[...state.educationDetails,action.payload]
            };
            break;
        //removes array from state.educationdetails on index
        case ActionTypes.RemoveEducationDetailRow:
            state={
                ...state,
                educationDetails:[...state.educationDetails.slice(0,action.payload),
                                  ...state.educationDetails.slice(action.payload+1) ]
            };
            break;
        
        //CertiDetails section
        //sets already set values from sp list to state
        case "SET_INITIAL_CERTIDETAIL_FORM_STATE":
            state={
                ...state,
                certificationDetails:action.payload
            };
            break;
        //adds empty array from payload to state
        case "ADD_NEW_CERTIDETAIL_ROW":
                state={
                    ...state,
                    certificationDetails:[...state.certificationDetails,action.payload]
                };
                break;
        //removes row from state based on index
        case "REMOVE_CERTIDETAIL_ROW":
            state={
            ...state,
            certificationDetails:[...state.certificationDetails.slice(0,action.payload),
            ...state.certificationDetails.slice(action.payload+1) ]
                };
                break;
    }
    return state;
};
