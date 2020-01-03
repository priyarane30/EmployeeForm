import * as React from 'react';
import { Form, Control } from 'react-redux-form';

export default class PayrollDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <div>
                <form>
                    <div className='col'>
                        <label>ESI Applicable:</label>
                        <input type='text' id='ESIApplicable' name='ESIApplicable'></input>
                    </div>
                    <div className='col'>
                        <label>ESI No:</label>
                        <input type='text' id='ESINo' name='ESINo'></input>
                    </div>
                    <button type="submit">Save</button>
                </form>
            </div>);

    }
}