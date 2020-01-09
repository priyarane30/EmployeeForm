import { createStore, combineReducers, applyMiddleware } from "redux";
import { NewEmpRequestReducer } from "../reducers/NewEmpRequestReducer";
import { EducationSectionReducer } from "../reducers/EducationDetailReducer";
import { HRSectionReducer } from "../reducers/HRSectionReducer";
import { PayRollSectionReducer } from "../reducers/PayRollReducer";
import { ProfessionalDetailSectionReducer } from "../reducers/ProfessionalDetailSectionReducer"
import { CommonReducer } from "../reducers/CommonReducer";
import thunk from "redux-thunk";
// import { reducer as formReducer } from 'redux-form';
import { combineForms, createForms } from 'react-redux-form';


// Configures the redux store.
// export default function ConfigureStore():any{

//     // Combine multiple reducers to create the store. FormReducer is for the redux-form.
//     const EmpRequestStore = createStore(
//         combineReducers
//         ({
//             NewFormControlValues:NewEmpRequestReducer,
//             form:formReducer
//         }),
//         // {},
//         applyMiddleware(thunk)
//     );

//     return EmpRequestStore;
// }

// If you want your entire store to have the form state...
export const store = createStore(
    combineReducers({
        CommonReducer: CommonReducer,
        ...createForms({
            //BasicEmployee: BasicEmpReducer,
            Employee: NewEmpRequestReducer,
            HR: HRSectionReducer,
            Education : EducationSectionReducer,
            ProfessionalDetail:ProfessionalDetailSectionReducer,
            PayrollDetail:PayRollSectionReducer
        })
    }),
    applyMiddleware(thunk)
);

// Or you have an existing store and want the form state to
// exist alongside the existing state...
// const store = createStore(combineReducers({
//     existing: existingReducer,
//     foo: fooReducer,
//     bar: barReducer,

//     // ... use createForms, which will create:
//     // the model reducer at "user"
//     // the forms reducer at "forms" (e.g., "forms.user")
//     ...createForms({
//       user: initialUserState,
//     }),
//   }));
