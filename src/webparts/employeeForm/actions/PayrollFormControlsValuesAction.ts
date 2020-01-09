import { IPayrollState } from '../state/IPayrollState';
import { ICommonState } from '../state/ICommonState';
import NewEmployeeService from '../services/NewEmployeeService';
import { ActionTypes } from '../AppConstants';
import NewEmpService from '../services/NewEmployeeService';


export function PayrollAddNewEmployee(empReqData: IPayrollState) {
    debugger
    return dispatch => {
        let newEmpReqServiceObj: NewEmployeeService = new NewEmpService();
export function PayrollAddNewEmployee(empReqData: IPayrollState) {
        newEmpReqServiceObj.PayrollAddNewEmployee(empReqData).then(resp => {
            console.log(resp);
            alert("New Employee is added successfully");
        }).catch(() => {
            alert("Sorry. Error while adding employee...");
        });

        dispatch({
            type: "ADD_NEW_EMPLOYEE",
            payload: empReqData
        });
    }
}