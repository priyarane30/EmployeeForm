import { IHRState } from '../state/IHRSectionControlsState';
import { ICommonState , IEmpListIdState} from '../state/ICommonState';
import NewEmployeeService from '../services/NewEmployeeService';
import { ActionTypes } from '../AppConstants';
import NewEmpService from '../services/NewEmployeeService';

//Get all Control's Values
export function GetInitialControlValuesAction(EmpListID) {
    return dispatch => {

        let formControlState = {
            employmentStatusOptions: [],
            reasonOfLeavingOptions: [],
            UserAlies: '',
            ADLogin: '',
            Manager: '',
            employementStatus: '',
            DateOfLeaving: '', //dateTime?
            reasonForLeaving: '',
            ResigntionDate: '', //datetime?
            EligibleforRehire: false,
        } as IHRState;

        let newEmpServiceObj: NewEmpService = new NewEmpService();
        newEmpServiceObj.getHRFormControlState(EmpListID).then((resp: IHRState) => {

            //DropDown Field Value
            formControlState.reasonOfLeavingOptions = resp.reasonOfLeavingOptions;
            formControlState.employmentStatusOptions=[];
            //textbox Values
            formControlState.UserAlies = resp.UserAlies;
            formControlState.ADLogin = resp.ADLogin;
            formControlState.Manager = resp.Manager;
            formControlState.employementStatus =resp.employementStatus;
            formControlState.DateOfLeaving = resp.DateOfLeaving;
            formControlState.reasonForLeaving = resp.reasonForLeaving;
            formControlState.ResigntionDate =resp.ResigntionDate;
            formControlState.EligibleforRehire = true;
            dispatch({
                type: ActionTypes.GetHRFormControls,
                payload: formControlState
            });
        });
    };
}

// Creates a new employee request.
export function HrAddNewEmployee(empReqData: IHRState,EmpListID) {
    return dispatch => {
        let newEmpReqServiceObj: NewEmployeeService = new NewEmpService();
        newEmpReqServiceObj.HrAddNewEmployee(empReqData,EmpListID).then(resp => {
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
        type: "SET_TAB",
        payload: tabData
    });
}
