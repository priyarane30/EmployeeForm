import { IHRState } from '../state/IHRSectionControlsState';
import { ICommonState } from '../state/ICommonState';
import NewEmployeeService from '../services/NewEmployeeService';
import { ActionTypes } from '../AppConstants';
import NewEmpService from '../services/NewEmployeeService';

//Get Control Values
export function GetInitialControlValuesAction() {
    return dispatch => {

        let formControlState = {
            employmentStatusOptions: [],
            reasonOfLeavingOptions: []
        } as IHRState;

        let newEmpServiceObj: NewEmpService = new NewEmpService();
        newEmpServiceObj.getHRFormControlState().then((resp: IHRState) => {
            formControlState.reasonOfLeavingOptions = resp.reasonOfLeavingOptions;
            dispatch({
                type: ActionTypes.GetHRFormControls,
                payload: formControlState
            });
        });
    };
}

// Creates a new employee request.
export function HrAddNewEmployee(empReqData: IHRState) {
    return dispatch => {
        let newEmpReqServiceObj: NewEmployeeService = new NewEmpService();
        newEmpReqServiceObj.HrAddNewEmployee(empReqData).then(resp => {
            console.log(resp);
            alert("New Employee is added successfully");
        }).catch(() => {
            alert("Sorry. Error while adding employee...");
        });

        dispatch({
            type: "ADD_VALUE_FROM_HR",
            payload: empReqData
        });
    }
}

export function GetListValuesAction() {
    return dispatch => {

        let formControlState = {
            // UserAlies: '',
            // ADLogin: '',
            // Manager: '',
            // employementStatus: '',
            // DateOfLeaving: '', //dateTime?
            // reasonForLeaving: '',
            // ResigntionDate: '', //datetime?
            // EligibleforRehire: false,
        } as IHRState;

        let newEmpServiceObj: NewEmpService = new NewEmpService();
        debugger
        newEmpServiceObj.getHRFormlistControlState().then((resp: IHRState) => {
            debugger
            formControlState=resp
            formControlState.UserAlies = resp.UserAlies;
            formControlState.ADLogin = 'Hitaxi';//resp.ADLogin;
            formControlState.Manager = '';//resp.Manager;
            formControlState.employementStatus = '';//resp.employementStatus;
            formControlState.DateOfLeaving = '';//resp.DateOfLeaving;
            formControlState.reasonForLeaving = '';//resp.reasonForLeaving;
            formControlState.ResigntionDate = '';//resp.ResigntionDate;
            formControlState.EligibleforRehire = true;
             console.log('Action:--' + formControlState.UserAlies +formControlState)
            dispatch({
                type: ActionTypes.SetInitialFormState,
                payload: formControlState
            });
        });
    };
}


export function SetTabName(tabData: ICommonState) {
    return ({
        type: "SET_TAB",
        payload: tabData
    })
}
