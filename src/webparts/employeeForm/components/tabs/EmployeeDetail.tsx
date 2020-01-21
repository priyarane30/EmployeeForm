import * as React from 'react';
import { Form, Control, createFieldClass, controls, Errors } from 'react-redux-form';
import { connect } from "react-redux";
import { SetTabName, GetInitialControlValuesAction, AddDetailRowToGrid, RemoveDetailRowFromGrid } from "../../actions/NewFormControlsValuesAction";
import { ICommonState } from '../../state/ICommonState';
import { INewFormState } from '../../state/INewFormControlsState';
import { store } from "../../store/ConfigureStore";
import NewEmpService from '../../services/NewEmployeeService';
import FabricField from '../Fabric Components/DatePicker';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { optionProperties } from 'office-ui-fabric-react/lib/Utilities';
import styles from '../EmployeeForm.module.scss';

interface buttonStatus {
    buttonDisabled: boolean;
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
        const buttonState = {} as buttonStatus;
        this.state = {
            buttonDisabled: false
        };
    }

    //adds row in grids
    private handleRowAdd(section) {
        this.props.AddDetailRowToGrid(section);
    }

    //removes row from grid
    private handleRowRemove(section, index) {
        this.props.RemoveDetailRowFromGrid(section, index);
    }

    private async handleSubmit(formValues) {

        // Do anything you want with the form value
        const CommonState: ICommonState = { CurrentForm: "Employee" };
        this.props.setTabName(CommonState);
        const empListId = store.getState().EmpListId;
        let empData = {} as INewFormState;
        empData = formValues;
        this.setState({ buttonDisabled: true });
        let newEmpServiceObj: NewEmpService = new NewEmpService();
        // Call the connected dispatch to create new purchase request
        await newEmpServiceObj.AddEmpFormData(empData, empListId);
        this.setState({ buttonDisabled: false });
    }

    public render() {
        // let i = 0;
        console.log(this.props);
        if (!this.props.Employee) return (<div> Loading.... </div>);
        return (
            <div>
                <Form model="Employee" onSubmit={(val) => this.handleSubmit(val)}>

                    <div className='col'>
                        <label>Gender:</label>
                        <Control.select model="Employee.Gender"
                            id=".Gender"
                            validators={{
                                requiredGender: (val) => val && val.length && val != '--Select--',
                            }}
                        >
                            <option>--Select--</option>
                            {this.props.Employee.genderOptions.map(gender => { return <option key={gender} value={gender} >{gender}</option>; })};
                        </Control.select>
                        <Errors
                            className={styles.errors}
                            show="touched"
                            model=".Gender"
                            messages={{
                                requiredGender: 'Please Select Gender.'
                            }}
                        ></Errors>
                    </div>
                    <div className='col'>
                        <label>Date Of Birth:</label>
                        <Control model='.DateOfBirth' component={DatePicker}
                            mapProps={{
                                value: (props) => { return props.viewValue; },
                                onSelectDate: (props) => { return props.onChange; }
                            }}
                            validators={{
                                requiredDateOfBirth: (val) => val,
                            }}
                        ></Control>
                        <Errors
                            className={styles.errors}
                            show="touched"
                            model=".DateOfBirth"
                            messages={{
                                requiredDateOfBirth: 'Please Select DOB.'
                            }}
                        ></Errors>
                    </div>
                    {/* <div className='col'>
                        <label>Age:</label>
                        <Control.text model='Employee.Age' id='.Age' />
                      
                    </div> */}
                    <div className='col'>
                        <label>Father Name:</label>
                        <Control.text
                            model='.FatherName'
                            id='.FatherName'
                            validators={{
                                requiredFatherName: (val) => val && val.length,
                            }}
                        />
                        <Errors
                            className={styles.errors}
                            show="touched"
                            model=".FatherName"
                            messages={{
                                requiredFatherName: 'Please enter father name.'
                            }}
                        ></Errors>
                    </div>
                    <div className='col'>
                        <label>Mother Name:</label>
                        <Control.text model='.MotherName' id='.MotherName'
                            validators={{
                                requiredMotherName: (val) => val && val.length,
                            }}
                        />
                        <Errors
                            className={styles.errors}
                            show="touched"
                            model=".MotherName"
                            messages={{
                                requiredMotherName: 'Please enter mother name.'
                            }}
                        ></Errors>
                    </div>
                    <div className='col'>
                        <label>Marital Status:</label>
                        <Control.select model=".MaritalStatus" id=".MaritalStatus"
                            validators={{
                                requiredMaritalStatus: (val) => val && val != "--Select--"
                            }}>
                            <option>--Select--</option>
                            {this.props.Employee.maritalStatusOptions.map(mStatus => { return <option key={mStatus} value={mStatus}>{mStatus}</option>; })};
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
                        <Control.text model='.Mobile' id='.Mobile'
                            validators={{
                                requiredMobile: (val) => val && val.length,
                            }}
                        />
                        <Errors
                            className={styles.errors}
                            show="touched"
                            model=".Mobile"
                            messages={{
                                requiredMobile: 'Please enter mobile no.'
                            }}
                        ></Errors>
                    </div>
                    <div className='col'>
                        <label>Emergency Contact No:</label>
                        <Control.text model='.EmergencyNo' id='.EmergencyNo'
                            validators={{
                                requiredEmergencyNo: (val) => val && val.length,
                            }}
                        />
                        <Errors
                            className={styles.errors}
                            show="touched"
                            model=".EmergencyNo"
                            messages={{
                                requiredEmergencyNo: 'Please enter emergency no.'
                            }}
                        ></Errors>
                    </div>
                    <div className='col'>
                        <label>Relation with Emergency No:</label>
                        <Control.text model='.RelationWithEmergencyNo' id='.RelationWithEmergencyNo'
                            validators={{
                                requiredRelEmergencyNo: (val) => val && val.length,
                            }}
                        />
                        <Errors
                            className={styles.errors}
                            show="touched"
                            model=".RelationWithEmergencyNo"
                            messages={{
                                requiredRelEmergencyNo: 'Please enter relation with emergency no.'
                            }}
                        ></Errors>
                    </div>
                    <div className='col'>
                        <label>Blood Group:</label>
                        <Control.text model='.BloodGroup' id='.BloodGroup'
                            validators={{
                                requiredBloodGroup: (val) => val && val.length,
                            }}
                        />
                        <Errors
                            className={styles.errors}
                            show="touched"
                            model=".BloodGroup"
                            messages={{
                                requiredBloodGroup: 'Please enter blood group.'
                            }}
                        ></Errors>
                    </div>
                    <div className='col'>
                        <label>Current Resident Address:</label>
                        <Control.textarea model='.CurrentAddress' id='.CurrentAddress'
                            validators={{
                                requiredCurrentAddress: (val) => val && val.length,
                            }}
                        />
                        <Errors
                            className={styles.errors}
                            show="touched"
                            model=".CurrentAddress"
                            messages={{
                                requiredCurrentAddress: 'Please enter current address.'
                            }}
                        ></Errors>
                    </div>
                    <div className='col'>
                        <label>Permanent Resident Address:Is Same as Current Address?</label>
                        <Control.checkbox model=".IsSameAsCurrAddress" />
                    </div>
                    {this.isSameAsCurrentAdress(this.props.Employee)}
                    <div className='col'>
                        <label>Aadhar No:</label>
                        <Control.text model='.AadharNo' id='.AadharNo'
                            validators={{
                                requiredAadharNo: (val) => val && val.length,
                            }}
                        />
                        <Errors
                            className={styles.errors}
                            show="touched"
                            model=".AadharNo"
                            messages={{
                                requiredAadharNo: 'Please enter aadhar no.'
                            }}
                        ></Errors>
                    </div>
                    <div className='col'>
                        <label>Pan No:</label>
                        <Control.text model='.PanNo' id='.PanNo'
                            validators={{
                                requiredPanNo: (val) => val && val.length,
                            }}
                        />
                        <Errors
                            className={styles.errors}
                            show="touched"
                            model=".PanNo"
                            messages={{
                                requiredPanNo: 'Please enter PAN no.'
                            }}
                        ></Errors>
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
    private isSameAsCurrentAdress(props) {
        if (props.IsSameAsCurrAddress == false) {
            return (<div className='col'>
                <Control.textarea model='.PermanentAddress' id='.PermanentAddress'
                    validators={{
                        requiredPermanentAddress: (val) => val && val.length,
                    }}
                />
                <Errors
                    className={styles.errors}
                    show="touched"
                    model=".PermanentAddress"
                    messages={{
                        requiredPermanentAddress: 'Please enter permanent address.'
                    }}
                ></Errors>
            </div>);
        }
    }

    private isPassportAvailable(props) {
        if (props.IsPassAvail != false) {
            return (<div>
                <div className='col'>
                    <label>Passport No:</label>
                    <Control.text model='.PassportNo' id='.PassportNo'
                        validators={{
                            requiredPassNo: (val) => val && val.length,
                        }}
                    />
                    <Errors
                        className={styles.errors}
                        show="touched"
                        model=".PassportNo"
                        messages={{
                            requiredPassNo: 'Please enter passport no.'
                        }}
                    ></Errors>
                </div>
                <div className='col'>
                    <label>Passport Validity</label>
                    <Control model='.PassportValidity' component={DatePicker}
                        mapProps={{
                            value: (props) => { return props.viewValue; },
                            onSelectDate: (props) => { return props.onChange; }
                        }}
                        validators={{
                            requiredPassportValidity: (val) => val,
                        }}
                    ></Control>
                    <Errors
                        className={styles.errors}
                        show="touched"
                        model=".PassportValidity"
                        messages={{
                            requiredPassportValidity: 'Please select passport validity.'
                        }}
                    ></Errors>
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
                                        <Control.text model={`Employee.visaDetailItems[${i}].VisaOfCountry`} id={visa.VisaOfCountry}
                                            validators={{
                                                requiredVisaOfCountry: (val) => val && val.length,
                                            }}
                                        ></Control.text>
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model={`Employee.visaDetailItems[${i}].VisaOfCountry`}
                                            messages={{
                                                requiredVisaOfCountry: 'required'
                                            }}
                                        ></Errors>
                                    </td>
                                    <td>
                                        <label>Visa No</label>
                                        <Control.text model={`Employee.visaDetailItems[${i}].VisaNo`} id={visa.VisaNo}
                                            validators={{
                                                requiredVisaNo: (val) => val && val.length,
                                            }}
                                        ></Control.text>
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model={`Employee.visaDetailItems[${i}].VisaNo`}
                                            messages={{
                                                requiredVisaNo: 'required'
                                            }}
                                        ></Errors>
                                    </td>
                                    <td>
                                        <label>Entry</label>
                                        <Control.select model={`Employee.visaDetailItems[${i}].Entry`} id={visa.Entry}
                                            validators={{
                                                requiredEntry: (val) => val && val.length && val != '--Select--',
                                            }}
                                        >
                                            <option>--Select--</option>
                                            <option key='Single Entry' value='Single Entry'>Single Entry</option>
                                            <option key='Multiple Entry' value='Multiple Entry'>Multiple Entry</option>
                                        </Control.select>
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model={`Employee.visaDetailItems[${i}].Entry`}
                                            messages={{
                                                requiredEntry: 'required'
                                            }}
                                        ></Errors>
                                    </td>
                                    <td>
                                        <label>Visa Validity</label>
                                        <Control model={`Employee.visaDetailItems[${i}].VisaValidity`} id={visa.VisaValidity} component={DatePicker}
                                            mapProps={{
                                                value: (props) => { return props.viewValue; },
                                                onSelectDate: (props) => { return props.onChange; }
                                            }}
                                            validators={{
                                                requiredVisaValidity: (val) => val && val != null,
                                            }}
                                        ></Control>
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model={`Employee.visaDetailItems[${i}].VisaValidity`}
                                            messages={{
                                                requiredVisaValidity: 'required'
                                            }}
                                        ></Errors>
                                    </td>
                                    <td>
                                        <label>Is Travelled</label>
                                        <Control.checkbox model={`Employee.visaDetailItems[${i}].IsTravelled`} id={`Employee.visaDetailItems[${i}].IsTravelled`} />
                                    </td>
                                    <td>
                                        <button type="button" onClick={() => this.handleRowRemove("Visa", i)}>-</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </table>
                </div>
            </div>
            );
        }
    }
    private isMarried(props) {
        if (props.MaritalStatus == "Married") {
            return (
                <div>
                    <div className='col'>
                        <label>Spouse Name:</label>
                        <Control.text model='.SpouceName' id='.SpouceName'
                            validators={{
                                requiredSpouceName: (val) => val && val.length,
                            }}
                        ></Control.text>
                        <Errors
                            className={styles.errors}
                            show="touched"
                            model='.SpouceName'
                            messages={{
                                requiredSpouceName: 'Please enter spouce name'
                            }}
                        ></Errors>
                    </div>
                    <div className='col'>
                        <label>Spouse Occupation:</label>
                        <Control.text model='.SpouseOccupation' id='.SpouseOccupation'
                            validators={{
                                requiredSpouseOccupation: (val) => val && val.length,
                            }}
                        />
                        <Errors
                            className={styles.errors}
                            show="touched"
                            model='.SpouseOccupation'
                            messages={{
                                requiredSpouseOccupation: 'Please enter spuce occupation'
                            }}
                        ></Errors>
                    </div>
                    <div className='col'>
                        <label>Spouse DOB:</label>
                        <Control model='.SpouceDOB' id='.SpouceDOB' component={DatePicker}
                            mapProps={{
                                value: (props) => { return props.viewValue; },
                                onSelectDate: (props) => { return props.onChange; }
                            }}
                            validators={{
                                requiredSpouceDOB: (val) => val && val != null,
                            }}
                        ></Control>
                        <Errors
                            className={styles.errors}
                            show="touched"
                            model='.SpouceDOB'
                            messages={{
                                requiredSpouceDOB: 'Please select spouce DOB'
                            }}
                        ></Errors>
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
                                            <Control.text model={`Employee.childDetailItems[${i}].ChildName`} id={child.ChildName}
                                                validators={{
                                                    requiredChildName: (val) => val && val.length,
                                                }}
                                            ></Control.text>
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`Employee.childDetailItems[${i}].ChildName`}
                                                messages={{
                                                    requiredChildName: 'required'
                                                }}
                                            ></Errors>
                                        </td>
                                        <td>
                                            <label>Date Of Birth</label>
                                            <Control model={`Employee.childDetailItems[${i}].DateOfBirth`} id={child.DateOfBirth} component={DatePicker}
                                                mapProps={{
                                                    value: (props) => { return props.viewValue; },
                                                    onSelectDate: (props) => { return props.onChange; }
                                                }}
                                                validators={{
                                                    requiredDateOfBirth: (val) => val && val.length,
                                                }}
                                            ></Control>
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`Employee.childDetailItems[${i}].DateOfBirth`}
                                                messages={{
                                                    requiredDateOfBirth: 'required'
                                                }}
                                            ></Errors>
                                        </td>
                                        <td>
                                            <button type="button" onClick={() => this.handleRowRemove("Child", i)}>-</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </table>

                    </div>
                </div>);
        }
    }

}

const mapStateToProps = function (state) {
    //console.log(state)
    return state;
};

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
        }
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDetail);

