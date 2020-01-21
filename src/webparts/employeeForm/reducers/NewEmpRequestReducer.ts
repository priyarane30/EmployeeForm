import { INewFormState } from '../state/INewFormControlsState';
import { ActionTypes, AppConstats, ListNames } from '../AppConstants';
//Initialise state of Employee Detail
export const newEmpFormControlsInitialState: INewFormState = {
    PersonalEmail: '',
    Mobile: '',
    DateOfBirth: null,//dateTime?
    Age: 0,
    BloodGroup: '',
    FatherName: '',
    MotherName: '',
    MaritalStatus: '',
    SpouceName: '',
    SpouseOccupation: '',
    SpouceDOB: null, //dateTime?
    EmergencyNo: '',
    RelationWithEmergencyNo: '',
    CurrentAddress: '',
    IsSameAsCurrAddress: false,
    PermanentAddress: '',
    PanNo: '',
    AadharNo: '',
    IsPassAvail: false,
    PassportNo: '',
    PassportValidity: null,
    Gender: '',

    // Represent the choices to be displayed in dropdown when the form loads.
    genderOptions: [],
    designationOptions: [],
    maritalStatusOptions: [],
    technologyOptions: [],

    //tran list Items
    childDetailItems: [],
    visaDetailItems: []
};


export const NewEmpRequestReducer = (state: INewFormState = null, action) => {
    console.log(action);
    switch (action.type) {

        // Gets the values for dropdown fields from SharePoint master/choice columns.
        case ActionTypes.GetDefaultFormControls:
            state = {
                ...state,
                PersonalEmail: action.payload.PersonalEmail,
                Mobile: action.payload.Mobile,
                DateOfBirth: action.payload.DateOfBirth,//dateTime?
                Age: action.payload.Age,
                BloodGroup: action.payload.BloodGroup,
                FatherName: action.payload.FatherName,
                MotherName: action.payload.MotherName,
                MaritalStatus: action.payload.MaritalStatus,
                SpouceName: action.payload.SpouceName,
                SpouseOccupation: action.payload.SpouseOccupation,
                SpouceDOB: action.payload.SpouceDOB, //dateTime?
                EmergencyNo: action.payload.EmergencyNo,
                RelationWithEmergencyNo: action.payload.RelationWithEmergencyNo,
                CurrentAddress: action.payload.CurrentAddress,
                IsSameAsCurrAddress: action.payload.IsSameAsCurrAddress,
                PermanentAddress: action.payload.PermanentAddress,
                PanNo: action.payload.PanNo,
                AadharNo: action.payload.AadharNo,
                IsPassAvail: action.payload.IsPassAvail,
                PassportNo: action.payload.PassportNo,
                PassportValidity: action.payload.PassportValidity,
                Gender: action.payload.Gender,
                genderOptions: action.payload.genderOptions,
                maritalStatusOptions: action.payload.maritalStatusOptions,
                childDetailItems: action.payload.childDetailItems,
                visaDetailItems: action.payload.visaDetailItems
            };
            break;
        case "SET_INITIAL_STATE":
            state = {
                ...state,
                PersonalEmail: action.payload.NewEmpReqData.PersonalEmail,
                Mobile: action.payload.NewEmpReqData.Mobile,
                DateOfBirth: action.payload.NewEmpReqData.DateOfBirth,
                Age: action.payload.NewEmpReqData.Age,
                BloodGroup: action.payload.NewEmpReqData.BloodGroup,
                FatherName: action.payload.NewEmpReqData.FatherName,
                MotherName: action.payload.NewEmpReqData.MotherName,
                MaritalStatus: action.payload.NewEmpReqData.MaritalStatus,
                SpouceName: action.payload.NewEmpReqData.SpouceName,
                // SpouceOccupation: action.payload.NewEmpReqData.SpouceOccupation,
                SpouceDOB: action.payload.NewEmpReqData.spouceDOB,
                EmergencyNo: action.payload.NewEmpReqData.EmergencyNo,
                RelationWithEmergencyNo: action.payload.NewEmpReqData.RelationWithEmergencyNo,
                //  currentAddress: action.payload.NewEmpReqData.currentAddress,
                // IsSamePermCurrAddress: action.payload.NewEmpReqData.IsSamePermCurrAddress,
                // permanentAddress: action.payload.NewEmpReqData.permanentAddress,
                // panNo: action.payload.NewEmpReqData.panNo,
                // aadharNo: action.payload.NewEmpReqData.aadharNo,
                // isPassAvail: action.payload.NewEmpReqData.isPassAvail,
                // passportNo: action.payload.NewEmpReqData.passportNo,
                // passportValidity: action.payload.NewEmpReqData.passportValidity,
            };
            break;
        case "ADD_NEW_EMPLOYEE":
            state = {
                ...state,
                PersonalEmail: action.payload.PersonalEmail,
                Mobile: action.payload.Mobile,
                DateOfBirth: action.payload.DateOfBirth,
                Age: action.payload.Age,
                BloodGroup: action.payload.BloodGroup,
                FatherName: action.payload.FatherName,
                MotherName: action.payload.MotherName,
                MaritalStatus: action.payload.MaritalStatus,
                SpouceName: action.payload.SpouceName,
                SpouseOccupation: action.payload.SpouseOccupation,
                SpouceDOB: action.payload.SpouceDOB,
                EmergencyNo: action.payload.EmergencyNo,
                RelationWithEmergencyNo: action.payload.RelationWithEmergencyNo,
                CurrentAddress: action.payload.CurrentAddress,
                IsSameAsCurrAddress: action.payload.IsSameAsCurrAddress,
                PermanentAddress: action.payload.PermanentAddress,
                PanNo: action.payload.PanNo,
                AadharNo: action.payload.AadharNo,
                IsPassAvail: action.payload.IsPassAvail,
                PassportNo: action.payload.PassportNo,
                PassportValidity: action.payload.PassportValidity,

                // Represent the choices to be displayed in dropdown when the form loads.
                genderOptions: action.payload.genderOptions,
                designationOptions: action.payload.designationOptions,
                maritalStatusOptions: action.payload.maritalStatusOptions,
                technologyOptions: action.payload.technologyOptions,

                // //tran list Items
                // childDetailItems: action.payload.childDetailItems,
                // visaDetailItems: action.payload.visaDetailItems
            };
            break;
        case ActionTypes.AddChildDetailRow:
            state = {
                ...state,
                childDetailItems: [...state.childDetailItems, action.payload]
            };
            break;
        case ActionTypes.RemoveChildDetailRow:
            state = {
                ...state,
                childDetailItems: [...state.childDetailItems.slice(0, action.payload),
                ...state.childDetailItems.slice(action.payload + 1)]
            };
            break;
            case ActionTypes.AddVisaDetailRow:
                state = {
                    ...state,
                    visaDetailItems: [...state.visaDetailItems, action.payload]
                };
                break;
            case ActionTypes.RemoveVisaDetailRow:
                state = {
                    ...state,
                    visaDetailItems: [...state.visaDetailItems.slice(0, action.payload),
                    ...state.visaDetailItems.slice(action.payload + 1)]
                };
                break;
    }
    return state;
};