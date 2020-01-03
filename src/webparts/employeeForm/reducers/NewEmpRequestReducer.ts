import { INewFormState } from '../state/INewFormControlsState';

//Initialise state of Employee Detail
export const newEmpFormControlsInitialState: INewFormState = {
    firstName: '',
    lastName: '',
    gender: '',
    dateOfJoin: '',//datetime?
    designation: '',
    technology :'',
    personalEmail: '',
    mobileNo: '',
    dateOfBirth: '',//dateTime?
    age: 0,
    bloodGroup: '',
    fatherName: '',
    motherName: '',
    maritalStatus: '',
    spouceName: '',
    spouceOccup: '',
    spouceDOB: '', //dateTime?
    emergencyContact: '',
    relWithEmergency: '',
    currentAddress: '',
    IsSamePermCurrAddress: false,
    permanentAddress: '',
    panNo: '',
    aadharNo: '',
    isPassAvail: false,
    passportNo: '',
    passportValidity: '',

    // Represent the choices to be displayed in dropdown when the form loads.
    genderOptions: [],
    designationOptions: [],
    maritalStatusOptions: [],
    technologyOptions: [],

    //tran list Items
    childDetailItems: []
};


export const NewEmpRequestReducer = (state: INewFormState = newEmpFormControlsInitialState, action) => {
    switch (action.type) {

        // Gets the values for dropdown fields from SharePoint master/choice columns.
        case "GET_DEFAULT_FORM_CONTROLS":
            state = {
                ...state,
                genderOptions: action.payload.genderOptions,
                designationOptions: action.payload.designationOptions,
                maritalStatusOptions: action.payload.maritalStatusOptions,
                technologyOptions: action.payload.technologyOptions
            };
            break;
        case "ADD_NEW_EMPLOYEE":
            state = {
                ...state,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                gender: action.payload.gender,
                dateOfJoin: action.payload.dateOfJoin,//datetime?
                designation: action.payload.designation,
                technology : action.payload.technology,
                personalEmail: action.payload.personalEmail,
                mobileNo: action.payload.mobileNo,
                dateOfBirth: action.payload.dateOfBirth,
                age: action.payload.age,
                bloodGroup: action.payload.bloodGroup,
                fatherName: action.payload.fatherName,
                motherName: action.payload.motherName,
                maritalStatus: action.payload.maritalStatus,
                spouceName: action.payload.spouceName,
                spouceOccup: action.payload.spouceOccup,
                spouceDOB: action.payload.spouceDOB,
                emergencyContact: action.payload.emergencyContact,
                relWithEmergency: action.payload.relWithEmergency,
                currentAddress: action.payload.currentAddress,
                IsSamePermCurrAddress: action.payload.IsSamePermCurrAddress,
                permanentAddress: action.payload.permanentAddress,
                panNo: action.payload.panNo,
                aadharNo: action.payload.aadharNo,
                isPassAvail: action.payload.isPassAvail,
                passportNo: action.payload.passportNo,
                passportValidity: action.payload.passportValidity,

                // Represent the choices to be displayed in dropdown when the form loads.
                genderOptions: action.payload.genderOptions,
                designationOptions: action.payload.designationOptions,
                maritalStatusOptions: action.payload.maritalStatusOptions,
                technologyOptions: action.payload.technologyOptions,

                //tran list Items
                childDetailItems: action.payload.childDetailItems
            };
            break;
    }
    return state;
};