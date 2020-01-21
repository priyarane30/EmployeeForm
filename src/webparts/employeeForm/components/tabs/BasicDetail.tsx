import * as React from 'react';
import { Form, Control, Errors } from 'react-redux-form';

import { DefaultButton,PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { connect } from "react-redux";
import { GetEmpBasicData, SetTabName, GetEmpListIdByUserEmail, SetEmpIdInStore } from "../../actions/BasicEmpDetailAction";
import { ICommonState, IEmpListIdState } from '../../state/ICommonState';
import { IBasicDetailState } from '../../state/IBasicDetailState';
import BasicService from '../../services/BasicFormService'
import { ActionTypes } from '../../AppConstants';
import { store } from '../../store/ConfigureStore';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import styles from "../EmployeeForm.module.scss";

interface IBasicFormConnectedDispatch {
    //Get Employee Id using Current User Email
    setEmpId: (empId) => void;
    setTabName: (tabName: ICommonState) => void;
    // Gets the options for dropdown fields
    getBasicDatail: (empListId) => void;
    //save data
    addBasicDetails: (empData: IBasicDetailState) => void;
}

class BasicDetail extends React.Component<any>{
    constructor(props) {
        super(props);
        //  this.state = { DateofJoining: null };
    }


    handleSubmit(formValues) {
        let newEmpReqServiceObj: BasicService = new BasicService();
        //  let date=this.state.DateofJoining;
        const idState = store.getState().EmpListId;
        if (idState != null && idState != undefined) {
            newEmpReqServiceObj.UpdateBasicDetail(formValues, idState).then(resp => {
                //debugger

            }).catch(() => {
                alert("Sorry. Error while adding employee...");
            });
        }
        else {
            newEmpReqServiceObj.AddBasicDetail(formValues).then(resp => {
                let empIdState = { EmpListID: resp } as IEmpListIdState;
                dispatch => {
                    dispatch({
                        type: ActionTypes.GetEmpID,
                        payload: empIdState
                    });
                }
            }).catch(() => {
                alert("Sorry. Error while adding employee...");
            });
        }
    }

    async componentDidMount() {
        console.log("Basic Details");
        var eId = await GetEmpListIdByUserEmail(this.props.empEmail)
        if (eId != null && eId != undefined) {
            //set empId in store
            this.props.setEmpId(eId);
            this.props.getBasicDatail(eId);
            this.props.showTabs(eId);
        }
        const CommonState: ICommonState = { CurrentForm: "Employee" };
        this.props.setTabName(CommonState);
    }

    public render() {
        let desigOpt, techOpts;

        if (this.props.Basic != null || this.props.Basic != undefined) {
            if (this.props.Basic.designationOptions != null || this.props.Basic.designationOptions != undefined) {
                desigOpt = this.props.Basic.designationOptions.map(desig => { return <option key={desig} value={desig}>{desig}</option> });
            }
            if (this.props.Basic.technologyOptions != null || this.props.Basic.technologyOptions != undefined) {
                techOpts = this.props.Basic.technologyOptions.map(tech => { return <option key={tech} value={tech}>{tech}</option> });
            }
        }

        console.log(this.props)
        if (!this.props.Employee) return (<div> Loading.... </div>)

        return (
            <div>
                <div className={styles.employeeForm}>
                    <div className={styles.container}>
                        <div className={`ms-Grid-row  ms-fontColor-white ${styles.row}`}>
                            <Form model="Basic" onSubmit={(val) => this.handleSubmit(val)}  >

                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>First Name *:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.text model=".FirstName" id='.FirstName' component={TextField} className={styles.marginb}
                                        validators={{
                                            requiredFirstName: (val) => val && val.length,

                                        }} />
                                    <Errors
                                        model=".FirstName"
                                        messages={{
                                            requiredFirstName: 'Please provide an email address.',
                                        }}
                                    />

                                </div>
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Last Name *:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.text model=".LastName" id='.LastName' component={TextField} className={styles.marginb}
                                        validators={{
                                            requiredLastName: (val) => val && val.length,

                                        }} />
                                    <Errors
                                        model=".LastName"
                                        messages={{
                                            requiredLastName: 'Please provide an email address.',
                                        }}
                                    />


                                </div>

                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Date Of Joining *:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control model='.DateofJoining' id='.DateofJoining' component={DatePicker} className={styles.marginb}
                                        mapProps={{
                                            value: (props) => { return props.viewValue },
                                            onSelectDate: (props) => { return props.onChange }
                                        }}
                                    ></Control>
                                </div>
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Designation *:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.select model=".Designation" id=".Designation" className={styles.dropdowncustom} validators={{
                                        requiredDesignationStatus: (val) => val && val != "--Select--"
                                    }} >
                                        <option>--Select--</option>
                                        {/*
                                this.props.Basic.designationOptions.map(desig => { return <option key={desig} value={desig}>{desig}</option> })
                            */}
                                        {desigOpt}
                                    </Control.select>
                                    <Errors
                                        model=".Designation"
                                        messages={{
                                            requiredDesignationStatus: 'Please Select Designation.'
                                        }}
                                    />
                                </div>
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Technology *:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.select model=".Technology" id=".Technology" className={styles.dropdowncustom} validators={{
                                        requiredTechnology: (val) => val && val != "--Select--"
                                    }}   >
                                        <option>--Select--</option>
                                        {/* {technologies.map(tech => { return <option key={tech} value={tech}>{tech}</option> })} */}

                                        {techOpts}
                                    </Control.select>
                                    <Errors
                                        model=".Technology"
                                        messages={{
                                            requiredTechnology: 'Please Select Technology.'
                                        }}
                                    />
                                </div>
                                <div className='ms-Grid-col ms-u-sm4 block'>
                                    <label>Company Email *:</label>
                                </div>
                                <div className="ms-Grid-col ms-u-sm8 block">
                                    <Control.text model=".CompanyEmail" id='.CompanyEmail' className={styles.marginb} component={TextField}
                                        validators={{
                                            requiredEmail: (val) => val && val.length,
                                            isEmail: (val) => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) // ES6 property shorthand
                                        }} />
                                    <Errors
                                        model=".PersonalEmail"
                                        messages={{
                                            requiredEmail: 'Please provide an email address.',
                                            isEmail: (val) => `${val} is not a valid email.`,
                                        }}
                                    />
                                </div>
                                <div >
                                    <div >
                                        <div>
                                            <DefaultButton id="DefaultSubmit"
                                                primary={true}
                                                text={"Submit"}
                                                type="submit" />
                                        </div>

                                    </div>
                                </div>


                                {/* <button type="submit">Submit</button> */}


                            </Form>
                        </div>
                    </div>

                </div>
            </div>
        );

    }
}

const mapStateToProps = function (state) {
    return state;
}


// Maps dispatch to props
const mapDispatchToProps = (dispatch): IBasicFormConnectedDispatch => {

    return {
        setEmpId: (empId) => {
            return dispatch(SetEmpIdInStore(empId));
        },
        setTabName: (tabData: ICommonState) => {
            return dispatch(SetTabName(tabData));
        },
        getBasicDatail: (empListId) => {
            return dispatch(GetEmpBasicData(empListId));
        },
        addBasicDetails: (empData: IBasicDetailState) => {
            // return dispatch(AddNewEmployee(empData));
        },


    };
};


export default connect(mapStateToProps, mapDispatchToProps)(BasicDetail);
