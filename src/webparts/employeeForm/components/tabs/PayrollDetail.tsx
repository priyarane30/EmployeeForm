import * as React from 'react';
import { Form, Control, Field } from 'react-redux-form';
import { ICommonState } from '../../state/ICommonState';
import {IPayrollState} from '../../state/IPayrollState';
import { connect } from "react-redux";
import {GetPayrollAction,SetTabName,PayrollAddEmployee} from '../../actions/PayrollFormControlsValuesAction'

// Represents the connected dispatch
interface IPayrollConnectedDispatch {
    setTabName: (tabName: ICommonState) => void;
    
    getPayrollFormControls: () => void;
  
   //save data
   PayrollAddEmployee: (empPayrollData: IPayrollState) => void;
}

 class PayrollDetail extends React.Component <any>{
    constructor(props) {
        super(props);
        this.props.getPayrollFormControls();
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

        let empPayrollData = {} as IPayrollState;
        empPayrollData = formValues;
        // Call the connected dispatch to create new purchase request
        this.props.PayrollAddEmployee(empPayrollData);
    }

    public render() {
        return (
            <div>
                <Form model="Payroll" onSubmit={(val) => this.handleSubmit(val)} >
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
                    {/* <label>PF Applicable?</label>
                        <Control.checkbox model='Payroll.PFApplicable'/>
                        Yes, Applicable */}

                    <label>PF Applicable:</label>
                    <Control.checkbox model='Payroll.PFApplicable' id='Payroll.PFApplicable' />

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


const mapStateToProps = function (state) {
    console.log(state)
    return state;
}

// Maps dispatch to props
const mapDispatchToProps = (dispatch): IPayrollConnectedDispatch => {
    return {
        setTabName: SetTabName,
        //setReqDigest : SetReqDigest,
        getPayrollFormControls: () => {
            return dispatch(GetPayrollAction());
        },
        PayrollAddEmployee: (empHrData: IPayrollState) => {
            return dispatch(PayrollAddEmployee(empHrData));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(PayrollDetail);