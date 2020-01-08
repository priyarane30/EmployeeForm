import { IBasicDetailState } from '../state/IBasicDetailState';
import NewEmpService from '../services/NewEmployeeService';
import { ActionTypes } from '../AppConstants';
export function GetAllFormFields() {
    return dispatch => {

        let formControlState = {
            // genderOptions: [],
            // designationOptions: [],
            // maritalStatusOptions: [],
            // technologyOptions: []
        } as IBasicDetailState;

        let newEmpServiceObj: NewEmpService = new NewEmpService();

        newEmpServiceObj.getNewFormControlState().then((resp: IBasicDetailState) => {
            // formControlState.genderOptions = resp.genderOptions;
            // formControlState.designationOptions = resp.designationOptions;
            // formControlState.maritalStatusOptions = resp.maritalStatusOptions;
            // formControlState.technologyOptions = resp.technologyOptions;
            dispatch({
                type: ActionTypes.GetDefaultFormControls,
                payload: formControlState
            });
        });
    }
}