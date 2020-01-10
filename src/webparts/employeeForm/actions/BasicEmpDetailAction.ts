import { IBasicDetailState } from '../state/IBasicDetailState';
import BasicFormService from '../services/BasicFormService';
import UtilityService from '../services/UtilityService';
import { ActionTypes } from '../AppConstants';
import { ICommonState, IEmpListIdState } from '../state/ICommonState';
export function GetEmpBasicData() {
    return dispatch => {

        let basicFormState = {} as IBasicDetailState;
        let newBasicFormServiceObj: BasicFormService = new BasicFormService();

        newBasicFormServiceObj.GetEmpBasicData().then((resp: IBasicDetailState) => {
            debugger
            basicFormState = resp;
            // basicFormState.technologyOptions = resp.technologyOptions;

            dispatch({
                type: ActionTypes.GetBasicFormControls,
                payload: basicFormState
            });
        });
    }
}

export function SetTabName(tabData) {
    return dispatch => {
        dispatch({
            type: ActionTypes.SetTabName,
            payload: tabData
        });
    }
}

export function GetEmpListIdUsingUserEmail(currUserEmail) {
    return dispatch => {
        let newEmpServiceObj: UtilityService = new UtilityService();
        let empIdState = { EmpListID: 0 } as IEmpListIdState;
        newEmpServiceObj.GetEmpIdByUserEmail(currUserEmail).then((resp) => {
            if (resp != null && resp != undefined && resp != 0) {
                empIdState.EmpListID = resp;
            }
            dispatch({
                type: ActionTypes.GetEmpID,
                payload: empIdState
            });
        });

    }
}