import { IHRState } from '../state/IHRSectionControlsState';
import { ICommonState } from '../state/ICommonState';
import NewEmployeeService from '../services/NewEmployeeService';
import { ActionTypes } from '../AppConstants';
import NewEmpService from '../services/NewEmployeeService';

//Get all Control's Values
export function GetInitialControlValuesAction(EmpListID) {
    return dispatch => {

        let formControlState = {} as IHRState;

        let newEmpServiceObj: NewEmpService = new NewEmpService();
        newEmpServiceObj.getHRFormControlState(EmpListID).then((resp: IHRState) => {

            //DropDown Field Value
            formControlState.reasonOfLeavingOptions = resp.reasonOfLeavingOptions;
            formControlState.LastDesignationOptions = resp.LastDesignationOptions;
            formControlState.employmentStatusOptions = [];
            //textbox Values
            formControlState.UserAlies = resp.UserAlies;
            formControlState.ADLogin = resp.ADLogin;
            formControlState.Manager = resp.Manager;
            formControlState.employementStatus = resp.employementStatus;
            formControlState.LastDesignation = resp.LastDesignation;
            formControlState.LastPromotedDate = resp.LastPromotedDate;
            formControlState.DateofLeft = resp.DateofLeft;
            formControlState.reasonForLeaving = resp.reasonForLeaving;
            formControlState.ResigntionDate =resp.ResigntionDate;
            formControlState.EligibleforRehire = resp.EligibleforRehire;
            dispatch({
                type: ActionTypes.GetHRFormControls,
                payload: formControlState
            });
        });
    };
}

// Creates a new employee request.
export function HrAddNewEmployee(empReqData: IHRState, managerdata, EmpListID) {
    return dispatch => {
        let newEmpReqServiceObj: NewEmployeeService = new NewEmpService();
        newEmpReqServiceObj.HrAddNewEmployee(empReqData, managerdata, EmpListID).then(resp => {
            alert("New Employee is added successfully");
        }).catch(() => {
            alert("Sorry. Error while adding employee...");
        });
        dispatch({
            type: ActionTypes.AddValueFromHR,
            payload: empReqData
        });
    };
}

export function SetTabName(tabData: ICommonState) {
    return ({
        type: ActionTypes.SetTabName,
        payload: tabData
    });
}
