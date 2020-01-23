import * as React from 'react';
import { Form, Control } from 'react-redux-form';
import { ICommonState, IEmpListIdState } from '../../state/ICommonState';
import { connect } from "react-redux";
import { SetTabName, GetInitialControlValuesAction, HrAddNewEmployee } from "../../actions/HRFormControlsValuesAction";
import { IHRState } from '../../state/IHRSectionControlsState';
import { store } from "../../store/ConfigureStore";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button";
import styles from "../EmployeeForm.module.scss";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import pnp from 'sp-pnp-js';
import NewEmployeeService from '../../services/NewEmployeeService';
export interface IControls {
    Manager: any;
    buttonDisabled: boolean;
}

export interface IPeoplePickerControl {
    id: string;
    secondaryText: string;
    text: string;
    ID: number;
}

// Represents the connected dispatch
interface IHRConnectedDispatch {
    setTabName: (tabName: ICommonState) => void;

    // Gets the options for dropdown fields
    getDefaultControlsData: (empListId: IEmpListIdState) => void;

}
class HRDetail extends React.Component<any, IControls> {
    constructor(props, ) {
        super(props);
        this.state = {
            Manager: [],
            buttonDisabled: false
        };
    }
    public componentDidMount() {
        console.log("HR Details");

        const empListId = store.getState().EmpListId;
        this.props.getDefaultControlsData(empListId);//empListId

        var myemail = [];
        myemail.push('priya.rane@synoverge.com');
        this.setState({ Manager: myemail });
        this.PeoplePickerItems = this.PeoplePickerItems.bind(this);
    }
    async handleSubmit(formValues) {
        const CommonState: ICommonState = { CurrentForm: "HR" };
        this.props.setTabName(CommonState);

        //Save The Data
        let empHrData = {} as IHRState;
        empHrData = formValues;
        let managerdata = this.state.Manager;
        const empListId = store.getState().EmpListId;

        this.setState({ buttonDisabled: true });
        let newEmpReqServiceObj: NewEmployeeService = new NewEmployeeService();
        await newEmpReqServiceObj.HrAddNewEmployee(empHrData, managerdata, empListId);
        this.setState({ buttonDisabled: false });
        
        //EndSave The Data
        this.props.handleTabClick();
    }

    public render() {
        pnp.setup({
            spfxContext: this.props.context
        });
        if (!this.props.HR) return (<div> Loading.... </div>);
        return (
            <div className={styles.employeeForm}>
                <div className={styles.container}>
                    <div className="ms-Grid">
                        <div className={`ms-Grid-row  ms-fontColor-white ${styles.row}`}>
                            <Form model="HR" onSubmit={(val) => this.handleSubmit(val)}>

                                {/* User Alias*/}
                                <div className='ms-Grid-col ms-u-sm4'>
                                    <label>User Alias:</label>
                                </div>
                                <div className='ms-Grid-col ms-u-sm8'>
                                    <Control.text model='HR.UserAlies' id='.UserAlies' component={TextField} className={styles.marginb}/>
                                </div>
                                {/* Name of employee*/}
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>AD Login Name of Employee:</label>
                                </div>
                                <div className='ms-Grid-col ms-u-sm8'>
                                    <Control.text model='HR.ADLogin' id='HR.ADLogin' component={TextField} className={styles.marginb}/>
                                </div>
                                {/* Manager*/}
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Manager:</label>
                                </div>
                                <div className={`ms-Grid-col ms-u-sm8 block ${styles.marginb}`}>
                                    <PeoplePicker
                                        context={this.props.context}
                                        personSelectionLimit={1}
                                        groupName={""} // Leave this blank in case you want to filter from all users
                                        showtooltip={false}
                                        isRequired={true}
                                        disabled={false}
                                        ensureUser={true}
                                        selectedItems={this.PeoplePickerItems}
                                        showHiddenInUI={false}
                                        principalTypes={[PrincipalType.User]}
                                        resolveDelay={1000}
                                        defaultSelectedUsers={this.state.Manager ? this.state.Manager : null}
                                    />
                                </div>
                                {/* Employment Status */}
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Employment Status:</label>
                                </div>
                                <div className='ms-Grid-col ms-u-sm8 block'>
                                    <Control.select model="HR.employementStatus" id="HR.employementStatus" className={styles.dropdowncustom}>
                                        <option value="Assigned to HR">Assigned to HR</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Saved">Saved</option>
                                    </Control.select>
                                </div>
                                {/* Date of leaving*/}
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Date of leaving:</label>
                                </div>
                                <div className='ms-Grid-col ms-u-sm8 block'>
                                    <Control model='HR.DateOfLeaving' id='HR.DateOfLeaving' component={DatePicker} placeholder='dd-MM-yyyy' className={styles.marginb}
                                    mapProps={{
                                        value: (props) => { return props.viewValue },
                                        onSelectDate: (props) => { return props.onChange }
                                    }}></Control>
                                </div>
                                {/* Reason for leaving */}
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Reason for leaving:</label>
                                </div>
                                <div className='ms-Grid-col ms-u-sm8 block'>
                                    <Control.select model="HR.reasonForLeaving" id="HR.reasonForLeaving" className={styles.dropdowncustom}>
                                        <option>--Select--</option>

                                        {this.props.HR.reasonOfLeavingOptions.map(reasons => {
                                            return (<option key={reasons}
                                                value={reasons}>{reasons}</option>);
                                        })};
                                    </Control.select>
                                </div>
                                {/* Date of Resignation*/}
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Resignation Date:</label>
                                </div>
                                <div className='ms-Grid-col ms-u-sm8 block'>
                                <Control model='HR.ResigntionDate' id='HR.ResigntionDate' component={DatePicker} placeholder='dd-MM-yyyy' className={styles.marginb}
                                    mapProps={{
                                        value: (props) => { return props.viewValue },
                                        onSelectDate: (props) => { return props.onChange }
                                    }}></Control>
                                </div>
                                {/* Eligible for rehire*/}
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Eligible for Rehire:</label>
                                </div>
                                <div className='ms-Grid-col ms-u-sm8 block'>
                                    <Control.checkbox model='HR.EligibleforRehire' id='HR.EligibleforRehire' />
                                </div>
                                <DefaultButton id="DefaultSubmit" primary={true} text={"Submit"} type="submit"
                                    disabled={this.state.buttonDisabled} className={styles.button} />
                            </Form>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
    private PeoplePickerItems(items: any[]) {
        this.getUserId(items[0].secondaryText).then(resp => {
            this.setState({ Manager: resp });
        });
    }
    public getUserId(email: string): Promise<number> {
        return pnp.sp.site.rootWeb.ensureUser(email).
            then(result => { return result.data.Id; });
    }
}

const mapStateToProps = (state) => {
    console.log(state);
    return state;
};

// Maps dispatch to props
const mapDispatchToProps = (dispatch): IHRConnectedDispatch => {
    return {
        setTabName: SetTabName,
        //setReqDigest : SetReqDigest,
        getDefaultControlsData: (empListId) => {
            return dispatch(GetInitialControlValuesAction(empListId.EmpListID));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(HRDetail);
