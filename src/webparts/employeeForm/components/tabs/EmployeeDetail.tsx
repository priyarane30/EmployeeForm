import * as React from 'react';
import { Form, Control, createFieldClass, controls,Errors } from 'react-redux-form';
import { connect } from "react-redux";
import { SetTabName, GetInitialControlValuesAction, AddDetailRowToGrid, RemoveDetailRowFromGrid } from "../../actions/NewFormControlsValuesAction";
import { ICommonState } from '../../state/ICommonState';
import { INewFormState } from '../../state/INewFormControlsState';
import { store } from "../../store/ConfigureStore";
import NewEmpService from '../../services/NewEmployeeService';
import FabricField from '../Fabric Components/DatePicker'
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { optionProperties } from 'office-ui-fabric-react/lib/Utilities';

interface buttonStatus {
    buttonDisabled: boolean
}
// Represents the connected dispatch
interface INewFormConnectedDispatch {
    setTabName: (tabName: ICommonState) => void;

    // Gets the options for dropdown fields
    getDefaultControlsData: (EmpListID) => void;

    //save data


    AddDetailRowToGrid: (section) => void;

    RemoveDetailRowFromGrid: (section, index) => void;
}
// interface ICommonDispatch {
//     setTabName: (tabName: ICommonState) => void;
// }

class EmployeeDetail extends React.Component<any> {
    constructor(props) {
        super(props);
        const buttonState = {} as buttonStatus
        this.state = {
            buttonDisabled: false
        }
    }

    //adds row in grids
    handleRowAdd(section) {
        this.props.AddDetailRowToGrid(section);
    }

    //removes row from grid
    handleRowRemove(section, index) {
        this.props.RemoveDetailRowFromGrid(section, index);
    }

    async handleSubmit(formValues) {

        // Do anything you want with the form value
        const CommonState: ICommonState = { CurrentForm: "Employee" };
        this.props.setTabName(CommonState);

        // Do whatever you like in here.
        // If you connect the UserForm to the Redux store,
        // you can dispatch actions such as:
        // dispatch(actions.submit('user', somePromise));
        // etc.
        const empListId = store.getState().EmpListId;
        let empData = {} as INewFormState;
        empData = formValues;
        this.setState({ buttonDisabled: true })
        let newEmpServiceObj: NewEmpService = new NewEmpService();
        // Call the connected dispatch to create new purchase request
        await newEmpServiceObj.AddEmpFormData(empData, empListId)
        this.setState({ buttonDisabled: false })


    }

    
    public render() {
        // let i = 0;
        console.log(this.props)
        if (!this.props.Employee) return (<div> Loading.... </div>)
        return (
            <div>
                <Form model="Employee" onSubmit={(val) => this.handleSubmit(val)}>

                    <div className='col'>
                        <label>Gender:</label>
                        <Control.select model="Employee.Gender" id=".Gender" >
                            <option>--Select--</option>
                            {this.props.Employee.genderOptions.map(gender => { return <option key={gender} value={gender} >{gender}</option> })};
                        </Control.select>
                    </div>
                    <div className='col'>
                        <label>Date Of Birth:</label>
                        <Control model='.DateOfBirth' component={DatePicker}
                            mapProps={{
                                value: (props) => { return props.viewValue },
                                onSelectDate: (props) => { return props.onChange }
                            }}
                        ></Control>
                    </div>
                    <div className='col'>
                        <label>Age:</label>
                        <Control.text model='Employee.Age' id='.Age' />
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
                        <Control.select model=".MaritalStatus" id=".MaritalStatus"
                         validators={{
                            requiredMaritalStatus: (val) =>  val && val!="--Select--"
                          }}>
                            <option>--Select--</option>
                            {this.props.Employee.maritalStatusOptions.map(mStatus => { return <option key={mStatus} value={mStatus}>{mStatus}</option> })};
                        </Control.select>
                        <Errors
                            model=".MaritalStatus"
                            messages={{
                                requiredMaritalStatus: 'Please Select Marital Status.'
                            }}
                        />
                        
                    </div>
                    {this.isMarried(this.props.Employee)}
                    <div className='col'>
                        <label>Personal Email:</label>
                        <Control.text model='.PersonalEmail' id='.PersonalEmail'
                            validators={{
                                requiredEmail: (val) => val && val.length,
                                isEmail: (val) => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) // ES6 property shorthand
                            }}
                        />
                        <Errors
                            model=".PersonalEmail"
                            messages={{
                                requiredEmail: 'Please provide an email address.',
                                isEmail: (val) => `${val} is not a valid email.`,
                            }}
                        />
                         
                    </div>
                    <div className='col'>
                        <label>Mobile No:</label>
                        <Control.text model='.Mobile' id='.Mobile'/>
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
                        <label>Permanent Resident Address:Is Same as Current Address?</label>
                        <Control.checkbox model=".IsSameAsCurrAddress" />
                    </div>
                    {this.isSameAsCurrentAdress(this.props.Employee)}
                    <div className='col'>
                        <label>Aadhar No:</label>
                        <Control.text model='.AadharNo' id='.AadharNo' />
                    </div>
                    <div className='col'>
                        <label>Pan No:</label>
                        <Control.text model='.PanNo' id='.PanNo' />
                    </div>
                    <div className='col'>
                        <label>Is Passport available:</label>
                        <Control.checkbox model='.IsPassAvail' />
                    </div>
                    {this.isPassportAvailable(this.props.Employee)}



                    <button type="submit">Submit</button>
                </Form>
            </div>);

    }

    async componentDidMount() {
        console.log("Employee Details");
        const empListID = await store.getState().EmpListId;
        this.props.getDefaultControlsData(empListID);

    }
    isSameAsCurrentAdress(props) {
        if (props.IsSameAsCurrAddress == false) {
            return (<div className='col'>
                <Control.textarea model='.PermanentAddress' id='.PermanentAddress' />
            </div>)
        }
    }

    isPassportAvailable(props) {
        if (props.IsPassAvail != false) {
            return (<div>
                <div className='col'>
                    <label>Passport No:</label>
                    <Control.text model='.PassportNo' id='.PassportNo' />
                </div>
                <div className='col'>
                    <label>Passport Validity</label>
                    <Control model='.PassportValidity' component={DatePicker}
                        mapProps={{
                            value: (props) => { return props.viewValue },
                            onSelectDate: (props) => { return props.onChange }
                        }}
                    ></Control>
                </div>
                <div>
                    <table>
                        <tr>
                            <td><label>Visa Details</label></td>
                            <td style={{ textAlign: "left" }}>
                                <button type="button" onClick={() => this.handleRowAdd("Visa")}>+</button>
                            </td>
                        </tr>
                        {props.visaDetailItems.map((visa, i) => {
                            return (
                                <tr>
                                    <td>
                                        <label>Valid Visa</label>
                                        <Control.checkbox model={`Employee.visaDetailItems[${i}].ValidVisa`} id={visa.ValidVisa} ></Control.checkbox>
                                    </td>
                                    <td>
                                        <label>Visa Of Country</label>
                                        <Control.text model={`Employee.visaDetailItems[${i}].VisaOfCountry`} id={visa.VisaOfCountry}></Control.text>
                                    </td>
                                    <td>
                                        <label>Visa No</label>
                                        <Control.text model={`Employee.visaDetailItems[${i}].VisaNo`} id={visa.VisaNo}></Control.text>
                                    </td>
                                    <td>
                                        <label>Entry</label>
                                        <Control.select model={`Employee.visaDetailItems[${i}].Entry`} id={visa.Entry}>
                                            <option>--Select--</option>
                                            <option key='Single Entry' value='Single Entry'>Single Entry</option>
                                            <option key='Multiple Entry' value='Multiple Entry'>Multiple Entry</option>
                                        </Control.select>
                                    </td>
                                    <td>
                                        <label>Visa Validity</label>
                                        <Control model={`Employee.visaDetailItems[${i}].VisaValidity`} id={visa.VisaValidity} component={DatePicker}
                                            mapProps={{
                                                value: (props) => { return props.viewValue },
                                                onSelectDate: (props) => { return props.onChange }
                                            }}
                                        ></Control>
                                    </td>
                                    <td>
                                        <label>Is Travelled</label>
                                        <Control.checkbox model={`Employee.visaDetailItems[${i}].IsTravelled`}  id={`Employee.visaDetailItems[${i}].IsTravelled`} />
                                    </td>

                                    <td>
                                        <button type="button" onClick={() => this.handleRowRemove("Visa", i)}>-</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </table>

                </div>

            </div>
            )
        }
    }
      isMarried(props) {
        if (props.MaritalStatus == "Married") {
            return (
                <div>
                    <div className='col'>
                        <label>Spouse Name:</label>
                        <Control.text model='.SpouceName' id='.SpouceName'></Control.text>
                    </div>
                    <div className='col'>
                        <label>Spouse Occupation:</label>
                        <Control.text model='.SpouseOccupation' id='.SpouseOccupation' />
                    </div>
                    <div className='col'>
                        <label>Spouse DOB:</label>
                        <Control model='.SpouceDOB' id='.SpouceDOB' component={DatePicker}
                            mapProps={{
                                value: (props) => { return props.viewValue },
                                onSelectDate: (props) => { return props.onChange }
                            }}
                        ></Control>
                    </div>
                    <div>
                        <table>
                            <tr>
                                <td><label>Children Details</label></td>
                                <td style={{ textAlign: "left" }}>
                                    <button type="button" onClick={() => this.handleRowAdd("Child")}>+</button>
                                </td>
                            </tr>
                            {props.childDetailItems.map((child, i) => {
                                return (
                                    <tr>
                                        <td>
                                            <label>Child Name</label>
                                            <Control.text model={`Employee.childDetailItems[${i}].ChildName`} id={child.ChildName}></Control.text>
                                        </td>
                                        <td>
                                            <label>Date Of Birth</label>
                                            <Control model={`Employee.childDetailItems[${i}].DateOfBirth`} id={child.DateOfBirth} component={DatePicker}
                                                mapProps={{
                                                    value: (props) => { return props.viewValue },
                                                    onSelectDate: (props) => { return props.onChange }
                                                }}
                                            ></Control>
                                        </td>
                                        <td>
                                            <button type="button" onClick={() => this.handleRowRemove("Child", i)}>-</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </table>

                    </div>
                </div>)
        }
    }

}

const mapStateToProps = function (state) {
    //console.log(state)
    return state;
}

// Maps dispatch to props
const mapDispatchToProps = (dispatch): INewFormConnectedDispatch => {


    return {
        setTabName: SetTabName,
        getDefaultControlsData: (empListId) => {
            return dispatch(GetInitialControlValuesAction(empListId.EmpListID));
        },

        AddDetailRowToGrid: (section) => {
            return dispatch(AddDetailRowToGrid(section));
        },
        RemoveDetailRowFromGrid: (section, index) => {
            return dispatch(RemoveDetailRowFromGrid(section, index));
        },
        
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDetail);

