import * as React from 'react';
import { Form, Control } from 'react-redux-form';
import { connect } from "react-redux";
import { SetTabName, GetInitialControlValuesAction, AddNewEmployee } from "../../actions/NewFormControlsValuesAction";
import { ICommonState } from '../../state/ICommonState';
import { IBasicDetailState } from '../../state/IBasicDetailState';

export default class BasicDetail extends React.Component <any>{
    constructor(props) {
        super(props);
    }
    handleSubmit(formValues) {

       
    }

    public render() {
        return (
            <div>
              <Form model="Employee" onSubmit={(val) => this.handleSubmit(val)}>
              <div className='col'>
                        <label>First Name:</label>
                        <Control.text model='.FirstName' id='.FirstName' />
                    </div>
                    <div className='col'>
                        <label>Last Name:</label>
                        <Control.text model='.LastName' id='.LastName' />
                    </div>
                    <div className='col'>
                        <label>Date Of Joining:</label>
                        <Control.text model='.DateofJoining' id='.DateofJoining' />
                    </div>
                    <div className='col'>
                        <label>Gender:</label>
                        <Control.select model=".Gender" id=".Gender">
                            <option>--Select--</option>
                            {/* {this.props.Employee.genderOptions.map(gender => { return <option key={gender} value={gender}>{gender}</option> })}; */}
                        </Control.select>
                    </div>
                    <div className='col'>
                        <label>Designation:</label>
                        <Control.select model=".Designation" id=".Designation">
                            <option>--Select--</option>
                            {this.props.Employee.designationOptions.map(desig => { return <option key={desig} value={desig}>{desig}</option> })};
                        </Control.select>
                    </div>
                    <div className='col'>
                        <label>Technology:</label>
                        <Control.select model=".Technology" id=".Technology">
                            <option>--Select--</option>
                            {this.props.Employee.technologyOptions.map(tech => { return <option key={tech} value={tech}>{tech}</option> })};
                        </Control.select>
                    </div>
                    <div className='col'>
                        <label>Company Email:</label>
                        <Control.text model='.CompanyEmail' id='.CompanyEmail' />
                    </div>



              </Form>
            </div>);

    }
}


}