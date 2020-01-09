import { IPayrollState } from '../state/IPayrollState';
import { ICommonState } from '../state/ICommonState';
import { ActionTypes } from '../AppConstants';
import NewEmpService from '../services/NewEmployeeService';


export function GetPayrollAction(){
    return dispatch => {
          
        let formControlState = {
            
        } as IPayrollState;

        let newEmpServiceObj: NewEmpService = new NewEmpService();
        debugger
        newEmpServiceObj.getPayrollControlState().then((resp: IPayrollState) => {
            formControlState = resp;
            dispatch({
                type: ActionTypes.GetDefaultFormControls,
                payload: formControlState
            });
        });
    }
}

export function SetTabName(tabData: ICommonState) {
    return ({
        type: "SET_TAB",
        payload: tabData
    })
}