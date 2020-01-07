import * as React from 'react';
import { Form, Control } from 'react-redux-form';
import { connect } from "react-redux";
import { SetTabName, GetInitialControlValuesAction, AddNewEmployee } from "../../actions/NewFormControlsValuesAction";
import { ICommonState, IRequestDigest } from '../../state/ICommonState';
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
        return (
            <div>
                <Form model="Employee" onSubmit={(val) => this.handleSubmit(val)}>
                    <div className='col'>
                        <label>First Name:</label>
                        <Control.text model='.firstName' id='.firstName' />
                    </div>
                    <div className='col'>
                        <label>Last Name:</label>
                        <Control.text model='.lastName' id='.lastName' />
                    </div>
                    <div className='col'>
                        <label>Gender:</label>
                        <Control.select model=".gender" id=".gender">
                            <option>--Select--</option>
                            {this.props.Employee.genderOptions.map(gender => { return <option key={gender} value={gender}>{gender}</option> })};
                        </Control.select>
                    </div>
                    <div className='col'>
                        <label>Designation:</label>
                        <Control.select model=".designation" id=".designation">
                            <option>--Select--</option>
                            {this.props.Employee.designationOptions.map(desig => { return <option key={desig} value={desig}>{desig}</option> })};
                        </Control.select>
                    </div>
                    <div className='col'>
                        <label>Technology:</label>
                        <Control.select model=".technology" id=".technology">
                            <option>--Select--</option>
                            {this.props.Employee.technologyOptions.map(tech => { return <option key={tech} value={tech}>{tech}</option> })};
                        </Control.select>
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
        //setReqDigest : SetReqDigest,
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