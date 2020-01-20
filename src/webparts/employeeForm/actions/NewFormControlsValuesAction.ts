/**Actions List */
//1. Get a Particular Emp Detail -- GET
//2. Get All Related Lists Items -- GET
//3. Create a Particular Emp Details --POST
//4. Update a Particular Emp Details --POST
//5. Create tran list items --POST
//6. Update tran list items --POST
//5. Delete related list items records --DELETE

// The file contains actions for the NewEmployeeReducer

import { INewFormState } from '../state/INewFormControlsState';
import { ICommonState } from '../state/ICommonState';
import NewEmpService from '../services/NewEmployeeService';
import NewEmployeeService from '../services/NewEmployeeService';
import { ActionTypes } from '../AppConstants';

//get Master Data for dropdown options
export function GetInitialControlValuesAction(EmpListID) {
    return dispatch => {

        let formControlState = {

        } as INewFormState;

        let newEmpServiceObj: NewEmpService = new NewEmpService();

        newEmpServiceObj.getNewFormControlState(EmpListID).then((resp: INewFormState) => {
            formControlState = resp;
            dispatch({
                type: ActionTypes.GetDefaultFormControls,
                payload: formControlState
            });
        });
    };
}

// Creates a new employee request.
// export function AddNewEmployee(empReqData: INewFormState) {
//     return dispatch => {
//         let newEmpReqServiceObj: NewEmployeeService = new NewEmpService();
//         newEmpReqServiceObj.AddNewEmpRequest(empReqData).then(resp => {
//             if (resp != undefined)
//                 alert("New Employee is added successfully");
//         }).catch(() => {
//             alert("Sorry. Error while adding employee...");
//         });

//         // dispatch({
//         //     type: "ADD_NEW_EMPLOYEE",
//         //     payload: empReqData
//         // });
//     }
// }

export function SetTabName(tabData: ICommonState) {
    return dispatch => {
        dispatch({
            type: ActionTypes.SetTabName,
            payload: tabData
        });
    }
}
export function RemoveDetailRowFromGrid(section, index) {
    return dispatch => {
        if (section == "Child")
            dispatch({
                type: ActionTypes.RemoveChildDetailRow,
                payload: index
            });
        if (section == "Visa")
            dispatch({
                type: ActionTypes.RemoveVisaDetailRow,
                payload: index
            });
    }
}

//add rows in detail grids
export function AddDetailRowToGrid(section) {
    var actionObj;
    if (section == "Child") {
        //add row in education detail grid
        let newChildDetailGridRow =
        {
            ChildName: '',
            DateOfBirth: ''
        }

        actionObj = {
            type: ActionTypes.AddChildDetailRow,
            payload: newChildDetailGridRow
        }

    }
    else if (section == "Visa") {
        //add row in education detail grid
        let newVisaDetailGridRow =
        {
            ValidVisa: false,
            VisaOfCountry: '',
            VisaNo: '',
            Entry: '',
            VisaValidity: null,
            IsTravelled: false
        }

        actionObj = {
            type: ActionTypes.AddVisaDetailRow,
            payload: newVisaDetailGridRow
        }

    }
    return actionObj;
}


