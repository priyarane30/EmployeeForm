import * as React from 'react';
import { Form, Control } from 'react-redux-form';
import { connect } from "react-redux";
import { SetTabName, GetInitialControlValuesAction, AddNewEmployee } from "../../actions/NewFormControlsValuesAction";
import { ICommonState } from '../../state/ICommonState';
import { INewFormState } from '../../state/INewFormControlsState';

// Represents the connected dispatch
interface INewFormConnectedDispatch {
    setTabName: (tabName: ICommonState) => void;

    // Gets the options for dropdown fields
    getDefaultControlsData: () => void;

    //save data
    // addNewEmployee: (empData: INewFormState) => void;
}
// interface ICommonDispatch {
//     setTabName: (tabName: ICommonState) => void;
// }

class EmployeeDetail extends React.Component<any> {
    constructor(props) {
        super(props);
    }

    handleSubmit(formValues) {

        // Do anything you want with the form value
        //debugger;
        const CommonState: ICommonState = { CurrentForm: "Employee" };
        this.props.setTabName(CommonState);

        // Do whatever you like in here.
        // If you connect the UserForm to the Redux store,
        // you can dispatch actions such as:
        // dispatch(actions.submit('user', somePromise));
        // etc.
        // let empData = {} as INewFormState;
        // empData = formValues;
        // Call the connected dispatch to create new purchase request
        // this.props.addNewEmployee(empData);
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
                    <div className='col'>
                        <label>Mobile No:</label>
                        <Control.text model='.Mobile' id='.Mobile' />
                    </div>
                    <div className='col'>
                        <label>Emergency Contact No:</label>
                        <Control.text model='.EmergencyNo' id='.EmergencyNo' />
                    </div>
                    <div className='col'>
                        <label>Relation with Emergency No:</label>
                        <Control.text model='.RelationWithEmergencyNo' id='.RelationWithEmergencyNo' />
                    </div>
                    <div className='col'>
                        <label>Father Name:</label>
                        <Control.text model='.FatherName' id='.FatherName' />
                    </div>
                    <div className='col'>
                        <label>Mother Name:</label>
                        <Control.text model='.MotherName' id='.MotherName' />
                    </div>
                    <button type="submit">Submit</button>
                </Form>
            </div>);

    }

    componentDidMount() {
        this.props.getDefaultControlsData();

    }

}

const mapStateToProps = function (state) {
    console.log(state)
    return state;
}

// Maps dispatch to props
const mapDispatchToProps = (dispatch): INewFormConnectedDispatch => {
    return {
        setTabName: (tabData: ICommonState) => {
            return dispatch(SetTabName(tabData))
        },
        getDefaultControlsData: () => {
            return dispatch(GetInitialControlValuesAction());
        },
        // addNewEmployee: (empData: INewFormState) => {
        //     return dispatch(AddNewEmployee(empData));
        // }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDetail);

// export default connect(mapStateToProps, {
//     setTabName: SetTabName
// })(EmployeeDetail);