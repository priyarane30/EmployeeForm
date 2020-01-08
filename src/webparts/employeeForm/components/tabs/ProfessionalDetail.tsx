import * as React from 'react';
import { Form, Control } from 'react-redux-form';

export default class ProfessionalDetail extends React.Component {
    constructor(props) {
        super(props);
    }
    handleSubmit(formValues) {
        console.log(formValues);
    }
    public render() {
        return (
            <div>
                <div className='col'> {/*Fresher*/}
                    <label>Fresher:</label>
                    <Control.checkbox model='Professional.Fresher' id='Professional.Fresher' />
                </div>
                <Form model="Professional" onSubmit={(val) => this.handleSubmit(val)}>
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
                            <td><Control.text model='Professional.organization' id='Professional.organization' /></td>
                            <td><Control.text model='Professional.designation' id='Professional.designation' /></td>
                            <td><Control.text model='Professional.startDate' id='Professional.startDate' /></td>
                            <td><Control.text model='Professional.endDate' id='Professional.endDate' /></td>
                            <td><Control.text model='Professional.reportingTo' id='Professional.reportingTo' /></td>
                            <td><Control.text model='Professional.reportingDesignation' id='Professional.reportingDesignation' /></td>
                            <td><Control.text model='Professional.totalExp' id='Professional.totalExp' /></td>
                            <td>
                                <Control.select model="Professional.reasonForLeaving" id="Professional.reasonForLeaving">
                                    <option>--Select--</option>

                                    {/* {this.props.Professional.reasonOfLeavingOptions.map(reasons => {
                                        return <option key={reasons} value={reasons}>{reasons}</option>
                                    })}; */}
                                    <option>Growth</option>
                                    <option>Better Projects</option>
                                    <option>Better Opportunity</option>
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