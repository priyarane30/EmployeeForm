import * as React from 'react';
import { Form, Control } from 'react-redux-form';
import { ICommonState } from '../../state/ICommonState';
import { connect } from "react-redux";
import { SetTabName, GetInitialControlValuesAction} from "../../actions/ProfessionalDetailFormControlsValuesAction";
import { IProfessionalDetailState } from '../../state/IProfessionalDetailControlState';

// Represents the connected dispatch
interface IPDConnectedDispatch {
    setTabName: (tabName: ICommonState) => void;

    // Gets the options for dropdown fields
    getDefaultControlsData: () => void;


}

class ProfessionalDetail extends React.Component<any> {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log("Professional Details");
        this.props.getDefaultControlsData();
    }
    handleSubmit(formValues) {
        console.log(formValues);
        const CommonState: ICommonState = { CurrentForm: "HR" };
        this.props.setTabName(CommonState);
    }
    public render() {
        return (
            <div>
                <div className='col'> {/*Fresher*/}
                    <label>Fresher:</label>
                    <Control.checkbox model='ProfessionalDetail.Fresher' id='ProfessionalDetail.Fresher' />
                </div>
                <Form model="ProfessionalDetail" onSubmit={(val) => this.handleSubmit(val)}>
                    <table >
                        <tr>
                            <th>Organization</th>
                            <th>Designation/Role</th>
                            <th>Start Month</th>
                            <th>End Month</th>
                            <th>Reporting To</th>
                            <th>Reporting Designation</th>
                            <th>Reason For Leaving</th>
                            <th>Total Exp.(Month)</th>
                            <th>Action</th>
                        </tr>
                        <tr>
                            <td><Control.text model='ProfessionalDetail.organization' id='ProfessionalDetail.organization' /></td>
                            <td><Control.text model='ProfessionalDetail.designation' id='ProfessionalDetail.designation' /></td>
                            <td><Control.text model='ProfessionalDetail.startDate' id='ProfessionalDetail.startDate' /></td>
                            <td><Control.text model='ProfessionalDetail.endDate' id='ProfessionalDetail.endDate' /></td>
                            <td><Control.text model='ProfessionalDetail.reportingTo' id='ProfessionalDetail.reportingTo' /></td>
                            <td><Control.text model='ProfessionalDetail.reportingDesignation' id='ProfessionalDetail.reportingDesignation' /></td>
                            <td><Control.text model='ProfessionalDetail.totalExp' id='ProfessionalDetail.totalExp' /></td>
                            <td>
                                <Control.select model="ProfessionalDetail.reasonForLeaving" id="ProfessionalDetail.reasonForLeaving">
                                    <option>--Select--</option>

                                    {/* {this.props.ProfessionalDetail.reasonOfLeavingOptions.map(reasons => {
                                        return <option key={reasons} value={reasons}>{reasons}</option>
                                    })}; */}
                                </Control.select>
                            </td>
                            <td><button value='+' id='Add' /></td>
                        </tr>
                    </table>                   
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
const mapDispatchToProps = (dispatch): IPDConnectedDispatch => {
    return {
        setTabName: SetTabName,
        //setReqDigest : SetReqDigest,
        getDefaultControlsData: () => {
            return dispatch(GetInitialControlValuesAction());
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfessionalDetail);