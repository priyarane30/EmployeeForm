import * as React from 'react';
import { Form, Control, Field } from 'react-redux-form';
import { ICommonState, IEmpListIdState } from '../../state/ICommonState';
import {IPayrollState} from '../../state/IPayrollState';
import { connect } from "react-redux";
import NewEmpService from '../../services/NewEmployeeService';
import NewEmployeeService from '../../services/NewEmployeeService';
import {GetPayrollAction,SetTabName} from '../../actions/PayrollFormControlsValuesAction'
import { store } from "../../store/ConfigureStore";
import { ActionTypes } from '../../../employeeForm/AppConstants';

// Represents the connected dispatch
interface IPayrollConnectedDispatch {
    setTabName: (tabName: ICommonState) => void;
    
    getPayrollFormControls: (empListId:IEmpListIdState) => void;
  
   //save data
   //AddValueFromPayroll: (empPayrollData: IPayrollState,empListId:IEmpListIdState) => void;
}

interface IState {
    isVisible:boolean;
  }
 class PayrollDetail extends React.Component <any,IState>{
    constructor(props) {
        super(props);
        this.state = { isVisible: true };
    }
   
    componentDidMount(){
        console.log("Payroll Details");
        //this.props.getPayrollFormControls();

        const empListId = store.getState().EmpListId;
        console.log(empListId);
        this.props.getPayrollFormControls(empListId);
    }

   async handleSubmit(formValues) {
        const CommonState: ICommonState = { CurrentForm: "Payroll" };
        this.props.setTabName(CommonState);
        let empPayrollData = {} as IPayrollState;
        empPayrollData = formValues;
         const empListId = store.getState().EmpListId;
          this.setState({isVisible:true})
          debugger;
          let newEmpServiceObj: NewEmpService = new NewEmpService();
         await newEmpServiceObj.PayrollAddEmployee(empPayrollData,empListId)
         alert("New Employee payroll is added ");
         this.setState({ isVisible: false})
        
}

    public render() {
        console.log(this.state.isVisible)
        return (
            <div>
                <Form model="Payroll" onSubmit={(val) => this.handleSubmit(val)} >
                    <div className='col'>
                        <label>ESI Applicable:</label>
                        <Control.text model='.ESIApplicable' id='.ESIApplicable' />
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
                    <Control.text model='.PFApplicable' id='.PFApplicable' />
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
                    <button disabled={!this.state.isVisible} type="submit">Submit</button>
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
        getPayrollFormControls: (empListId) => {
            return dispatch(GetPayrollAction(empListId.EmpListID));
        }
        // AddValueFromPayroll: (empPayrollData: IPayrollState,empListId) => {
        //     return dispatch(PayrollAddEmployee(empPayrollData,empListId.EmpListID));
        // }
    };

  
};
export default connect(mapStateToProps, mapDispatchToProps)(PayrollDetail);