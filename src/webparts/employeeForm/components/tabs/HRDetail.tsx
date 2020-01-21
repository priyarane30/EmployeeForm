import * as React from 'react';
import { Form, Control } from 'react-redux-form';
import { ICommonState, IEmpListIdState } from '../../state/ICommonState';
import { connect } from "react-redux";
import { SetTabName, GetInitialControlValuesAction, HrAddNewEmployee } from "../../actions/HRFormControlsValuesAction";
import { IHRState } from '../../state/IHRSectionControlsState';
import { store } from "../../store/ConfigureStore";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { IEmployeeFormProps } from '../IEmployeeFormProps';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import peoplepicker from '../peoplepicker';
const MyTextInput = (props) => <input className="my-input" {...props} />;


// Represents the connected dispatch
interface IHRConnectedDispatch {
    setTabName: (tabName: ICommonState) => void;

    // Gets the options for dropdown fields
    getDefaultControlsData: (empListId: IEmpListIdState) => void;


    //save data
    AddValueFromHR: (empHrData: IHRState, empListId: IEmpListIdState) => void;


}
class HRDetail extends React.Component<any> {
    constructor(props) {
        super(props);
    }
    public componentDidMount() {
        console.log("HR Details");
        const empListId = store.getState().EmpListId;
        this.props.getDefaultControlsData(empListId);
      //  this.props.passprop(this.props.context);
        console.log(this.props.context)
    }
    public handleSubmit = (formValues) => {
        console.log(formValues);
        const CommonState: ICommonState = { CurrentForm: "HR" };
        this.props.setTabName(CommonState);

        //Save The Data
        let empHrData = {} as IHRState;
        empHrData = formValues;
        const empListId = store.getState().EmpListId;
        this.props.AddValueFromHR(empHrData, empListId);
        //EndSave The Data
    }
    private _getPeoplePickerItems(items: any[]) {
        console.log('Items:', items);
    }
    public render() {
        if (!this.props.HR) return (<div> Loading.... </div>);
        return (
            <div>
                {/* <PeoplePicker
                    context={this.props.context}
                    titleText="People Picker"
                    personSelectionLimit={3}
                    groupName={"Leadership Connection Owners"} // Leave this blank in case you want to filter from all users    
                    showtooltip={true}
                    isRequired={true}
                    disabled={false}
                    ensureUser={true}
                    selectedItems={this._getPeoplePickerItems}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000}
                /> */}
                <Form model="HR" onSubmit={(val) => this.handleSubmit(val)}>

                    <div className="ms-Grid">
                        <div className="ms-Grid-row">
                            {/* User Alias*/}
                            <div className='ms-Grid-col ms-u-md2 '>
                                <label>User Alias:</label>
                            </div>
                            <div className='ms-Grid-col ms-u-md4 '>
                                <Control.text model='HR.UserAlies' id='.UserAlies' component={TextField} />
                            </div>
                            {/* Name of employee*/}
                            <div className='ms-Grid-col ms-u-md2'>

                                <label>AD Login Name of Employee:</label>
                            </div>
                            <div className='ms-Grid-col ms-u-md4'>
                                <Control.text model='HR.ADLogin' id='HR.ADLogin' component={TextField} />
                            </div>
                        </div>
                        <div className='col'> {/* Manager*/}
                            <label>Manager:</label>
                            <Control.text model='HR.Manager' id='HR.Manager' component={TextField} />
                            {/* <Control model='HR.Manager' component={peoplepicker}
                                mapProps={{
                                    value: (props) => { return props.viewValue }
                                }}
                            ></Control> */}
                        </div>
                        <div className='col'> {/* Employment Status */}
                            <label>Employment Status:</label>
                            <Control.select model="HR.employementStatus" id="HR.employementStatus">
                                <option value="Assigned to HR">Assigned to HR</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Saved">Saved</option>
                            </Control.select>
                        </div>
                        <div className='col'> {/* Date of leaving*/}
                            <label>Date of leaving:</label>
                            <Control.text model='HR.DateOfLeaving' id='HR.DateOfLeaving' component={TextField} placeholder='dd-MM-yyyy' />
                        </div>
                        <div className='col'>{/* Reason for leaving */}
                            <label>Reason for leaving:</label>
                            <Control.select model="HR.reasonForLeaving" id="HR.reasonForLeaving">
                                <option>--Select--</option>

                                {this.props.HR.reasonOfLeavingOptions.map(reasons => {
                                    return (<option key={reasons}
                                        value={reasons}>{reasons}</option>);
                                })};
                        </Control.select>
                        </div>
                        <div className='col'> {/* Date of Resignation*/}
                            <label>Resignation Date:</label>
                            <Control.text model='HR.ResigntionDate' id='HR.ResigntionDate' component={TextField} placeholder='dd-MM-yyyy' />
                        </div>
                        <div className='col'> {/* Eligible for rehire*/}
                            <label>Eligible for Rehire:</label>
                            <Control.checkbox model='HR.EligibleforRehire' id='HR.EligibleforRehire' />
                        </div>
                    </div>
                    <button type="submit">Save</button>
                </Form>


            </div>);
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
        },
        AddValueFromHR: (empHrData: IHRState, empListId) => {
            return dispatch(HrAddNewEmployee(empHrData, empListId.EmpListID));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(HRDetail);
