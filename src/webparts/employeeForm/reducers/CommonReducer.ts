import { ICommonState } from '../state/ICommonState';

export const commonStateInitialState: ICommonState = {
    CurrentForm: ""
}

export const CommonReducer = (state: ICommonState = commonStateInitialState, action) => {
    switch (action.type) {
        case "SET_TAB":
            state = {
                ...state,
                CurrentForm: action.payload.CurrentForm
            };
            break;
    }
    
    return state;
}
