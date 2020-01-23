import { IPayrollState } from '../state/IPayrollState';
import { ICommonState } from '../state/ICommonState';
import { ActionTypes } from '../AppConstants';
import NewEmpService from '../services/NewEmployeeService';

export function GetPayrollAction(EmpListID) {
    return dispatch => {

        let formControlState = {} as IPayrollState;
        let newEmpServiceObj: NewEmpService = new NewEmpService();
        newEmpServiceObj.getPayrollControlState(EmpListID).then((resp: IPayrollState) => {
            formControlState = resp;
            dispatch({
                type: ActionTypes.GetPayrollFormControls,
                payload: formControlState
            });
        });
    };
}

export function SetTabName(tabData: ICommonState) {
    return ({
        type: "SET_TAB",
        payload: tabData
    });
}