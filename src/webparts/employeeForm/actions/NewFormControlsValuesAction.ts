/**  The file contains actions for the NewEmployeeReducer */

import { INewFormState } from '../state/INewFormControlsState';
import { ICommonState } from '../state/ICommonState';
import NewEmpService from '../services/NewEmployeeService';
import { ActionTypes, AppConstats, ListNames } from '../AppConstants';

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
export function RemoveDetailRowFromGrid(removeditem,section, index) {
    return dispatch => {
        let newEmpServiceObj: NewEmpService = new NewEmpService();
        //remove row from Children detail grid
        if (section == "childDetailItems")
        newEmpServiceObj.deleteDataFromListUsingID(removeditem.childDetailId, ListNames.CHILDDETAILS);
            dispatch({
                type: ActionTypes.RemoveChildDetailRow,
                payload: index
            });
        //remove row from Visa detail grid
        if (section == "visaDetailItems")
        newEmpServiceObj.deleteDataFromListUsingID(removeditem.visaDetailId, ListNames.VISADETAILS);
            dispatch({
                type: ActionTypes.RemoveVisaDetailRow,
                payload: index
            });
    };
}

/** Method to add new blank row in Grids */
export function AddDetailRowToGrid(section) {
    var actionObj;
    if (section == "childDetailItems") {
        //add row in Children detail grid
        let newChildDetailGridRow =
        {
            childDetailId:0,
            ChildName: '',
            DateOfBirth: ''
        };
        actionObj = {
            type: ActionTypes.AddChildDetailRow,
            payload: newChildDetailGridRow
        };
    }
    else if (section == "visaDetailItems") {
        //add row in Visa detail grid
        let newVisaDetailGridRow =
        {
            visaDetailId:0,
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


