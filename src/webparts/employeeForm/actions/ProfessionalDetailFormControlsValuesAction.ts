import { IProfessionalDetailState } from '../state/IProfessionalDetailControlState';
import { ICommonState } from '../state/ICommonState';
import NewEmployeeService from '../services/NewEmployeeService';
import { ActionTypes } from '../AppConstants';
import NewEmpService from '../services/NewEmployeeService';


//Get Control Values
export function GetInitialControlValuesAction() {
    return dispatch => {

        let formControlState = {
            reasonOfLeavingOptions: []
        } as IProfessionalDetailState;

        let newEmpServiceObj: NewEmpService = new NewEmpService();
        newEmpServiceObj.getPDFormControlState().then((resp: IProfessionalDetailState) => {
            formControlState.reasonOfLeavingOptions = resp.reasonOfLeavingOptions;
            dispatch({
                type: ActionTypes.GetPdFromControls,
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