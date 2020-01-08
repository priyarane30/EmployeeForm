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
    addNewEmployee: (empData: INewFormState) => void;
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
        const CommonState: ICommonState = { CurrentForm: "Employee" };
        this.props.setTabName(CommonState);

        // Do whatever you like in here.
        // If you connect the UserForm to the Redux store,
        // you can dispatch actions such as:
        // dispatch(actions.submit('user', somePromise));
        // etc.
        let empData = {} as INewFormState;
        empData = formValues;
        // Call the connected dispatch to create new purchase request
        this.props.addNewEmployee(empData);
    }

    public render() {
        let i = 0;
        return (
            <div>
                <Form model="Employee" onSubmit={(val) => this.handleSubmit(val)}>
                    {/* <div className='col'>
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
                            {this.props.Employee.genderOptions.map(gender => { return <option key={gender} value={gender}>{gender}</option> })};
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
                    </div> */}
                    <div className='col'>
                        <label>Gender:</label>
                        <Control.select model=".Gender" id=".Gender">
                            <option>--Select--</option>
                            {this.props.Employee.genderOptions.map(gender => { return <option key={gender} value={gender}>{gender}</option> })};
                        </Control.select>
                    </div>
                    <div className='col'>
                        <label>Date Of Birth:</label>
                        <Control.text model='.DateofBirth' id='.DateofBirth' />
                    </div>
                    <div className='col'>
                        <label>Father Name:</label>
                        <Control.text model='.FatherName' id='.FatherName' />
                    </div>
                    <div className='col'>
                        <label>Mother Name:</label>
                        <Control.text model='.MotherName' id='.MotherName' />
                    </div>
                    <div className='col'>
                        <label>Marital Status:</label>
                        <Control.select model=".MaritalStatus" id=".MaritalStatus">
                            <option>--Select--</option>
                            {this.props.Employee.maritalStatusOptions.map(mStatus => { return <option key={mStatus} value={mStatus}>{mStatus}</option> })};
                        </Control.select>
                    </div>
                    <div className='col'>
                        <label>Spouse Name:</label>
                        <Control.text model='.SpouseName' id='.SpouseName' />
                    </div>
                    <div className='col'>
                        <label>Spouse Occupation:</label>
                        <Control.text model='.SpouseOccupation' id='.SpouseOccupation' />
                    </div>
                    <div className='col'>
                        <label>Spouse DOB:</label>
                        <Control.text model='.SpouceDOB' id='.SpouceDOB' />
                    </div>
                    <div>
                        Children Details
                        <Form model="Employee.childDetailItems">
                            <table>
                                <tr>
                                    <td>
                                        <label>Child Name</label>
                                        <Control.text model={`.child[${i}].ChildName`} id=".ChildName"></Control.text>
                                    </td>
                                    <td>
                                        <label>Child DOB</label>
                                        <Control.text model={`.child[${i}].DateOfBirth`} id=".DateOfBirth"></Control.text>
                                    </td>
                                    <td>
                                        <button type="submit" onSubmit={(childData) => {
                                            i++;
                                            debugger
                                           
                                        }}>+</button>
                                    </td>
                                </tr>

                            </table>
                        </Form>
                        <table>
                            {
                                this.props.Employee.childDetailItems.map((child, i) =>
                                    <tr>
                                        <td>
                                            <label>Child Name</label>
                                            <Control.text model={`.child[${i}].ChildName`} id=".ChildName"></Control.text>
                                        </td>
                                        <td>
                                            <label>Child DOB</label>
                                            <Control.text model={`.child[${i}].DateOfBirth`} id=".DateOfBirth"></Control.text>
                                        </td>
                                        <td>
                                            <button type="submit">+</button>
                                        </td>
                                    </tr>
                                )}
                        </table>
                    </div>
                    <div className='col'>
                        <label>Personal Email:</label>
                        <Control.text model='.PersonalEmail' id='.PersonalEmail' />
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
                        <label>Blood Group:</label>
                        <Control.text model='.BloodGroup' id='.BloodGroup' />
                    </div>
                    <div className='col'>
                        <label>Current Resident Address:</label>
                        <Control.textarea model='.CurrentAddress' id='.CurrentAddress' />
                    </div>
                    <div className='col'>
                        <label>Permanent Resident Address:</label>
                        <div className="field">
                            <label>Is Same as Current Address?</label>
                            <label><Control.checkbox model=".IsSameAsCurrAddress" /> Yep, Same as Current</label>
                        </div>
                        <Control.textarea model='.PermanentAddress' id='.PermanentAddress' />
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
        setTabName: SetTabName,
        getDefaultControlsData: () => {
            return dispatch(GetInitialControlValuesAction());
        },
        addNewEmployee: (empData: INewFormState) => {
            return dispatch(AddNewEmployee(empData));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDetail);

// export default connect(mapStateToProps, {
//     setTabName: SetTabName
// })(EmployeeDetail);