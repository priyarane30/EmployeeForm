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
                type: ActionTypes.GetDefaultFormControls,
                payload: formControlState
            });
        });
    };
}

export function SetTabName(tabData: ICommonState) {
    return ({
        type: "SET_TAB",
        payload: tabData
    })
}


// export function SetReqDigest(reqDigest: ) {
//     return ({
//         type: "SET_REQ_DIGEST",
//         payload: reqDigest
//     })
// }

