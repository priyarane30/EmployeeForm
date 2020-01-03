import * as React from 'react';
import { Form, Control } from 'react-redux-form';

export default class HRDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit(formValues) {
        // Do anything you want with the form value
        debugger
        console.log(formValues);
        // Do whatever you like in here.
        // If you connect the UserForm to the Redux store,
        // you can dispatch actions such as:
        // dispatch(actions.submit('user', somePromise));
        // etc.
    }

    public render() {
        return (
            <div>
                <Form model="HR" onSubmit={(val) => this.handleSubmit(val)}>
                    <div className='col'>
                        <label>User Alias:</label>
                        <Control.text model='HR.userAlias' id='HR.userAlias' />
                    </div>
                    <div className='col'>
                        <label>Employment Status:</label>
                        <Control.select model="HR.employementStatus" id="HR.employementStatus">
                            <option>--Select--</option>
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>Assigned to HR</option>
                            <option>Saved</option>
                        </Control.select>
                    </div>
                    <div className='col'>
                        <label>Reason for leaving:</label>
                        <Control.select model="HR.reasonForLeaving" id="HR.reasonForLeaving">
                            <option>--Select--</option>
                            <option>Growth</option>
                            <option>Better Projects</option>
                            <option>Better Opportunity</option>
                        </Control.select>
                    </div>
                    <button type="submit">Save</button>
                </Form>
            </div>);

    }
}