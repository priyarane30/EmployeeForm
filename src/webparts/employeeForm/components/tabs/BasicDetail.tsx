import * as React from 'react';
import { Form, Control, Errors, actions, combineForms } from 'react-redux-form';
import {
    Dropdown,
    IDropdown,
    DropdownMenuItemType,
    IDropdownOption
} from "office-ui-fabric-react/lib/Dropdown";
import { ActionButton, DefaultButton, IButtonProps } from "office-ui-fabric-react/lib/Button";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { connect } from "react-redux";
import { GetEmpBasicData, SetTabName, GetEmpListIdByUserEmail, SetEmpIdInStore } from "../../actions/BasicEmpDetailAction";
import { ICommonState, IEmpListIdState } from '../../state/ICommonState';
import { IBasicDetailState } from '../../state/IBasicDetailState';
import BasicService from '../../services/BasicFormService'
import { ActionTypes } from '../../AppConstants';
import { store } from '../../store/ConfigureStore';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';

const required: any = (val: string) => val && val.length > 0;
const isEmail = (val) => val && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);
const notSetOrNumber: any = (val: string) => val && val.length === 0 || (Number(val) >= 1);
const minValue = min => value => value && value < min ? `Must be at least ${min}` : undefined;
const email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined;
interface IBasicFormConnectedDispatch {
    //Get Employee Id using Current User Email

    setEmpId: (empId) => void;
    setTabName: (tabName: ICommonState) => void;
    // Gets the options for dropdown fields
    getBasicDatail: (empListId) => void;
    //save data
    addBasicDetails: (empData: IBasicDetailState) => void;
}

/*interface IStateBasic {
    DateofJoining:Date;
  }*/
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
                <Form model="Basic" onSubmit={(val) => this.handleSubmit(val)}  >
                    <div className='col'>
                        <label>First Name:</label>

                        <Control.text model=".FirstName" id='.FirstName' component={TextField}
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
                    <div className='col'>
                        <label>Last Name:</label>
                        <Control.text model=".LastName" id='.LastName' component={TextField}
                        validators={{
                            requiredLastName: (val) => val && val.length,
                          
                        }}  />
                         <Errors
                            model=".LastName"
                            messages={{
                                requiredLastName: 'Please provide an email address.',
                            }}
                        />


                    </div>
                    <div className='col'>
                        <label>Date Of Joining:</label>
                        <Control model='.DateofJoining' id='.DateofJoining' component={DatePicker}
                            mapProps={{
                                value: (props) => { return props.viewValue },
                                onSelectDate: (props) => { return props.onChange }
                            }}
                        ></Control>
                    </div>
                    <div className='col'>
                        <label>Designation:</label>
                        <Control.select model=".Designation" id=".Designation"  validators={{
                            requiredDesignationStatus: (val) =>  val && val!="--Select--"
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
                    <div className='col'>
                        <label>Technology:</label>
                        <Control.select model=".Technology" id=".Technology" validators={{
                            requiredTechnology: (val) =>  val && val!="--Select--"
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
                    <div className='col'>
                        <label>Company Email:</label>
                        <Control.text model=".CompanyEmail" id='.CompanyEmail' component={TextField} 
                         validators={{
                            requiredEmail: (val) => val && val.length,
                            isEmail: (val) => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) // ES6 property shorthand
                        }}/>
                        <Errors
                            model=".PersonalEmail"
                            messages={{
                                requiredEmail: 'Please provide an email address.',
                                isEmail: (val) => `${val} is not a valid email.`,
                            }}
                        />


                    </div>
                    <button type="submit">Submit</button>
                </Form>
            </div>
        );

    }
    private _onSelectDate = (date: Date | null | undefined): void => {
        this.setState({ DateofJoining: date });
    };

    private _onFormatDate = (date: Date): string => {
        return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    };
}

const mapStateToProps = function (state) {
    // console.log(state)
    return state;
}


// Maps dispatch to props
const mapDispatchToProps = (dispatch): IBasicFormConnectedDispatch => {
    debugger
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
