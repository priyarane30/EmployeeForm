import { Form, Control, actions } from 'react-redux-form';
import { ICommonState } from "../../../state/ICommonState";
import {
  SetTabName,
  GetInitialControlValuesAction,
  
} from "../../../actions/EducationDetailAction";
import { IEducationDetailState } from "../../../state/IEducationDetailState";

const eduDetailForm=(props, dispatch)=>{
    {console.log(props.Education)}
    return(
    <Form model="Education" onSubmit={val => this.handleSubmit(val)}>
    </Form>
    )
}