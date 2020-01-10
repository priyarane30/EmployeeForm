import { IPayrollState } from '../state/IPayrollState';
import { ICommonState } from '../state/ICommonState';
import { ActionTypes } from '../AppConstants';
import NewEmpService from '../services/NewEmployeeService';
import NewEmployeeService from '../services/NewEmployeeService';


export function GetPayrollAction(){
    return dispatch => {
          
        let formControlState = {
            
        } as IPayrollState;

        let newEmpServiceObj: NewEmpService = new NewEmpService();
       // debugger
        newEmpServiceObj.getPayrollControlState().then((resp: IPayrollState) => {
            formControlState = resp;
            dispatch({
                type: ActionTypes.GetPayrollFormControls,
                payload: formControlState
            });
        });
    }
}

// Creates a new employee request.
export function PayrollAddEmployee(empReqData: IPayrollState) {
    return dispatch => {
        let newEmpReqServiceObj: NewEmployeeService = new NewEmpService();
        newEmpReqServiceObj.PayrollAddEmployee(empReqData).then(resp => {
            console.log(resp);
            alert("New Employee is added successfully");
        }).catch(() => {
            alert("Sorry. Error while adding employee...");
        });

        dispatch({
            type: "ADD_PAYROLL_DATA",
            payload: empReqData
        });
    }
}

export function SetTabName(tabData: ICommonState) {
    return ({
        type: "SET_TAB",
        payload: tabData
    })
}