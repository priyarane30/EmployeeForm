import * as React from "react";
import { Form, Control, Field } from "react-redux-form";
import { ICommonState, IEmpListIdState } from "../../state/ICommonState";
import { IPayrollState } from "../../state/IPayrollState";
import { connect } from "react-redux";
import NewEmpService from "../../services/NewEmployeeService";
import NewEmployeeService from "../../services/NewEmployeeService";
import {
  GetPayrollAction,
  SetTabName
} from "../../actions/PayrollFormControlsValuesAction";
import { store } from "../../store/ConfigureStore";
import { ActionTypes } from "../../../employeeForm/AppConstants";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import styles from "../EmployeeForm.module.scss";

// Represents the connected dispatch
interface IPayrollConnectedDispatch {
  setTabName: (tabName: ICommonState) => void;

  getPayrollFormControls: (empListId: IEmpListIdState) => void;

  //save data
  //AddValueFromPayroll: (empPayrollData: IPayrollState,empListId:IEmpListIdState) => void;
}

interface IState {
  isVisible: boolean;
}
class PayrollDetail extends React.Component<any, IState> {
  constructor(props) {
    super(props);
    this.state = { isVisible: true };
  }

  componentDidMount() {
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
    this.setState({ isVisible: true });
    debugger;
    let newEmpServiceObj: NewEmpService = new NewEmpService();
    await newEmpServiceObj.PayrollAddEmployee(empPayrollData, empListId);
    alert("New Employee payroll is added ");
    this.setState({ isVisible: false });
  }

  public render() {
    console.log(this.state.isVisible);
    return (
      <div>
        <Form model="Payroll" onSubmit={val => this.handleSubmit(val)}>
          <div className={styles.employeeForm}>
            <div className={styles.container}>
              <div className={`ms-Grid-row  ms-fontColor-white ${styles.row}`}>
                  <div className="ms-Grid-col ms-u-sm4 block">
                    <label>ESI Applicable:</label>
                  </div>
                  <div className="ms-Grid-col ms-u-sm8 block">
                    <Control.text className={styles.marginb}
                      model=".ESIApplicable"
                      id=".ESIApplicable"
                      component={TextField}
                    />
                  </div>
                  <div className="ms-Grid-col ms-u-sm4 block">
                    <label>ESI No:</label>
                  </div>
                  <div className="ms-Grid-col ms-u-sm8 block">
                    <Control.text className={styles.marginb}
                      model=".ESINo"
                      id=".ESINo"
                      component={TextField}
                    />
                  </div>          
                  <div className="ms-Grid-col ms-u-sm4 block">
                    <label>ESIDispensary:</label>
                </div>
                  <div className="ms-Grid-col ms-u-sm8 block">
                    <Control.text className={styles.marginb}
                      model=".ESIDispensary"
                      id=".ESIDispensary"
                      component={TextField}
                    />
                  </div>
                  <div className="ms-Grid-col ms-u-sm4 block">
                    <label>PF Applicable:</label>
                  </div>
                  <div className="ms-Grid-col ms-u-sm8 block">
                    <Control.text className={styles.marginb}
                      model=".PFApplicable"
                      id=".PFApplicable"
                      component={TextField}
                    />
                  </div>
                  <div className="ms-Grid-col ms-u-sm4 block">
                    <label>PF No:</label>
                  </div>
                  <div className="ms-Grid-col ms-u-sm8 block">
                    <Control.text  className={styles.marginb} model=".PFNo" id=".PFNo" component={TextField} />
                  </div>
                  <div className="ms-Grid-col ms-u-sm4 block">
                    <label>PF No for Dept file:</label>
                  </div>
                  <div className="ms-Grid-col ms-u-sm8 block">
                    <Control.text className={styles.marginb}
                      model=".PFNoforDeptFile"
                      id=".PFNoforDeptFile"
                      component={TextField}
                    />
                  </div>
                  <div className="ms-Grid-col ms-u-sm4 block">
                    <label>Restrict PF:</label>
                  </div>
                  <div className="ms-Grid-col ms-u-sm8 block">
                    <Control.text className={styles.marginb}
                      model=".RestrictPF"
                      id=".RestrictPF"
                      component={TextField}
                    />
                  </div>
                  <div className="ms-Grid-col ms-u-sm4 block">
                    <label>Zero Pension:</label>
                  </div>
                  <div className="ms-Grid-col ms-u-sm8 block">
                    <Control.text className={styles.marginb}
                      model=".ZeroPension"
                      id=".ZeroPension"
                      component={TextField}
                    />
                  </div>
                  <div className="ms-Grid-col ms-u-sm4 block">
                    <label>Zero PT:</label>
                  </div>
                  <div className="ms-Grid-col ms-u-sm8 block">
                    <Control.text className={styles.marginb}
                      model=".ZeroPT"
                      id=".ZeroPT"
                      component={TextField}
                    />
                  </div>
                  <div className="ms-Grid-col ms-u-sm4 block">
                    <label>Ward/Circle:</label>
                  </div>
                  <div className="ms-Grid-col ms-u-sm8 block">
                    <Control.text className={styles.marginb}
                      model=".Ward_x002f_Circle"
                      id=".Ward_x002f_Circle"
                      component={TextField}
                    />
                  </div>
                  <div className="ms-Grid-col ms-u-sm4 block">
                    <label>Director:</label>
                  </div>
                  <div className="ms-Grid-col ms-u-sm8 block">
                    <Control.text className={styles.marginb}
                        model=".Director"
                        id=".Director"
                        component={TextField}
                    />
                </div>  
                <button disabled={!this.state.isVisible} type="submit">Submit </button>          
              </div>
            </div>
          </div>
        
        </Form>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  console.log(state);
  return state;
};

// Maps dispatch to props
const mapDispatchToProps = (dispatch): IPayrollConnectedDispatch => {
  return {
    setTabName: SetTabName,
    //setReqDigest : SetReqDigest,
    getPayrollFormControls: empListId => {
      return dispatch(GetPayrollAction(empListId.EmpListID));
    }
    // AddValueFromPayroll: (empPayrollData: IPayrollState,empListId) => {
    //     return dispatch(PayrollAddEmployee(empPayrollData,empListId.EmpListID));
    // }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PayrollDetail);
