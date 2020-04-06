import * as React from 'react';
import { Form, Control, Errors } from 'react-redux-form';
import { connect } from "react-redux";
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { GetEmpBasicData, SetTabName, GetEmpListIdByUserEmail, SetEmpIdInStore } from "../../actions/BasicEmpDetailAction";
import { ICommonState, IEmpListIdState } from '../../state/ICommonState';
import BasicService from '../../services/BasicFormService';
import { ActionTypes } from '../../AppConstants';
import { store } from '../../store/ConfigureStore';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import styles from "../EmployeeForm.module.scss";
import { ListItemPicker } from '@pnp/spfx-controls-react/lib/listItemPicker';
import pnp from 'sp-pnp-js';
interface IBasicFormConnectedDispatch {
    //Get Employee Id using Current User Email
    setEmpId: (empId) => void;
    setTabName: (tabName: ICommonState) => void;
    // Gets the options for dropdown fields
    getBasicDatail: (empListId) => void;
}

interface IButtonState {
    isDisable: boolean;
    selectedTechnologies: any[];
    queryIDState: number;
    display:string;
    isDisableUser:boolean;
}

class BasicDetail extends React.Component<any, IButtonState>{

    constructor(props) {
        
        super(props);
        this.state = {
            isDisable: true,
            selectedTechnologies: [],
            queryIDState: 0,
            display:"none",
            isDisableUser:false,
            
        };
    }
    //On Button Save : Basic Details saved In List
    public async handleSubmit(formValues) {
        if(this.state.selectedTechnologies.length==0){this.setState({display:"block"})}
        else{
        let idState = store.getState().EmpListId;
        this.SaveBasicDetails(idState, formValues);}
    }

    public async SaveBasicDetails(empListId, formValues) {
        this.props.handleSpinner(false);
        let newEmpReqServiceObj: BasicService = new BasicService();
        this.setState({ isDisable: true });
        let AdLoginName = await this.getUserId(this.props.empEmail);
        let technologydata = this.convertTechnologyinString(this.state.selectedTechnologies);
        if (empListId.EmpListID != 0) {
            //Edit Form when ID is not null
            //null && idState != undefined
            newEmpReqServiceObj.UpdateBasicDetail(formValues, technologydata, empListId, AdLoginName).then(resp => {
                this.setState({ isDisable: false });
                alert("Basic details saved successfully");
                this.props.handleSpinner(true);
                this.props.handleTabClick();
            }).catch(() => {
                alert("Sorry. Error while adding employee...");
            });
        }
        else {
            //New Form 
          await  newEmpReqServiceObj.AddBasicDetail(formValues, technologydata, AdLoginName).then(resp => {
                let empIdState = { EmpListID: resp } as IEmpListIdState;
                this.props.setEmpId(empIdState);
                this.setState({ isDisable: false });
                this.getpreviousrecord(empIdState.EmpListID);
              //  alert("Basic details saved successfully");
              //  this.props.handleSpinner(true);
              //  this.props.handleTabClick();
            }).catch(() => {
                alert("Sorry. Error while adding employee...");
            });
        }
    }
    public async getpreviousrecord(empListId){
        let newEmpReqServiceObj: BasicService = new BasicService();
        await newEmpReqServiceObj.GetEmpBasicDataById(empListId-1).then(resp => {
            newEmpReqServiceObj.UpdateEmployeeCode((Number(resp.EmployeeCode)+1).toString(),empListId).then(resp => {
                alert("Basic details saved successfully");
                this.props.handleSpinner(true);
                this.props.handleTabClick();
             }).catch(() => {
                alert("Sorry. Error while geting previous employee...");
            });
        }).catch(() => {
            alert("Sorry. Error while geting previous employee...");
        });
    }
    public async componentDidMount() {
        const CommonState: ICommonState = { CurrentForm: "Employee" };
        this.props.setTabName(CommonState);
        let newEmpReqServiceObj: BasicService = new BasicService();
        //Is user in HR Group
       
        let isExistsInHR = false;
        if (this.props.empEmail != null && this.props.empEmail != undefined && this.props.empEmail != '') {
            var userGroups = await newEmpReqServiceObj.GetCurrentUserGroups(this.props.empEmail);
            if (userGroups != null && userGroups != undefined) {
                userGroups.forEach(grp => {
                    if (grp == 'HR Team')
                        isExistsInHR = true;
                });
            }
          
            var employementStatus=await newEmpReqServiceObj.GetEmploymentStatusByUserEmail(this.props.empEmail);
            this.props.assignedToHR(employementStatus);
            if(employementStatus=="Assigned to HR" && isExistsInHR==false){this.setState({isDisable:false})}
        }
      this.setState({isDisableUser:this.props.isAssignedToHR})
     
        var eId = await GetEmpListIdByUserEmail(this.props.empEmail);
        var queryEmpID = { EmpListID: 0 } as IEmpListIdState;
        var queryParameters = new UrlQueryParameterCollection(window.location.href);
        const queryID: number = parseInt(queryParameters.getValue("EmpID"));
        if (queryID > 0 && eId.EmpListID != 0) {
            this.setState({ queryIDState: queryID });
            queryEmpID.EmpListID = queryID;
            this.props.setEmpId(queryEmpID);//set empId in store
            this.props.showTabs(eId, isExistsInHR);
            this.getuserData(queryEmpID);
        }
        else if (eId != null && eId != undefined) {
            this.props.setEmpId(eId);//set empId in store
            this.props.showTabs(eId, isExistsInHR);
            this.getuserData(eId);
        }
        this.onSelectedItem = this.onSelectedItem.bind(this);
    }
    public async getuserData(EmpID) {
       
        let newEmpReqServiceObj: BasicService = new BasicService();
        var technology = await newEmpReqServiceObj.GetEmpTechnology(EmpID.EmpListID);
        if (technology != null && technology != undefined) {
            var TechnologyDropDown = technology.split(",");
            let final = [];
            TechnologyDropDown.forEach(tech => {
                final.push({ 'key': tech, 'name': tech });
            });
            this.setState({ selectedTechnologies: final });
        }
        await this.props.getBasicDatail(EmpID.EmpListID);//get Basic Details
    }
        public render() {
        pnp.setup({
            spfxContext: this.props.context
        });
        let desigOpt;
        if (this.props.Basic != null || this.props.Basic != undefined) {
            if (this.props.Basic.designationOptions != null || this.props.Basic.designationOptions != undefined) {
                desigOpt = this.props.Basic.designationOptions.map(desig => {
                    return <option key={desig} value={desig}>{desig}</option>;
                });
            }
        }
        if (!this.props.Basic) return (<div> Loading.... </div>);
        if (this.state.queryIDState == 0) {
            return (
                <div>
                    <div className={styles.employeeForm}>
                        <div className={styles.container}>
                            <div className={`ms-Grid-row ${styles.row}`}>{/* ms-fontColor-white  */}
                                <Form model="Basic" onSubmit={(val) => this.handleSubmit(val)}  >
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>First Name *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text model=".FirstName" id='.FirstName' component={TextField} className={styles.marginb} disabled={this.state.isDisableUser}
                                            validators={{ requiredFirstName: (val) => val && val.length }} />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".FirstName" messages={{ requiredFirstName: 'First Name is requried..' }} />
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Last Name *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text model=".LastName" id='.LastName' component={TextField} className={styles.marginb} disabled={this.state.isDisableUser}
                                            validators={{ requiredLastName: (val) => val && val.length }} />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".LastName" messages={{ requiredLastName: 'Last Name is requried.' }} />
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Date Of Joining *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control model='.DateofJoining' id='.DateofJoining' component={DatePicker}  className={styles.marginb} disabled={this.state.isDisableUser}
                                            mapProps={{
                                                value: (props) => { return props.viewValue; },
                                                onSelectDate: (props) => { return props.onChange; }
                                            }}
                                            validators={{
                                                requiredDateOfBirth: (val) => (val && (new Date() > new Date(val))),
                                            }}
                                        ></Control>
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".DateofJoining"
                                            messages={{
                                                requiredDateOfBirth: 'Date can not be future dated'
                                            }}
                                        ></Errors>
                                    </div> <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Designation *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.select model=".Designation" id=".Designation" className={styles.dropdowncustom} disabled={this.state.isDisableUser} validators={{
                                            requiredDesignationStatus: (val) => val && val != "--Select--"
                                        }} >
                                            <option>--Select--</option>
                                            {desigOpt}
                                        </Control.select>
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".Designation"
                                            messages={{
                                                requiredDesignationStatus: 'Designation is requried.'
                                            }}
                                        />
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Technology *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <ListItemPicker listId='6fd1826b-625e-4288-8e10-df480fb0d17d'
                                            columnInternalName='Title'
                                            itemLimit={5}
                                            onSelectedItem={this.onSelectedItem}
                                            context={this.props.context}
                                            disabled={this.state.isDisableUser}
                                            suggestionsHeaderText="Please select Technology"
                                            defaultSelectedItems={this.props.Basic.Technology ? this.props.Basic.Technology : this.state.selectedTechnologies}//{this.state.selectedTechnologies}
                                            
                                        />
                                        <span style={{display: `${this.state.display}`}}  
                                            className={styles.errors}>Technology is required</span>
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Company Email *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text model=".CompanyEmail" id='.CompanyEmail' className={styles.marginb} disabled={this.state.isDisableUser} component={TextField}
                                            validators={{
                                                requiredEmail: (val) => val && val.length,
                                                isEmail: (val) =>val && (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) || val.length == 0) // ES6 property shorthand
                                            }} />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".CompanyEmail"
                                            messages={{
                                                requiredEmail: 'Company Email is requried.',
                                                isEmail: (val) => `${val} is not a valid email.`,
                                            }}
                                        />
                                    </div>

                                    <DefaultButton id="DefaultSubmit" primary={true} text={"Submit"} type="submit"
                                        disabled={!this.state.isDisable}  className={styles.submitbutton} />
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        else {
            return (

                <div>
                    <div className={styles.employeeForm}>
                        <div className={styles.container}>
                            <div className={`ms-Grid-row ${styles.row}`}>{/* ms-fontColor-white  */}
                                <Form model="Basic" onSubmit={(val) => this.handleSubmit(val)}  >
                                     <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                            <label>Employee Code:</label>
                                        </div>
                                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4  block">
                                            <Control.text model=".EmployeeCode" id='.EmployeeCode' component={TextField} disabled={true} className={styles.marginb}
                                                validators={{ requiredEmployeeCode: (val) => val && val.length }} />
                                        </div>
                           
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>First Name *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text model=".FirstName" id='.FirstName' component={TextField} className={styles.marginb} disabled={this.state.isDisableUser}
                                            validators={{ requiredFirstName: (val) => val && val.length }} />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".FirstName" messages={{ requiredFirstName: 'First Name is requried.' }} />
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Last Name *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text model=".LastName" id='.LastName' component={TextField} className={styles.marginb} disabled={this.state.isDisableUser}
                                            validators={{ requiredLastName: (val) => val && val.length }} />
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".LastName" messages={{ requiredLastName: 'Last Name is requried.' }} />
                                    </div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Date Of Joining *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control model='.DateofJoining' id='.DateofJoining' component={DatePicker} className={styles.marginb} disabled={this.state.isDisableUser}
                                            mapProps={{
                                                value: (props) => { return props.viewValue; },
                                                onSelectDate: (props) => { return props.onChange; }
                                            }}
                                            validators={{
                                                requiredDateOfBirth: (val) => (val && (new Date() > new Date(val))),
                                            }}
                                        ></Control>
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".DateofJoining"
                                            messages={{
                                                requiredDateOfBirth: 'Date can not be future dated'
                                            }}
                                        ></Errors>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Designation *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.select model=".Designation" id=".Designation" className={styles.dropdowncustom} disabled={this.state.isDisableUser} validators={{
                                            requiredDesignationStatus: (val) => val && val != "--Select--"
                                        }} >
                                            <option>--Select--</option>
                                            {desigOpt}
                                        </Control.select>
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".Designation"
                                            messages={{
                                                requiredDesignationStatus: 'Designation is required.'
                                            }}
                                        />
                                    </div>
                                     <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Technology *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <ListItemPicker listId='6fd1826b-625e-4288-8e10-df480fb0d17d'
                                            columnInternalName='Title'
                                            keyColumnInternalName='Id'
                                            itemLimit={5}
                                            onSelectedItem={this.onSelectedItem}

                                            context={this.props.context}
                                            disabled={this.state.isDisableUser}
                                            suggestionsHeaderText="Please select Technology"
                                            defaultSelectedItems={this.props.Basic.Technology ? this.props.Basic.Technology : this.state.selectedTechnologies}//{this.state.selectedTechnologies}
                                        />
                                      <span style={{display: `${this.state.display}`}}
                                            className={styles.errors}>Technology is required</span>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                        <label>Company Email *:</label>
                                    </div>
                                    <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                        <Control.text
                                            model=".CompanyEmail"
                                            id='.CompanyEmail' className={styles.marginb} disabled={this.state.isDisableUser} component={TextField} 
                                            validators={{
                                                requiredEmail: (val) => val && val.length,
                                                isEmail: (val) => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) || val.length == 0) // ES6 property shorthand

                                            }} />

                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model=".CompanyEmail"
                                            messages={{
                                                requiredEmail: 'Company Email is requried.',
                                                isEmail: (val) => `${val} is not a valid email.`,
                                            }}
                                        />
                                    </div>

                                    <DefaultButton id="DefaultSubmit" primary={true} text={"Submit"} type="submit"
                                        disabled={!this.state.isDisable} className={styles.submitbutton} />
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>);
        }
    }
    private onSelectedItem = (data: { key: string; name: string }[]): void => {
        this.setState({ selectedTechnologies: data,display:"none" });

    }
    private convertTechnologyinString = (data: { key: string; name: string }[]) => {
        let TechnologyName = [];
        for (var i = 0; i < data.length; i++) { TechnologyName.push(data[i].name); }
        var TechnologyString = TechnologyName.toString();
        return TechnologyString;
    }
    public getUserId(email: string): Promise<any> {
        return pnp.sp.site.rootWeb.ensureUser(email).
            then(result => {
                return result.data.Id;
            });
    }
}

const mapStateToProps = (state) => {
    return state;
};

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
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicDetail);
