import { IBasicDetailState } from '../state/IBasicDetailState';
import BasicFormService from '../services/BasicFormService';
import UtilityService from '../services/UtilityService';
import { ActionTypes } from '../AppConstants';
import { IEmpListIdState } from '../state/ICommonState';
export function GetEmpBasicData(empListId) {
    return dispatch => {
        let basicFormState = {} as IBasicDetailState;
        let newBasicFormServiceObj: BasicFormService = new BasicFormService();

        if (empListId > 0) {
            debugger;
             newBasicFormServiceObj.GetEmpBasicDataById(empListId).then((resp: IBasicDetailState) => {
                basicFormState = resp;
                dispatch({
                    type: ActionTypes.GetBasicFormControls,
                    payload: basicFormState
                });
            });
        }
        else {
            debugger;
            newBasicFormServiceObj.GetEmpBasicData().then((resp: IBasicDetailState) => {
                basicFormState = resp;
                dispatch({
                    type: ActionTypes.GetBasicFormControls,
                    payload: basicFormState
                });
            });
        }
    };
}

export function SetTabName(tabData) {
    return dispatch => {
        dispatch({
            type: ActionTypes.SetTabName,
            payload: tabData
        });
    };
}

export async function GetEmpListIdByUserEmail(currUserEmail) {
    let newEmpServiceObj: UtilityService = new UtilityService();
    let empIdState = { EmpListID: 0 } as IEmpListIdState;
    await newEmpServiceObj.GetEmpIdByUserEmail(currUserEmail).then((resp) => {
        if (resp != null && resp != undefined && resp != 0) {
            debugger;
            empIdState.EmpListID = resp;
        }
       debugger;
    });
    return empIdState;
}

export function SetEmpIdInStore(empListId) {
   
    return dispatch => {
        dispatch({
            type: ActionTypes.SetEmpID,
            payload: empListId
        });
    };
}