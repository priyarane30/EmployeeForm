import { IEducationDetailState } from "../state/IEducationDetailState";
export const eduControlInitialState: IEducationDetailState = {
  educationDetails: [],
  certificationDetails: []
};

export const EducationReducer = (state: IEducationDetailState = eduControlInitialState, action) => {
  switch (action.type) {

      // Gets the values for dropdown fields from SharePoint master/choice columns.
      case "GET_DEFAULT_FORM_CONTROLS":
          state = {
              ...state,
              // genderOptions: action.payload.genderOptions,
              // designationOptions: action.payload.designationOptions,
              // maritalStatusOptions: action.payload.maritalStatusOptions,
              // technologyOptions: action.payload.technologyOptions
          };
          break;
      case "ADD_NEW_EMPLOYEE":
          state = {
              ...state,

              // // Represent the choices to be displayed in dropdown when the form loads.
              // genderOptions: action.payload.genderOptions,
              // designationOptions: action.payload.designationOptions,
              // maritalStatusOptions: action.payload.maritalStatusOptions,
              // technologyOptions: action.payload.technologyOptions,

              // //tran list Items
              // childDetailItems: action.payload.childDetailItems
          };
          break;
  }
  return state;
};
