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

export const PayRollSectionReducer = (state: IPayrollState = null, action) => {
    switch (action.type) {

        // Gets the values for dropdown fields from SharePoint master/choice columns.
        case "GET_PAYROLL_FORM_CONTROLS":
            state = {
                ...state,
               ESIApplicable:true,
               ESINo:action.payload.ESINo,
               ESIDispensary:action.payload.ESIDispensary,
               PFApplicable:false,
               PFNo:action.payload.PFNo,
               PFNoforDeptFile:action.payload.PFNoforDeptFile,
               RestrictPF:action.payload.RestrictPF,
               ZeroPension:action.payload.ZeroPension,
               ZeroPT:action.payload.ZeroPT,
               Ward_x002f_Circle:action.payload.Ward_x002f_Circle,
               Director:action.payload.Director,
            };
            break;
        // case "SET_INITIAL_FORM_STATE":
        //     state = {
        //         ...state,
        //         //ESIApplicable:action.payload.ESIApplicable,
        //         ESINo:action.payload.ESINo,
        //         ESIDispensary:action.payload.ESIDispensary,
        //         //PFApplicable:action.payload.PFApplicable,
        //         PFNo:action.payload.PFNo,
        //         PFNoforDeptFile:action.payload.PFNoforDeptFile,
        //         RestrictPF:action.payload.RestrictPF,
        //         ZeroPension:action.payload.ZeroPension,
        //         ZeroPT:action.payload.ZeroPT,
        //         Ward_x002f_Circle:action.payload.Ward_x002f_Circle,
        //         Director:action.payload.Director,
        //     };
        //     break;
        case "ADD_PAYROLL_DATA":
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