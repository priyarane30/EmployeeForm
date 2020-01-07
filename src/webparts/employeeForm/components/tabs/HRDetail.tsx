import * as React from 'react';
import { Form, Control } from 'react-redux-form';
import { ICommonState } from '../../state/ICommonState';
import { connect } from "react-redux";
import { SetTabName, GetInitialControlValuesAction } from "../../actions/HRFormControlsValuesAction";
import { IHRState } from '../../state/IHRSectionControlsState';

// Represents the connected dispatch
interface IHRConnectedDispatch {
    setTabName: (tabName: ICommonState) => void;

    // Gets the options for dropdown fields
    getDefaultControlsData: () => void;

    //save data

}
class HRDetail extends React.Component<any> {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.getDefaultControlsData();

    }
    handleSubmit(formValues) {
        // Do anything you want with the form value
        console.log(formValues);
        // Do whatever you like in here.
        // If you connect the UserForm to the Redux store,
        // you can dispatch actions such as:
        // dispatch(actions.submit('user', somePromise));
        // etc.
        const CommonState: ICommonState = { CurrentForm: "HR" };
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
                <Form model="HR" onSubmit={(val) => this.handleSubmit(val)}>
                    <div className='col'> {/* User Alias*/}
                        <label>User Alias:</label>
                        <Control.text model='HR.userAlias' id='HR.userAlias' />
                    </div>
                    <div className='col'> {/* Name of employee*/}
                        <label>AD Login Name of Employee:</label>
                        <Control.text model='HR.ADLogin' id='HR.ADLogin' />
                    </div>
                    <div className='col'> {/* Manager*/}
                        <label>Manager:</label>
                        <Control.text model='HR.Manager' id='HR.Manager' />
                    </div>
                    <div className='col'> {/* Employment Status */}
                        <label>Employment Status:</label>
                        <Control.select model="HR.employementStatus" id="HR.employementStatus">
                            <option>Assigned to HR</option>
                            {/* {this.props.HR.employmentStatusOptions.map(empstatus => {
                                return <option key={empstatus} value={empstatus}>{empstatus}</option>
                            })}; */}
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>Saved</option>
                        </Control.select>
                    </div>
                    <div className='col'> {/* Date of leaving*/}
                        <label>Date of leaving:</label>
                        <Control.text model='HR.DateOfLeaving' id='HR.DateOfLeaving' />
                    </div>
                    <div className='col'>{/* Reason for leaving */}
                        <label>Reason for leaving:</label>
                        <Control.select model="HR.reasonForLeaving" id="HR.reasonForLeaving">
                            <option>--Select--</option>
                            {this.props.HR.reasonOfLeavingOptions.map(reasons => {
                                return <option key={reasons} value={reasons}>{reasons}</option>
                            })};
                            {/* <option>Growth</option>
                            <option>Better Projects</option>
                            <option>Better Opportunity</option> */}
                        </Control.select>
                    </div>
                    <div className='col'> {/* Date of Resignation*/}
                        <label>Resignation Date:</label>
                        <Control.text model='HR.ResigntionDate' id='HR.ResigntionDate' />
                    </div>
                    <div className='col'> {/* Eligible for rehire*/}
                        <label>Eligible for Rehire:</label>
                        <Control.checkbox model='HR.EligibleforRehire' id='HR.EligibleforRehire' />
                    </div>
                    <button type="submit">Save</button>
                </Form>
            </div>);

    }

}
const mapStateToProps = function (state) {
    console.log(state)
    return state;
}

// Maps dispatch to props
const mapDispatchToProps = (dispatch): IHRConnectedDispatch => {
    return {
        setTabName: SetTabName,
        //setReqDigest : SetReqDigest,
        getDefaultControlsData: () => {
            return dispatch(GetInitialControlValuesAction());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HRDetail);
