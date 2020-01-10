import { ICommonState, IEmpListIdState } from '../state/ICommonState';
import { ActionTypes } from '../AppConstants';

export const EmpListIdReducer = (state: IEmpListIdState = null, action) => {
    switch (action.type) {
        case ActionTypes.GetEmpID:
            state = {
                ...state,
                EmpListID: action.payload.EmpListID
            }
    }
    return state;
}

export const CommonReducer = (state: ICommonState = null, action) => {
    switch (action.type) {
        case ActionTypes.SetTabName:
            state = {
                ...state,
                CurrentForm: action.payload.CurrentForm
            };
            break;
    }
    return state;
}


