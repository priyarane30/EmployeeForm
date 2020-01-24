import * as React from 'react';
import { Form, Control, createFieldClass, controls, Errors } from 'react-redux-form';
import { connect } from "react-redux";
import { SetTabName, GetInitialControlValuesAction, AddDetailRowToGrid, RemoveDetailRowFromGrid } from "../../actions/NewFormControlsValuesAction";
import { ICommonState } from '../../state/ICommonState';
import { INewFormState } from '../../state/INewFormControlsState';
import { store } from "../../store/ConfigureStore";
import NewEmpService from '../../services/NewEmployeeService';
import { DatePicker, TextField , DefaultButton} from 'office-ui-fabric-react/lib';
import styles from '../EmployeeForm.module.scss';

interface buttonStatus {
    buttonDisabled: boolean;
}
// Represents the connected dispatch
interface INewFormConnectedDispatch {
    setTabName: (tabName: ICommonState) => void;
    getDefaultControlsData: (EmpListID) => void; // Gets the form fields & options for dropdown fields
    AddDetailRowToGrid: (section) => void; //save data in grod row
    RemoveDetailRowFromGrid: (removedItem,section, index) => void; //remove row from grid
}

//for validations in form
const isNumber = (val) => !isNaN(Number(val));
const maxLength = (len) => (val) => val.length <= len;

class EmployeeDetail extends React.Component<any, buttonStatus> {
    constructor(props) {
        super(props);
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
        let removedItem = this.props.Employee[section][index];
        this.props.RemoveDetailRowFromGrid(removedItem, section, index);
    }

    private async handleSubmit(formValues) {
        this.props.handleSpinner(false);
        const CommonState: ICommonState = { CurrentForm: "Employee" };
        this.props.setTabName(CommonState);
        const empListId = store.getState().EmpListId;
        let empData = {} as INewFormState;
        empData = formValues;
        this.setState({ buttonDisabled: true });
        let newEmpServiceObj: NewEmpService = new NewEmpService();
        await newEmpServiceObj.AddEmpFormData(empData, empListId);
        this.setState({ buttonDisabled: false });
        this.props.handleSpinner(true);
        this.props.handleTabClick();
    }

    public render() {
        if (!this.props.Employee) return (<div> Loading.... </div>);
        return (
            <div>
                <div className={styles.employeeForm}>
                    <div className={styles.container}>
                        <div className={`ms-Grid-row  ms-fontColor-white ${styles.row}`}>
                            <Form model="Employee" onSubmit={(val) => this.handleSubmit(val)}>
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Gender:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.select model="Employee.Gender"
                                        id=".Gender" className={styles.dropdowncustom}
                                        validators={{
                                            requiredGender: (val) => val && val.length && val != '--Select--'

                                        }}>
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
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Date Of Birth:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control model='.DateOfBirth' component={DatePicker} className={styles.marginb}
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
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Father Name:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.text
                                        component={TextField} className={styles.marginb}
                                        model='.FatherName'
                                        id='.FatherName'
                                        validators={{
                                            requiredFatherName: (val) => val && val.length,
                                            maxLength: maxLength(255)
                                        }}
                                    />
                                    <Errors
                                        className={styles.errors}
                                        show="touched"
                                        model=".FatherName"
                                        messages={{
                                            requiredFatherName: 'Please enter father name.',
                                            maxLength: 'Must be 255 characters or less',
                                        }}
                                    ></Errors>
                                </div>
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Mother Name:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.text
                                        component={TextField} className={styles.marginb}
                                        model='.MotherName' id='.MotherName'
                                        validators={{
                                            requiredMotherName: (val) => val && val.length,
                                            maxLength: maxLength(255)
                                        }}
                                    />
                                    <Errors
                                        className={styles.errors}
                                        show="touched"
                                        model=".MotherName"
                                        messages={{
                                            requiredMotherName: 'Please enter mother name.',
                                            maxLength: 'Must be 255 characters or less'
                                        }}
                                    ></Errors>
                                </div>
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Marital Status:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.select model=".MaritalStatus" id=".MaritalStatus"
                                        className={styles.dropdowncustom}
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
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Personal Email:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.text
                                        component={TextField} className={styles.marginb}
                                        model='.PersonalEmail' id='.PersonalEmail'
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
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Mobile No:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.text
                                        component={TextField} className={styles.marginb}
                                        model='.Mobile' id='.Mobile'
                                        validators={{
                                            requiredMobile: (val) => val && val.length && val.length == 10,
                                            isNumber
                                        }}
                                    />
                                    <Errors
                                        className={styles.errors}
                                        show="touched"
                                        model=".Mobile"
                                        messages={{
                                            requiredMobile: 'Please enter mobile no.(10 digits)',
                                            isNumber: 'only numbers allowed'
                                        }}
                                    ></Errors>
                                </div>
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Emergency Contact No:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.text
                                        component={TextField} className={styles.marginb}
                                        model='.EmergencyNo' id='.EmergencyNo'
                                        validators={{
                                            requiredEmergencyNo: (val) => val && val.length,
                                            isNumber
                                        }}
                                    />
                                    <Errors
                                        className={styles.errors}
                                        show="touched"
                                        model=".EmergencyNo"
                                        messages={{
                                            requiredEmergencyNo: 'Please enter emergency no.',
                                            isNumber: 'only numbers allowed'
                                        }}
                                    ></Errors>
                                </div>
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Relation with Emergency No:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.text
                                        component={TextField} className={styles.marginb}
                                        model='.RelationWithEmergencyNo' id='.RelationWithEmergencyNo'
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
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Blood Group:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.text model='.BloodGroup' id='.BloodGroup'
                                        component={TextField} className={styles.marginb}
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
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Current Resident Address:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.textarea model='.CurrentAddress' id='.CurrentAddress'
                                        className={styles.marginb}
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
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Is Same as Current Address?</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.checkbox model=".IsSameAsCurrAddress" />
                                </div>
                                {this.isSameAsCurrentAdress(this.props.Employee)}
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Aadhar No:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.text model='.AadharNo' id='.AadharNo'
                                        component={TextField} className={styles.marginb}
                                        validators={{
                                            requiredAadharNo: (val) => val && val.length && val.length == 12,
                                            isNumber
                                        }}
                                    />
                                    <Errors
                                        className={styles.errors}
                                        show="touched"
                                        model=".AadharNo"
                                        messages={{
                                            requiredAadharNo: 'Please enter aadhar no.(12 digits)',
                                            isNumber: 'only numbers allowed'
                                        }}
                                    ></Errors>
                                </div>
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Pan No:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.text model='.PanNo' id='.PanNo'
                                        component={TextField} className={styles.marginb}
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
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Is Passport available:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.checkbox model='.IsPassAvail' />
                                </div>
                                {this.isPassportAvailable(this.props.Employee)}
                                <DefaultButton id="DefaultSubmit" primary={true} text={"Submit"} type="submit"
                                    disabled={this.state.buttonDisabled} className={styles.button} />
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    public async componentDidMount() {
        const empListID = await store.getState().EmpListId;
        this.props.getDefaultControlsData(empListID);
    }

    private isSameAsCurrentAdress(props) {
        if (props.IsSameAsCurrAddress == false) {
            return (
                <div className='ms-Grid-col ms-u-sm12 block'>
                    <div className='ms-Grid-col ms-u-sm4 block'>
                        <label>Permanent Address</label>
                    </div>
                    <div className="ms-Grid-col ms-u-sm8 block">
                        <Control.textarea model='.PermanentAddress' id='.PermanentAddress'
                            className={styles.marginb}
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
                    </div>
                </div>);
        }
    }

    private isPassportAvailable(props) {
        if (props.IsPassAvail != false) {
            return (
                <div className="ms-Grid-col ms-u-sm12 block">
                    <div className='ms-Grid-col ms-u-sm4 block'>
                        <label>Passport No:</label>
                    </div>
                    <div className="ms-Grid-col ms-u-sm8 block">
                        <Control.text model='.PassportNo' id='.PassportNo'
                            component={TextField} className={styles.marginb}
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
                    <div className='ms-Grid-col ms-u-sm4 block'>
                        <label>Passport Validity</label>
                    </div>
                    <div className="ms-Grid-col ms-u-sm8 block">
                        <Control model='.PassportValidity' component={DatePicker} className={styles.marginb}
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
                    <table className="ms-Grid-col ms-u-sm12 block">
                        <tr>
                            <th colSpan={8} style={{ textAlign: "left" }}>Visa Details
                                <button type="button" onClick={() => this.handleRowAdd("visaDetailItems")}>+</button>
                            </th>
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
                                            component={TextField} className={styles.marginb}
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
                                            component={TextField} className={styles.marginb}
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
                                            className={styles.dropdowncustom}
                                            validators={{
                                                requiredEntry: (val) => val && val.length && val != '--Select--',
                                            }} >
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
                                        <Control model={`Employee.visaDetailItems[${i}].VisaValidity`} id={visa.VisaValidity} component={DatePicker} className={styles.marginb}
                                            mapProps={{
                                                value: (props) => { return props.viewValue; },
                                                onSelectDate: (props) => { return props.onChange; }
                                            }}
                                            validators={{
                                                requiredVisaValidity: (val) => val && val != null,
                                            }}>
                                        </Control>
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
                                        <button type="button" style={{ marginTop: "20px" }} onClick={() => this.handleRowRemove("visaDetailItems", i)}>-</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </table>
                </div>
            );
        }
    }

    private isMarried(props) {
        if (props.MaritalStatus == "Married") {
            return (
                <div className="ms-Grid-col ms-u-sm12 block">
                    <div className='ms-Grid-col ms-u-sm4 block'>
                        <label>Spouse Name:</label>
                    </div>
                    <div className="ms-Grid-col ms-u-sm8 block">
                        <Control.text model='.SpouceName' id='.SpouceName'
                            validators={{
                                requiredSpouceName: (val) => val && val.length,
                            }}
                            component={TextField} className={styles.marginb}
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
                    <div className='ms-Grid-col ms-u-sm4 block'>
                        <label>Spouse Occupation:</label>
                    </div>
                    <div className="ms-Grid-col ms-u-sm8 block">
                        <Control.text model='.SpouseOccupation' id='.SpouseOccupation'
                            validators={{
                                requiredSpouseOccupation: (val) => val && val.length,
                            }}
                            component={TextField} className={styles.marginb}
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
                    <div className='ms-Grid-col ms-u-sm4 block'>
                        <label>Spouse DOB:</label>
                    </div>
                    <div className="ms-Grid-col ms-u-sm8 block">
                        <Control model='.SpouceDOB' id='.SpouceDOB' component={DatePicker} className={styles.marginb}
                            mapProps={{
                                value: (props) => { return props.viewValue; },
                                onSelectDate: (props) => { return props.onChange; }
                            }}
                            validators={{
                                requiredSpouceDOB: (val) => val ,
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
                    <table className="ms-Grid-col ms-u-sm12 block" style={{ width: "100%" }}>
                        <tr>
                            <th colSpan={9} style={{ textAlign: "left" }}><label>Children Details</label>
                                <button type="button" onClick={() => this.handleRowAdd("childDetailItems")}>+</button>
                            </th>
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
                                            component={TextField} className={styles.marginb}
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
                                            className={styles.marginb}
                                            mapProps={{
                                                value: (props) => { return props.viewValue; },
                                                onSelectDate: (props) => { return props.onChange; }
                                            }}
                                            validators={{
                                                requiredDateOfBirth: (val) => val ,
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
                                        <button type="button" style={{ marginTop: "20px" }} onClick={() => this.handleRowRemove("childDetailItems", i)}>-</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </table>
                </div>);
        }
    }
}

const mapStateToProps = (state) => {
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
        RemoveDetailRowFromGrid: (removedItem,section, index) => {
            return dispatch(RemoveDetailRowFromGrid(removedItem,section, index));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDetail);

