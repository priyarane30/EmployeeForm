import * as React from 'react';
import { Form, Control, createFieldClass, controls, Errors } from 'react-redux-form';
import { connect } from "react-redux";
import { SetTabName, GetInitialControlValuesAction, AddDetailRowToGrid, RemoveDetailRowFromGrid } from "../../actions/NewFormControlsValuesAction";
import { ICommonState } from '../../state/ICommonState';
import { INewFormState } from '../../state/INewFormControlsState';
import { store } from "../../store/ConfigureStore";
import NewEmpService from '../../services/NewEmployeeService';
import { DatePicker, TextField, DefaultButton } from 'office-ui-fabric-react/lib';
import styles from '../EmployeeForm.module.scss';

interface buttonStatus {
    buttonDisabled: boolean;
    isDisableUser: boolean;
}
// Represents the connected dispatch
interface INewFormConnectedDispatch {
    setTabName: (tabName: ICommonState) => void;
    getDefaultControlsData: (EmpListID) => void; // Gets the form fields & options for dropdown fields
    AddDetailRowToGrid: (section) => void; //save data in grod row
    RemoveDetailRowFromGrid: (removedItem, section, index) => void; //remove row from grid
}

class EmployeeDetail extends React.Component<any, buttonStatus> {
    constructor(props) {
        super(props);
        this.state = {
            buttonDisabled: false,
            isDisableUser: false,
        };
    }

    public componentDidMount() {
        var empListID = store.getState().EmpListId;
        this.props.getDefaultControlsData(empListID);
        //this.setState({buttonDisabled:false})
        // var employementStatus=await newEmpReqServiceObj.GetEmploymentStatusByUserEmail(this.props.empEmail);
        //     this.props.assignedToHR(employementStatus);
        //     if(employementStatus=="Assigned to HR" && isExistsInHR==false){this.setState({buttonDisabled:false})}
        this.setState({ isDisableUser: this.props.isDisabledToUser })
        if ( this.props.isDisabledToUser == true) {

            this.setState({ buttonDisabled: true });
        }


    }
    //adds row in grids
    private handleRowAdd(section) {
        this.props.AddDetailRowToGrid(section);
    }

    //removes row from grid
    private handleRowRemove(section, index) {
        var confirmDelete = confirm("Are you sure you want to delete this item?")
        if (confirmDelete) {
            let removedItem = this.props.Employee[section][index];
            this.props.RemoveDetailRowFromGrid(removedItem, section, index);
        }
        else { }
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
                        {/* ms-fontColor-white  */}
                        <Form model="Employee" onSubmit={(val) => this.handleSubmit(val)}>
                            <div className={`ms-Grid-row  ${styles.row} ${styles.addressblk}`}>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Gender *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.select model="Employee.Gender"
                                            id=".Gender" className={styles.dropdowncustom} disabled={this.state.isDisableUser}
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
                                                requiredGender: 'Gender is Required.'
                                            }}
                                        ></Errors>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Date Of Birth *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control model='.DateOfBirth' component={DatePicker} className={styles.marginb} disabled={this.state.isDisableUser}
                                            mapProps={{
                                                value: (props) => { return props.viewValue; },
                                                onSelectDate: (props) => { return props.onChange; }
                                            }}
                                            //put date validation  date can't be future date
                                            validators={{
                                                requiredDateOfBirth: (val) => (val && (new Date() > new Date(val)))
                                            }}
                                        ></Control>
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".DateOfBirth"
                                            messages={{
                                                requiredDateOfBirth: "Date can not be future dated"
                                            }}
                                        ></Errors>
                                    </div>
                                </div>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>

                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Father Name *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text
                                            component={TextField} className={styles.marginb} disabled={this.state.isDisableUser}
                                            model='.FatherName'
                                            id='.FatherName'
                                            validators={{
                                                requiredFatherName: (val) => val && val.length,
                                                // maxLength: (val) => val.length <= 255
                                            }}
                                        />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".FatherName"
                                            messages={{
                                                requiredFatherName: 'Father Name is Required.',
                                                // maxLength: 'Must be 255 characters or less',
                                            }}
                                        ></Errors>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Mother Name *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text
                                            component={TextField} className={styles.marginb} disabled={this.state.isDisableUser}
                                            model='.MotherName' id='.MotherName'
                                            validators={{
                                                requiredMotherName: (val) => val && val.length,
                                                //maxLength: (val) => val.length <= 255
                                            }}
                                        />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".MotherName"
                                            messages={{
                                                requiredMotherName: 'Mother Name  is Required.',
                                                //maxLength: 'Must be 255 characters or less'
                                            }}
                                        ></Errors>
                                    </div>
                                </div>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>

                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Marital Status *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.select model=".MaritalStatus" id=".MaritalStatus"
                                            className={styles.dropdowncustom} disabled={this.state.isDisableUser}
                                            validators={{
                                                requiredMaritalStatus: (val) => val && val != "--Select--"
                                            }}>
                                            <option>--Select--</option>
                                            {this.props.Employee.maritalStatusOptions.map(mStatus => { return <option key={mStatus} value={mStatus}>{mStatus}</option>; })};
                                    </Control.select>
                                        <Errors
                                            className={styles.errors}
                                            model=".MaritalStatus"
                                            show="touched"
                                            messages={{
                                                requiredMaritalStatus: 'Marital Status is Required.'
                                            }}
                                        />
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Personal Email *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text
                                            component={TextField} className={styles.marginb} disabled={this.state.isDisableUser}
                                            model='.PersonalEmail' id='.PersonalEmail'
                                            validators={{
                                                requiredEmail: (val) => val && val.length,
                                                isEmail: (val) => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) // ES6 property shorthand
                                            }}
                                        />
                                        <Errors
                                            className={styles.errors}
                                            model=".PersonalEmail"
                                            show="touched"
                                            messages={{
                                                requiredEmail: 'Email address is Required.',
                                                isEmail: (val) => `${val} is not a valid email.`,
                                            }}
                                        />
                                    </div>
                                </div>
                                {this.isMarried(this.props.Employee)}
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Mobile No *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text
                                            component={TextField} className={styles.marginb} disabled={this.state.isDisableUser}
                                            model='.Mobile' id='.Mobile'
                                            validators={{
                                                requiredMobile: (val) => val && val.length && val.length == 10,
                                                isNumber: (val) => !isNaN(Number(val))
                                            }}
                                        />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".Mobile"
                                            messages={{
                                                requiredMobile: ' Mobile no is Required.(10 digits)',
                                                isNumber: 'Only numbers allowed'
                                            }}
                                        ></Errors>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Emergency Contact No *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text
                                            component={TextField} className={styles.marginb} disabled={this.state.isDisableUser}
                                            model='.EmergencyNo' id='.EmergencyNo'
                                            validators={{
                                                requiredEmergencyNo: (val) => val && val.length == 10,
                                                isNumber: (val) => (!isNaN(Number(val)))

                                            }}
                                        />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".EmergencyNo"
                                            messages={{
                                                requiredEmergencyNo: 'Emergency no is Required.(10 digits)',
                                                isNumber: 'Only numbers allowed'
                                            }}
                                        ></Errors>
                                    </div>
                                </div>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Relation with Emergency Contact *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text
                                            component={TextField} className={styles.marginb} disabled={this.state.isDisableUser}
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
                                                requiredRelEmergencyNo: 'Relation with emergency contact is Required.'
                                            }}
                                        ></Errors>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Blood Group *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.select style={{ height: "30px" }} model='.BloodGroup' id='.BloodGroup' disabled={this.state.isDisableUser}
                                            validators={{ requiredQualification: (val) => val && val != "--Select--" }}>
                                            <option>--Select--</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="O+">O+</option>
                                            <option value="O+">O-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                        </Control.select>
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model='.BloodGroup'
                                            messages={{
                                                requiredQualification: 'Blood Group is Required.'
                                            }}
                                        ></Errors>
                                    </div>
                                </div>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Current Residential No. *</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text component={TextField} model='.CurrentResidentialNumber' id='.CurrentResidentialNumber'
                                            className={styles.marginb} disabled={this.state.isDisableUser}
                                            validators={{
                                                requiredCurrentResidentialNumber: (val) => val && val.length,
                                            }}
                                        />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".CurrentResidentialNumber"
                                            messages={{
                                                requiredCurrentResidentialNumber: 'Current Residential No. is Required.'
                                            }}
                                        ></Errors>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Current Residential Name *</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text component={TextField} model='.CurrentResidentialName' id='.CurrentResidentialName'
                                            className={styles.marginb} disabled={this.state.isDisableUser}
                                            validators={{
                                                requiredCurrentResidentialName: (val) => val && val.length,
                                            }}
                                        />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".CurrentResidentialName"
                                            messages={{
                                                requiredCurrentResidentialName: 'Current Residential Name is Required.'
                                            }}
                                        ></Errors>
                                    </div>
                                </div>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Current Street *</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text component={TextField} model='.CurrentRoadStreet' id='.CurrentRoadStreet'
                                            className={styles.marginb} disabled={this.state.isDisableUser}
                                            validators={{
                                                requiredCurrentRoadStreet: (val) => val && val.length,
                                            }}
                                        />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".CurrentRoadStreet"
                                            messages={{
                                                requiredCurrentRoadStreet: 'Current Street is Required.'
                                            }}
                                        ></Errors>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Current Landmark *</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text component={TextField} model='.CurrentLandmark' id='.CurrentLandmark'
                                            className={styles.marginb} disabled={this.state.isDisableUser}
                                            validators={{
                                                requiredCurrentLandmark: (val) => val && val.length,
                                            }}
                                        />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".CurrentLandmark"
                                            messages={{
                                                requiredCurrentLandmark: 'Current Landmark is Required.'
                                            }}
                                        ></Errors>
                                    </div>
                                </div>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Current Area *</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text component={TextField} model='.CurrentLocalityArea' id='.CurrentLocalityArea'
                                            className={styles.marginb} disabled={this.state.isDisableUser}
                                            validators={{
                                                requiredCurrentArea: (val) => val && val.length,
                                            }}
                                        />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".CurrentLocalityArea"
                                            messages={{
                                                requiredCurrentArea: 'Current Area is Required.'
                                            }}
                                        ></Errors>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Current City *</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text component={TextField} model='.CurrentCity' id='.CurrentCity'
                                            className={styles.marginb} disabled={this.state.isDisableUser}
                                            validators={{
                                                requiredCurrentCity: (val) => val && val.length,
                                            }}
                                        />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".CurrentCity"
                                            messages={{
                                                requiredCurrentCity: 'Current City is Required.'
                                            }}
                                        ></Errors>
                                    </div>
                                </div>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Current Pincode *</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text component={TextField} model='.CurrentPincode' id='.CurrentPincode'
                                            className={styles.marginb} disabled={this.state.isDisableUser}
                                            validators={{
                                                requiredCurrentPincode: (val) => val && val.length,
                                            }}
                                        />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".CurrentPincode"
                                            messages={{
                                                requiredCurrentPincode: 'Current Pincode is Required.'
                                            }}
                                        ></Errors>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Current State *</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text component={TextField} model='.CurrentState' id='.CurrentState'
                                            className={styles.marginb} disabled={this.state.isDisableUser}
                                            validators={{
                                                requiredCurrentState: (val) => val && val.length,
                                            }}
                                        />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".CurrentState"
                                            messages={{
                                                requiredCurrentState: 'Current State is Required.'
                                            }}
                                        ></Errors>
                                    </div>
                                </div>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Accomodation Type*:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.select style={{ height: "30px" }} model='.AccomodationType' id='.AccomodationType' disabled={this.state.isDisableUser}
                                            validators={{ requiredAccomodationType: (val) => val && val != "--Select--" }}>
                                            <option>--Select--</option>
                                            <option value="Paying Guest">Paying Guest</option>
                                            <option value="Tenant">Tenant</option>
                                            <option value="Owned">Owned</option>
                                        </Control.select>
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model='.AccomodationType'
                                            messages={{
                                                requiredAccomodationType: 'Accomodation Type is Required.'
                                            }}
                                        ></Errors>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Is Permanent Address Same as Current Address?</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.checkbox model=".IsSameAsCurrAddress" disabled={this.state.isDisableUser} />
                                    </div>
                                </div>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    <div className={`ms-Grid-col ms-u-sm12 block ${styles.padding0}`}>   {this.isSameAsCurrentAdress(this.props.Employee)}</div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Aadhar No :</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text model='.AadharNo' id='.AadharNo'
                                            component={TextField} className={styles.marginb} disabled={this.state.isDisableUser}
                                            validators={{
                                                requiredAadharNo: (val) => val && val.length && val.length == 12,
                                                isNumber: (val) => (!isNaN(Number(val)))
                                            }}
                                        />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".AadharNo"
                                            messages={{
                                                requiredAadharNo: 'Aadhar Card No. requires 12 digits',
                                                isNumber: 'Only numbers allowed'
                                            }}
                                        ></Errors>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>PAN No:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text model='.PanNo' id='.PanNo'
                                            component={TextField} className={styles.marginb} disabled={this.state.isDisableUser}
                                            validators={{
                                                panFormat: (val) => (/[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}/.test(val) && val.length < 11 && val.length)
                                            }}
                                        />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".PanNo"
                                            messages={{
                                                panFormat: 'Invalid Pan No(eg: abcde1234a)'
                                            }}
                                        ></Errors>
                                    </div>
                                </div>
                                <div className={`ms-Grid-row ${styles.rowhr}`}>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Is Passport available:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.checkbox model='.IsPassAvail' disabled={this.state.isDisableUser} />
                                    </div>
                                    {this.isPassportAvailable(this.props.Employee)}
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 block"><DefaultButton id="DefaultSubmit" primary={true} text={"Submit"} type="submit"
                                        disabled={this.state.buttonDisabled} className={styles.submitbutton} /></div>
                                </div>
                            </div>
                        </Form>

                    </div>
                </div>
            </div>
        );
    }

    private isSameAsCurrentAdress(props) {
        if (props.IsSameAsCurrAddress == false) {
            return (
                <div className={`ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 block ${styles.padding0}`}>
                    <div className={`ms-Grid-row ${styles.rowhr}`}>
                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                            <label>Permanent Residential No. *</label>
                        </div>
                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                            <Control.text component={TextField} model='.PermanentResidentialNumber' id='.PermanentResidentialNumber'
                                className={styles.marginb} disabled={this.state.isDisableUser}
                                validators={{
                                    requiredPermanentResidentialNumber: (val) => val && val.length,
                                }}
                            />
                            <Errors
                                className={styles.errors}
                                show="touched"
                                model=".PermanentResidentialNumber"
                                messages={{
                                    requiredPermanentResidentialNumber: 'Permanent Residential No. is Required.'
                                }}
                            ></Errors>
                        </div>
                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                            <label>Permanent Residential Name *</label>
                        </div>
                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                            <Control.text component={TextField} model='.PermanentResidentialName' id='.PermanentResidentialName'
                                className={styles.marginb} disabled={this.state.isDisableUser}
                                validators={{
                                    requiredPermanentResidentialName: (val) => val && val.length,
                                }}
                            />
                            <Errors
                                className={styles.errors}
                                show="touched"
                                model=".PermanentResidentialName"
                                messages={{
                                    requiredPermanentResidentialName: 'Permanent Residential Name is Required.'
                                }}
                            ></Errors>
                        </div>
                    </div>
                    <div className={`ms-Grid-row ${styles.rowhr}`}>
                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                            <label>Permanent Street *</label>
                        </div>
                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                            <Control.text component={TextField} model='.PermanentRoadStreet' id='.PermanentRoadStreet'
                                className={styles.marginb} disabled={this.state.isDisableUser}
                                validators={{
                                    requiredPermanentRoadStreet: (val) => val && val.length,
                                }}
                            />
                            <Errors
                                className={styles.errors}
                                show="touched"
                                model=".PermanentRoadStreet"
                                messages={{
                                    requiredPermanentRoadStreet: 'Permanent Street is Required.'
                                }}
                            ></Errors>
                        </div>
                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                            <label>Permanent Landmark *</label>
                        </div>
                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                            <Control.text component={TextField} model='.PermanentLandmark' id='.PermanentLandmark'
                                className={styles.marginb} disabled={this.state.isDisableUser}
                                validators={{
                                    requiredLandmark: (val) => val && val.length,
                                }}
                            />
                            <Errors
                                className={styles.errors}
                                show="touched"
                                model=".PermanentLandmark"
                                messages={{
                                    requiredLandmark: 'Permanent Landmark is Required.'
                                }}
                            ></Errors>
                        </div>
                    </div>
                    <div className={`ms-Grid-row ${styles.rowhr}`}>
                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                            <label>Permanent Area *</label>
                        </div>
                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                            <Control.text component={TextField} model='.PermanentLocalityArea' id='.PermanentLocalityArea'
                                className={styles.marginb} disabled={this.state.isDisableUser}
                                validators={{
                                    requiredPermanentArea: (val) => val && val.length,
                                }}
                            />
                            <Errors
                                className={styles.errors}
                                show="touched"
                                model=".PermanentLocalityArea"
                                messages={{
                                    requiredPermanentArea: 'Permanent Area is Required.'
                                }}
                            ></Errors>
                        </div>
                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                            <label>Permanent City *</label>
                        </div>
                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                            <Control.text component={TextField} model='.PermanentCity' id='.PermanentCity'
                                className={styles.marginb} disabled={this.state.isDisableUser}
                                validators={{
                                    requiredPermanentCity: (val) => val && val.length,
                                }}
                            />
                            <Errors
                                className={styles.errors}
                                show="touched"
                                model=".PermanentCity"
                                messages={{
                                    requiredPermanentCity: 'Permanent City is Required.'
                                }}
                            ></Errors>
                        </div></div>
                    <div className={`ms-Grid-row ${styles.rowhr}`}>
                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                            <label>Permanent Pincode *</label>
                        </div>
                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                            <Control.text component={TextField} model='.PermanentPincode' id='.PermanentPincode'
                                className={styles.marginb} disabled={this.state.isDisableUser}
                                validators={{
                                    requiredPermanentPincode: (val) => val && val.length,
                                }}
                            />
                            <Errors
                                className={styles.errors}
                                show="touched"
                                model=".PermanentPincode"
                                messages={{
                                    requiredPermanentPincode: 'Permanent Pincode is Required.'
                                }}
                            ></Errors>
                        </div>
                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                            <label>Permanent State *</label>
                        </div>
                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                            <Control.text component={TextField} model='.PermanentState' id='.PermanentState'
                                className={styles.marginb} disabled={this.state.isDisableUser}
                                validators={{
                                    requiredPermanentState: (val) => val && val.length,
                                }}
                            />
                            <Errors
                                className={styles.errors}
                                show="touched"
                                model=".PermanentState"
                                messages={{
                                    requiredPermanentState: 'Permanent State is Required.'
                                }}
                            ></Errors>
                        </div>
                    </div>
                </div>);
        }
    }

    private isPassportAvailable(props) {
        if (props.IsPassAvail != false) {
            return (
               
                <div className={`ms-Grid-col ms-u-sm12 block ${styles.padding0} ${styles.passportblk}`}>
                    <div className={`ms-Grid-row ${styles.rowhr}`}>
                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                            <label>Passport No *:</label>
                        </div>
                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                            <Control.text model='.PassportNo' id='.PassportNo'
                                component={TextField} className={styles.marginb} disabled={this.state.isDisableUser}
                                //put date validation 
                                validators={{
                                    requiredPassNo: (val) => val && val.length,
                                    ispassportValid: (val) => ((/[A-Z]{1}[0-9]{7}/.test(val) && val.length == 8))

                                }}
                            />
                            <Errors
                                className={styles.errors}
                                show="touched"
                                model=".PassportNo"
                                messages={{
                                    requiredPassNo: 'Passport no is Required.(eg.X1234567)',
                                    ispassportValid: 'Invalid passport No.(eg.X1234567)',

                                }}
                            ></Errors>
                        </div>
                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                            <label>Passport Validity *:</label>
                        </div>
                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                            <Control model='.PassportValidity' component={DatePicker} className={styles.marginb} disabled={this.state.isDisableUser}
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
                                    requiredPassportValidity: 'Passport validity is Required.'
                                }}
                            ></Errors>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="ms-Grid-col block grid-visa">
                            <tr>
                                <th colSpan={8} style={{ textAlign: "left" }}><span>Visa Details
                                <button type="button" onClick={() => this.handleRowAdd("visaDetailItems")} disabled={this.state.isDisableUser} className={styles.addbtn}>+</button>
                                </span> </th>
                            </tr>
                            {props.visaDetailItems.map((visa, i) => {

                                return (
                                    <tr>
                                        <td>
                                            <label style={{ display: "block" }}>Valid Visa</label>
                                            <Control.checkbox model={`Employee.visaDetailItems[${i}].ValidVisa`} style={{ height: "30px" }} disabled={this.state.isDisableUser} id={visa.ValidVisa} ></Control.checkbox>
                                        </td>
                                        <td>
                                            <label>Visa Of Country </label>
                                            <Control.text model={`Employee.visaDetailItems[${i}].VisaOfCountry`} id={visa.VisaOfCountry}
                                                component={TextField} className={styles.marginb} disabled={this.state.isDisableUser}
                                                validators={{
                                                    requiredVisaOfCountry: (val) => val && val.length

                                                }}
                                            ></Control.text>
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`Employee.visaDetailItems[${i}].VisaOfCountry`}
                                                messages={{
                                                    requiredVisaOfCountry: 'Please remove row if Visa details not available'
                                                }}
                                            ></Errors>
                                        </td>
                                        <td>
                                            <label>Visa No </label>
                                            <Control.text model={`Employee.visaDetailItems[${i}].VisaNo`} id={visa.VisaNo}
                                                disabled={this.state.isDisableUser}
                                                //put date validation 
                                                validators={{
                                                    isVisaValid: (val) => ((/[A-Z]{2}[0-9]{6}/.test(val) && val.length == 8))
                                                }}
                                                component={TextField} className={styles.marginb}
                                            ></Control.text>
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`Employee.visaDetailItems[${i}].VisaNo`}
                                                messages={{
                                                    isVisaValid: 'Invalid Visa No.(eg.XX123456)'
                                                }}
                                            ></Errors>
                                        </td>
                                        <td>
                                            <label>Entry </label>
                                            <Control.select model={`Employee.visaDetailItems[${i}].Entry`} id={visa.Entry}
                                                className={styles.dropdowncustom} disabled={this.state.isDisableUser}
                                            >
                                                <option>--Select--</option>
                                                <option key='Multiple Entry' value='Multiple Entry'>Multiple Entry</option>
                                                <option key='Single Entry' value='Single Entry'>Single Entry</option>

                                            </Control.select>
                                        </td>
                                        <td>
                                            <label>Visa Validity </label>
                                            <Control model={`Employee.visaDetailItems[${i}].VisaValidity`} id={visa.VisaValidity}
                                                disabled={this.state.isDisableUser}
                                                component={DatePicker} className={styles.marginb}
                                                mapProps={{
                                                    value: (props) => { return props.viewValue; },
                                                    onSelectDate: (props) => { return props.onChange; }
                                                }}
                                            >
                                            </Control>
                                        </td>
                                        <td>
                                            <label style={{ display: "block" }}>Is Travelled</label>
                                            <Control.checkbox model={`Employee.visaDetailItems[${i}].IsTravelled`} style={{ height: "30px" }} disabled={this.state.isDisableUser} id={`Employee.visaDetailItems[${i}].IsTravelled`} />
                                        </td>
                                        <td>
                                            <button type="button" style={{ marginTop: "4px" }} disabled={this.state.isDisableUser} onClick={() => this.handleRowRemove("visaDetailItems", i)} className={styles.removebtn}>-</button>
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
                
                <div className={`ms-Grid-col ms-u-sm12 ms-u-md12 block ${styles.padding0}`}>
                    <div className={`ms-Grid-row ${styles.rowhr}`}>
                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                            <label>Spouse Name *:</label>
                        </div>
                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                            <Control.text model='.SpouceName' id='.SpouceName' disabled={this.state.isDisableUser}
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
                                    requiredSpouceName: 'Spouse name is Required.'
                                }}
                            ></Errors>
                        </div>
                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                            <label>Spouse Occupation *:</label>
                        </div>
                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                            <Control.text model='.SpouseOccupation' id='.SpouseOccupation' disabled={this.state.isDisableUser}
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
                                    requiredSpouseOccupation: 'Spouse occupation is Required.'
                                }}
                            ></Errors>
                        </div></div>
                    <div className={`ms-Grid-row ${styles.rowhr}`}>
                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                            <label>Spouse DOB *:</label>
                        </div>
                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                            <Control model='.SpouceDOB' id='.SpouceDOB' component={DatePicker} disabled={this.state.isDisableUser} className={styles.marginb}
                                mapProps={{
                                    value: (props) => { return props.viewValue; },
                                    onSelectDate: (props) => { return props.onChange; }
                                }}
                                //put date validation Date can't be future date
                                validators={{
                                    requiredSpouceDOB: (val) => (val && (new Date() > new Date(val))),
                                }}
                            ></Control>
                            <Errors
                                className={styles.errors}
                                show="touched"
                                model='.SpouceDOB'
                                messages={{
                                    requiredSpouceDOB: "Date can not be future dated"
                                }}
                            ></Errors>
                        </div>
                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                            <label>Marraige Anniversary *:</label>
                        </div>
                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                            <Control model='.MarraigeAnniversary' id='.MarraigeAnniversary' component={DatePicker} disabled={this.state.isDisableUser} className={styles.marginb}
                                mapProps={{
                                    value: (props) => { return props.viewValue; },
                                    onSelectDate: (props) => { return props.onChange; }
                                }}
                                //put date validation Date can't be future date
                                validators={{
                                    requiredMarraigeAnniversary: (val) => (val && (new Date() > new Date(val))),
                                }}
                            ></Control>
                            <Errors
                                className={styles.errors}
                                show="touched"
                                model='.MarraigeAnniversary'
                                messages={{
                                    requiredMarraigeAnniversary: "Date can not be future dated"
                                }}
                            ></Errors>
                        </div>
                    </div>
                    <div className={styles.childdetailsec}>
                        <div className={`ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 block ${styles.padding0}`}>
                            <span>Children Details
                            <button type="button" disabled={this.state.isDisableUser} onClick={() => this.handleRowAdd("childDetailItems")} className={styles.addbtn}>+</button>
                            </span> </div>
                        {props.childDetailItems.map((child, i) => {
                            return (
                                <div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Child Name *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
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
                                                requiredChildName: 'Child name is Required..'
                                            }}
                                        ></Errors>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Child DOB *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm11 ms-u-md5 ms-u-lg3 block">
                                        <Control model={`Employee.childDetailItems[${i}].DateOfBirth`} id={child.DateOfBirth} component={DatePicker}
                                            className={styles.marginb}
                                            mapProps={{
                                                value: (props) => { return props.viewValue; },
                                                onSelectDate: (props) => { return props.onChange; }
                                            }}
                                            //put date validation Date can't be future date
                                            validators={{
                                                requiredDateOfBirth: (val) => (val && (new Date() > new Date(val))),
                                            }}
                                        ></Control>
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model={`Employee.childDetailItems[${i}].DateOfBirth`}
                                            messages={{
                                                requiredDateOfBirth: "Date can not be future dated"
                                            }}
                                        ></Errors>

                                    </div>

                                    <div className="ms-Grid-col ms-u-sm1 ms-u-md1 ms-u-lg1 block">  <button type="button" style={{ marginTop: "4px" }} onClick={() => this.handleRowRemove("childDetailItems", i)} className={styles.removebtn}>-</button></div>
                                    <div className="clearfix"></div>
                                </div>
                            );
                        })}
                    </div>
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
        RemoveDetailRowFromGrid: (removedItem, section, index) => {
            return dispatch(RemoveDetailRowFromGrid(removedItem, section, index));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDetail);

