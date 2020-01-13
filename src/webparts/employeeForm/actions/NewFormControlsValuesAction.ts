/**Actions List */
//1. Get a Particular Emp Detail -- GET
//2. Get All Related Lists Items -- GET
//3. Create a Particular Emp Details --POST
//4. Update a Particular Emp Details --POST
//5. Create tran list items --POST
//6. Update tran list items --POST
//5. Delete related list items records --DELETE

// The file contains actions for the NewEmployeeReducer

import {INewFormState} from '../state/INewFormControlsState';
import { ICommonState } from '../state/ICommonState';
import NewEmpService from '../services/NewEmployeeService';
import NewEmployeeService from '../services/NewEmployeeService';
import { ActionTypes } from '../AppConstants';

//get Master Data for dropdown options
export function GetInitialControlValuesAction() {
    return dispatch => {

        let formControlState = {
            genderOptions: [],
            designationOptions: [],
            maritalStatusOptions: [],
            technologyOptions : []            
        } as INewFormState;

        let newEmpServiceObj: NewEmpService = new NewEmpService();

        newEmpServiceObj.getNewFormControlState().then((resp: INewFormState) => {
            formControlState.genderOptions = resp.genderOptions;
            formControlState.designationOptions = resp.designationOptions;
            formControlState.maritalStatusOptions = resp.maritalStatusOptions;
            formControlState.technologyOptions = resp.technologyOptions;
            dispatch({
                type: ActionTypes.GetDefaultFormControls,
                payload: formControlState
            });
        });
    };
}

// Creates a new employee request.
export function AddNewEmployee(empReqData: INewFormState) {
    return dispatch => {
        let newEmpReqServiceObj: NewEmployeeService = new NewEmpService();
        newEmpReqServiceObj.AddNewEmpRequest(empReqData).then(resp => {
            if (resp != undefined)
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
    return dispatch => {
        dispatch({
            type: ActionTypes.SetTabName,
            payload: tabData
        });
    }
}
