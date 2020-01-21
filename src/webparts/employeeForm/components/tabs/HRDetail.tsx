import * as React from 'react';
import { Form, Control } from 'react-redux-form';
import { ICommonState, IEmpListIdState } from '../../state/ICommonState';
import { connect } from "react-redux";
import { SetTabName, GetInitialControlValuesAction, HrAddNewEmployee } from "../../actions/HRFormControlsValuesAction";
import { IHRState } from '../../state/IHRSectionControlsState';
import { store } from "../../store/ConfigureStore";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
//import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import pnp from 'sp-pnp-js';
import NewEmployeeService from '../../services/NewEmployeeService'
export interface IControls {
    Manager: any;
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
            Manager: []
        };
    }
    public componentDidMount() {
        console.log("HR Details");
        const empListId = store.getState().EmpListId;
        this.props.getDefaultControlsData(empListId);
        var myemail = [];
        myemail.push('priya.rane@synoverge.com')
        this.setState({ Manager: myemail })
        //  this.props.passprop(this.props.context);
        console.log(this.props.context);
        this.PeoplePickerItems = this.PeoplePickerItems.bind(this);
    }
    public handleSubmit = (formValues) => {
        console.log(formValues);
        const CommonState: ICommonState = { CurrentForm: "HR" };
        this.props.setTabName(CommonState);

        //Save The Data
        let empHrData = {} as IHRState;
        empHrData = formValues;
        let managerdata = this.state.Manager
        const empListId = store.getState().EmpListId;
        let newEmpReqServiceObj: NewEmployeeService = new NewEmployeeService();
        newEmpReqServiceObj.HrAddNewEmployee(empHrData, managerdata, empListId)
        // this.props.AddValueFromHR(empHrData, managerdata, empListId);
        //EndSave The Data
    }

    public render() {
        pnp.setup({
            spfxContext: this.props.context
        });
        if (!this.props.HR) return (<div> Loading.... </div>);
        return (
            <div>
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
                            {/* <PeoplePicker
                                context={this.props.context}
                                titleText="People Picker"
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
                                defaultSelectedUsers={this.state.Manager?this.state.Manager:null}
                            /> */}
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


            </div>
        );
    }
    private PeoplePickerItems(items: any[]) {
        console.log('Items:', items);
        this.getUserId(items[0].secondaryText).then(resp => {
            this.setState({ Manager: resp });
        })
        // this.setState({ Manager: items });
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
