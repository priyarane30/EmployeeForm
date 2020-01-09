import { IHRState } from '../state/IHRSectionControlsState';
import { ICommonState } from '../state/ICommonState';
import NewEmployeeService from '../services/NewEmployeeService';
import { ActionTypes } from '../AppConstants';
import NewEmpService from '../services/NewEmployeeService';

export function GetInitialControlValuesAction() {
    return dispatch => {

        let formControlState = {
            employmentStatusOptions: [],
            reasonOfLeavingOptions: []
        } as IHRState;

        let newEmpServiceObj: NewEmpService = new NewEmpService();

        newEmpServiceObj.getHRFormControlState().then((resp: IHRState) => {
          //  formControlState.employmentStatusOptions = resp.employmentStatusOptions;
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
    debugger
    return dispatch => {
        let newEmpReqServiceObj: NewEmployeeService = new NewEmpService();
        newEmpReqServiceObj.HrAddNewEmployee(empReqData).then(resp => {
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
export function SetTabName(tabData: ICommonState) {
    return ({
        type: "SET_TAB",
        payload: tabData
    })
}
