/**  The file contains actions for the NewEmployeeReducer */

import { INewFormState } from '../state/INewFormControlsState';
import { ICommonState } from '../state/ICommonState';
import NewEmpService from '../services/NewEmployeeService';
import { ActionTypes } from '../AppConstants';

/**Get default values for Emp Details Form from sharepoint lists */
export function GetInitialControlValuesAction(EmpListID) {
    return dispatch => {

        let formControlState = {} as INewFormState;
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

export function SetTabName(tabData: ICommonState) {
    return dispatch => {
        dispatch({
            type: ActionTypes.SetTabName,
            payload: tabData
        });
    };
}

/** Method to remove row from Grids */
export function RemoveDetailRowFromGrid(section, index) {
    return dispatch => {
        //remove row from Children detail grid
        if (section == "Child")
            dispatch({
                type: ActionTypes.RemoveChildDetailRow,
                payload: index
            });
        //remove row from Visa detail grid
        if (section == "Visa")
            dispatch({
                type: ActionTypes.RemoveVisaDetailRow,
                payload: index
            });
    };
}

/** Method to add new blank row in Grids */
export function AddDetailRowToGrid(section) {
    var actionObj;
    if (section == "Child") {
        //add row in Children detail grid
        let newChildDetailGridRow =
        {
            ChildName: '',
            DateOfBirth: ''
        };
        actionObj = {
            type: ActionTypes.AddChildDetailRow,
            payload: newChildDetailGridRow
        };
    }
    else if (section == "Visa") {
        //add row in Visa detail grid
        let newVisaDetailGridRow =
        {
            ValidVisa: false,
            VisaOfCountry: '',
            VisaNo: '',
            Entry: '',
            VisaValidity: null,
            IsTravelled: false
        };
        actionObj = {
            type: ActionTypes.AddVisaDetailRow,
            payload: newVisaDetailGridRow
        };
    }
    return actionObj;
}


