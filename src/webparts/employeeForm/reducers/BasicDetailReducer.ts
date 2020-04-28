import { IBasicDetailState } from "../state/IBasicDetailState";
import { ActionTypes } from "../AppConstants";
export const basicState: IBasicDetailState = {
    FirstName: '',
    LastName: '',
    DateofJoining: new Date(), //datetime?
    Designation: '',
    Technology: [],
    CompanyEmail: '',
    RefferedBy:'',
    designationOptions: [],
    technologyOptions: [],
    Location:'',
    RefferalSource:'',
    locationOptions:[],
    departmentOption:[],
    Department:'',
    refferalSourceOptions:[],
    Grade:'',
    gradeOptions:[],
    WillingnessToTravelForProjectPurpose:false,
    FlexibleOnWorkHoursOrTiming:false,
    Band:'',
    EmployeeCode : null,
}
export const BasicDetailSectionReducer = (state: IBasicDetailState = null, action) => {
    switch (action.type) {
        // Gets the values for dropdown fields from SharePoint master/choice columns.
        case ActionTypes.GetBasicFormControls:
            state = {
                ...state,
                EmployeeCode : action.payload.EmployeeCode,
                FirstName: action.payload.FirstName,
                LastName: action.payload.LastName,
                DateofJoining: action.payload.DateofJoining, //datetime?
                Designation: action.payload.Designation,
                Technology: action.payload.Technology,
                CompanyEmail: action.payload.CompanyEmail,
                RefferedBy:action.payload.RefferedBy,
                RefferalSource:action.payload.RefferalSource,
                refferalSourceOptions:action.payload.refferalSourceOptions,
                designationOptions: action.payload.designationOptions,
                departmentOption:action.payload.departmentOption,
                Department:action.payload.Department,
                technologyOptions: action.payload.technologyOptions,
                WillingnessToTravelForProjectPurpose:action.payload.WillingnessToTravelForProjectPurpose,
                FlexibleOnWorkHoursOrTiming:action.payload.FlexibleOnWorkHoursOrTiming,
                Location:action.payload.Location,
                locationOptions:action.payload.locationOptions,
                Grade:action.payload.Grade,
                gradeOptions:action.payload.gradeOptions,
                Band:action.payload.Band
            };
            break;
    }
    return state;
};