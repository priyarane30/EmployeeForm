import { IPayrollState } from '../state/IPayrollState';

//Initialise state of Pay Roll
export const PayRollInitialState: IPayrollState = {
    ESIApplicable:false,
    ESINo:'',
    ESIDispensary:'',
    PFApplicable:false,
    PFNo:'',
    PFNoforDeptFile:'',
    RestrictPF:'',
    ZeroPension:'',
    ZeroPT:'',
    Ward_x002f_Circle:'',
    Director:'',

};


export const PayRollSectionReducer = (state: IPayrollState = PayRollInitialState, action) => {
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
                ESIApplicable:action.payload.PayRollData.ESIApplicable,
                ESINo:action.payload.PayRollData.ESINo,
                ESIDispensary:action.payload.PayRollData.ESIDispensary,
                PFApplicable:action.payload.PayRollData.PFApplicable,
                PFNo:action.payload.PayRollData.PFNo,
                PFNoforDeptFile:action.payload.PayRollData.PFNoforDeptFile,
                RestrictPF:action.payload.PayRollData.RestrictPF,
                ZeroPension:action.payload.PayRollData.ZeroPension,
                ZeroPT:action.payload.PayRollData.ZeroPT,
                Ward_x002f_Circle:action.payload.PayRollData.Ward_x002f_Circle,
                Director:action.payload.PayRollData.Director,
            };
            break;
        case "ADD_NEW_EMPLOYEE":
            state = {
                ...state,
                ESIApplicable:action.payload.ESIApplicable,
                ESINo:action.payload.ESINo,
                ESIDispensary:action.payload.ESIDispensary,
                PFApplicable:action.payload.PFApplicable,
                PFNo:action.payload.PFNo,
                PFNoforDeptFile:action.payload.PFNoforDeptFile,
                RestrictPF:action.payload.RestrictPF,
                ZeroPension:action.payload.ZeroPension,
                ZeroPT:action.payload.ZeroPT,
                Ward_x002f_Circle:action.payload.Ward_x002f_Circle,
                Director:action.payload.Director,

            };
            break;
    }
    return state;
};