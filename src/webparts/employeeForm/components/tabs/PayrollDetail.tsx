import * as React from 'react';
import { Form, Control, Field } from 'react-redux-form';
import { ICommonState } from '../../state/ICommonState';
import {IPayrollState} from '../../state/IPayrollState';

export default class PayrollDetail extends React.Component <any>{
    constructor(props) {
        super(props);
    }
   
    handleSubmit(formValues) {
        // Do anything you want with the form value
        console.log(formValues);
        // Do whatever you like in here.
        // If you connect the UserForm to the Redux store,
        // you can dispatch actions such as:
        // dispatch(actions.submit('user', somePromise));
        // etc.
        const CommonState: ICommonState = { CurrentForm: "Payroll" };
        this.props.setTabName(CommonState);

        //     // Do whatever you like in here.
        //     // If you connect the UserForm to the Redux store,
        //     // you can dispatch actions such as:
        //     // dispatch(actions.submit('user', somePromise));
        //     // etc.
    }

    public render() {
        return (
            <div>
                <Form model="Payroll" onSubmit={(val) => this.handleSubmit(val)} >
                    <div className='col'>
                        <label>ESI Applicable:</label>
                        <Field model=".ESIApplicable" className="field">
                            <label>
                                <input type="radio" value="Yes" />
                                Yes
                            </label>
                            <label>
                                <input type="radio" value="No" />
                                No
                            </label>
                            </Field>
                      
                    </div>
                    <div className='col'>
                    <label>ESI No:</label>
                        <Control.text model='.ESINo' id='.ESINo' />
                    </div>
                    <div className='col'>
                    <label>ESIDispensary:</label>
                        <Control.text model='.ESIDispensary' id='.ESIDispensary' />
                    </div>
                    <div className='col'>
                    <label>PF Applicable:</label>
                    <Control.checkbox model='Payroll.PFApplicable' id='Payroll.PFApplicable' />
                        
                    </div>
                    <div className='col'>
                    <label>PF No:</label>
                        <Control.text model='.PFNo' id='.PFNo' />
                    </div>
                    <div className='col'>
                    <label>PF No for Dept file:</label>
                        <Control.text model='.PFNODept' id='.PFNODept' />
                    </div>
                    <div className='col'>
                    <label>Restrict PF:</label>
                        <Control.text model='.RestrictPF' id='.RestrictPF' />
                    </div>
                    <div className='col'>
                    <label>Zero Pension:</label>
                        <Control.text model='.ZeroPension' id='.ZeroPension' />
                    </div>
                    <div className='col'>
                    <label>Zero PT:</label>
                        <Control.text model='.ZeroPT' id='.ZeroPT' />
                    </div>
                    <div className='col'>
                    <label>Ward/Circle:</label>
                        <Control.text model='.Ward' id='.Ward' />
                    </div>
                    <div className='col'>
                    <label>Director:</label>
                        <Control.text model='.Director' id='.Director' />
                    </div>
                    <button type="submit">Submit</button>
                </Form>
            </div>);

    }
}