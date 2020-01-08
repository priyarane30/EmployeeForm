import * as React from 'react';
import { Form, Control, Field } from 'react-redux-form';
import {IPayrollState} from '../../state/IPayrollState';

export default class PayrollDetail extends React.Component {
    constructor(props) {
        super(props);
    }
   
 

    public render() {
        return (
            <div>
                <Form model="Payroll" >
                    <div className='col'>
                        <label>ESI Applicable:</label>
                        <Control.checkbox model='Payroll.ESIApplicable'/>
                      
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
                    <label>PF Applicable?</label>
                        <Control.checkbox model='Payroll.PFApplicable'/>
                        Yes, Applicable
                    </div>
                    <div className='col'>
                    <label>PF No:</label>
                        <Control.text model='.PFNo' id='.PFNo' />
                    </div>
                    <div className='col'>
                    <label>PF No for Dept file:</label>
                        <Control.text model='.PFNoforDeptFile' id='.PFNoforDeptFile' />
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
                        <Control.text model='.Ward_x002f_Circle' id='.Ward_x002f_Circle' />
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