import * as React from 'react';
import { Form, Control,Errors } from 'react-redux-form';
import { ICommonState, IEmpListIdState } from '../../state/ICommonState';
import { connect } from "react-redux";
import { SetTabName, GetInitialControlValuesAction } from "../../actions/HRFormControlsValuesAction";
import { IHRState } from '../../state/IHRSectionControlsState';
import { store } from "../../store/ConfigureStore";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
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
    getDefaultControlsData: (empListId: IEmpListIdState) => void;// Gets the default form values from sp lists
}

class HRDetail extends React.Component<any, IControls> {
    constructor(props, ) {
        super(props);
        this.state = {
            Manager: [],
            buttonDisabled: false
        };
    }
    public async componentDidMount() {
        // <DatePicker maxDate={new Date()}>
        // </DatePicker>
        const empListId = store.getState().EmpListId;
        this.props.getDefaultControlsData(empListId);//empListId

        let newEmpServiceObj: NewEmployeeService = new NewEmployeeService();
        let myemail = await newEmpServiceObj.getManagerEmail(empListId);
        this.setState({ Manager: myemail });
        this.PeoplePickerItems = this.PeoplePickerItems.bind(this);
    }
    public async handleSubmit(formValues) {
        this.props.handleSpinner(false);
        const CommonState: ICommonState = { CurrentForm: "HR" };
        this.props.setTabName(CommonState);

        //Save The Data
        let empHrData = {} as IHRState;
        empHrData = formValues;

        let managerdata = await this.getUserId(this.state.Manager);
        const empListId = store.getState().EmpListId;

        this.setState({ buttonDisabled: true });
        let newEmpReqServiceObj: NewEmployeeService = new NewEmployeeService();
        await newEmpReqServiceObj.HrAddNewEmployee(empHrData, managerdata, empListId);
        this.setState({ buttonDisabled: false });
        this.props.handleSpinner(true);
        //EndSave The Data
        this.props.handleTabClick();
    }

    public render() {
        pnp.setup({
            spfxContext: this.props.context
        });
        if (!this.props.HR) return (<div> Loading.... </div>);
        return (
            <div>
                <div className={styles.employeeForm}>
                    <div className={styles.container}>
                        <div className={`ms-Grid-row ${styles.row}`}>
                            {/* ms-fontColor-white  */}
                            <Form model="HR" onSubmit={(val) => this.handleSubmit(val)}>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    {/* User Alias*/}
                                    <div className='ms-Grid-col ms-u-sm2'>
                                        <label>User Alias:</label>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm4'>
                                        <Control.text model='HR.UserAlies' id='.UserAlies' component={TextField} className={styles.marginb} />
                                    </div>
                                    {/* Name of employee*/}
                                    <div className='ms-Grid-col ms-u-sm2 block'>
                                        <label>AD Login Name of Employee:</label>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm4'>
                                        <Control.text model='HR.ADLogin' id='HR.ADLogin' component={TextField} className={styles.marginb} disabled />
                                    </div>
                                </div>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    {/* Manager*/}
                                    <div className='ms-Grid-col ms-u-sm2 block'>
                                        <label>Manager:</label>
                                    </div>
                                    <div className={`ms-Grid-col ms-u-sm4 block ${styles.marginb}`}>
                                        <PeoplePicker
                                            context={this.props.context}
                                            personSelectionLimit={1}
                                            groupName={""} // Leave this blank in case you want to filter from all users
                                            showtooltip={false}
                                            disabled={false}
                                            ensureUser={true}
                                            selectedItems={this.PeoplePickerItems}
                                            showHiddenInUI={false}
                                            principalTypes={[PrincipalType.User]}
                                            resolveDelay={1000}
                                            defaultSelectedUsers={[this.state.Manager] ? [this.state.Manager] : null}
                                        />
                                    </div>
                                    {/* Employment Status */}
                                    <div className='ms-Grid-col ms-u-sm2 block'>
                                        <label>Employment Status:</label>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm4 block'>
                                        <Control.select model="HR.employementStatus" id="HR.employementStatus" className={styles.dropdowncustomhr} >
                                            <option value="Assigned to HR">Assigned to HR</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Saved">Saved</option>
                                        </Control.select>
                                    </div>
                                </div>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    {/* Last Designation */}
                                    <div className='ms-Grid-col ms-u-sm2 block'>
                                        <label>Last Designation:</label>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm4 block'>
                                        <Control.select model="HR.LastDesignation" id="HR.LastDesignation" className={styles.dropdowncustomhr}>
                                            <option>--Select--</option>

                                            {this.props.HR.LastDesignationOptions.map(options => {
                                                return (<option key={options}
                                                    value={options}>{options}</option>);
                                            })};

                                    </Control.select>
                                    </div>
                                    {/* Last Prompted Date*/}
                                    <div className='ms-Grid-col ms-u-sm2 block'>
                                        <label>Last Promoted Date:</label>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm4 block'>
                                        <Control model='HR.LastPromotedDate' id='HR.LastPromotedDate' component={DatePicker} placeholder='dd-MM-yyyy'   className={styles.marginb}
                                            mapProps={{
                                                value: (props) => { return props.viewValue; },
                                                onSelectDate: (props) => { return props.onChange; }
                                              
                                            }}
                                            //put date validation Date can't be future date
                                            validators={{
                                                requiredPromotedDate: (val) => (val  && (new Date()>new Date(val))),
                                            }}
                                            >
                                            </Control>
                                            <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model="HR.LastPromotedDate"
                                            messages={{
                                                requiredPromotedDate: "Date can't be future date"
                                            }}
                                        ></Errors>
                                    </div>
                                </div>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    {/* Date of leaving*/}
                                    <div className='ms-Grid-col ms-u-sm2 block'>
                                        <label>Date of leaving:</label>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm4 block'>
                                        <Control model='HR.DateofLeft' id='HR.DateofLeft' component={DatePicker } placeholder='dd-MM-yyyy'  className={styles.marginb}
                                        
                                            mapProps={{
                                                value: (props) => { return props.viewValue; },
                                                onSelectDate: (props) => { return props.onChange; }
                                            }}
                                            validators={{
                                                requiredDateOfLeaving: (val) => (val  && (new Date()>new Date(val))),
                                            }}
                                            >
                                            </Control>
                                            <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model="HR.DateofLeft"
                                            messages={{
                                                requiredDateOfLeaving: "Date can't be future date"
                                            }}
                                            ></Errors>
                                    </div>
                                    {/* Reason for leaving */}
                                    <div className='ms-Grid-col ms-u-sm2 block'>
                                        <label>Reason for leaving:</label>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm4 block'>
                                        <Control.select model="HR.reasonForLeaving" id="HR.reasonForLeaving" className={styles.dropdowncustomhr}>
                                            <option>--Select--</option>

                                            {this.props.HR.reasonOfLeavingOptions.map(reasons => {
                                                return (<option key={reasons}
                                                    value={reasons}>{reasons}</option>);
                                            })};
                                           
                                    </Control.select>
                                    </div>
                                </div>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    {/* Date of Resignation*/}
                                    <div className='ms-Grid-col ms-u-sm2 block'>
                                        <label>Resignation Date:</label>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm4 block'>
                                        <Control model='HR.ResigntionDate' id='HR.ResigntionDate' component={DatePicker} placeholder='dd-MM-yyyy' className={styles.marginb}
                                            mapProps={{
                                                value: (props) => { return props.viewValue; },
                                                onSelectDate: (props) => { return props.onChange; }
                                            }}
                                            validators={{
                                                requiredResignation: (val) => (val  && (new Date()>new Date(val))),
                                            }}                                           
                                            ></Control>
                                             <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model="HR.ResigntionDate"
                                            messages={{
                                                requiredResignation: "Date can't be future date"
                                            }}>
                                            ></Errors>
                                    </div>
                                    {/* Eligible for rehire*/}
                                    <div className='ms-Grid-col ms-u-sm2 block'>
                                        <label>Eligible for Rehire:</label>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm4 block'>
                                        <Control.checkbox model='HR.EligibleforRehire' id='HR.EligibleforRehire' />
                                    </div>
                                </div>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    <div className="ms-Grid-col ms-u-sm12 block">
                                        <DefaultButton id="DefaultSubmit" primary={true} text={"Submit"} type="submit"
                                            disabled={this.state.buttonDisabled} className={styles.submitbutton} />
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div >
            </div>);
    }
    private PeoplePickerItems(items: any[]) {
        let array = [];
        array.push({ 'Email': items[0].secondaryText });
        this.setState({ Manager: array[0].Email });

    }
    public getUserId(email: string): Promise<any> {
        return pnp.sp.site.rootWeb.ensureUser(email).
            then(result => {
                return result.data.Id;
            });
    }
}
const mapStateToProps = (state) => {
    return state;
};
// Maps dispatch to props
const mapDispatchToProps = (dispatch): IHRConnectedDispatch => {
    return {
        setTabName: SetTabName,
        getDefaultControlsData: (empListId) => {
            return dispatch(GetInitialControlValuesAction(empListId.EmpListID));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HRDetail);
