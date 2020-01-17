import { IPayrollState } from '../state/IPayrollState';
import { ICommonState } from '../state/ICommonState';
import { ActionTypes } from '../AppConstants';
import NewEmpService from '../services/NewEmployeeService';
import NewEmployeeService from '../services/NewEmployeeService';


export function GetPayrollAction(EmpListID){
    return dispatch => {
          
        let formControlState = {
            
        } as IPayrollState;

        let newEmpServiceObj: NewEmpService = new NewEmpService();
        newEmpServiceObj.getPayrollControlState(EmpListID).then((resp: IPayrollState) => {
            formControlState = resp;
            dispatch({
                type: ActionTypes.GetPayrollFormControls,
                payload: formControlState
            });
        });
    }
}

//Creates a new employee request.
// export function PayrollAddEmployee(empReqData: IPayrollState,EmpListID) {
//     return dispatch => {
//         let newEmpReqServiceObj: NewEmployeeService = new NewEmpService();
//         newEmpReqServiceObj.PayrollAddEmployee(empReqData,EmpListID).then(resp => {
//             console.log(resp);
//             alert("New Employee Payroll data is added successfully");
//         }).catch(() => {
//             alert("Sorry. Error while adding employee...");
//         });

//         dispatch({
//             type: ActionTypes.AddValueFromPayroll,
//             payload: empReqData
//         });
//     }
// }

export function SetTabName(tabData: ICommonState) {
    return ({
        type: "SET_TAB",
        payload: tabData
    })
}