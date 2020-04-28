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
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import BasicFormService from '../../services/BasicFormService';
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
    refferedBy: any;
    display: string;
    isDisableUser: boolean;
    disableDesignation: boolean;
}

class BasicDetail extends React.Component<any, IButtonState>{

    constructor(props) {

        super(props);
        this.state = {
            isDisable: true,
            selectedTechnologies: [],
            refferedBy: [],
            queryIDState: 0,
            display: "none",
            isDisableUser: true,
            disableDesignation: false
        };
    }
    //On Button Save : Basic Details saved In List
    public async handleSubmit(formValues) {
        if (this.state.selectedTechnologies.length == 0) { this.setState({ display: "block" }) }
        else {
            let idState = store.getState().EmpListId;
            this.SaveBasicDetails(idState, formValues);
        }
    }

    public async SaveBasicDetails(empListId, formValues) {
        this.props.handleSpinner(false);
        let newEmpReqServiceObj: BasicService = new BasicService();
        this.setState({ isDisable: true });
        let AdLoginName = await this.getUserId(this.props.empEmail);
        let technologydata = this.convertTechnologyinString(this.state.selectedTechnologies);
        var Refferer;
        if (this.state.refferedBy != null && this.state.refferedBy.length != 0) {
            debugger;
            Refferer = await this.getUserId(this.state.refferedBy);
        }
        else {
            Refferer = 0
        }
        if (empListId.EmpListID != 0) {
            //Edit Form when ID is not null
            //null && idState != undefined
            newEmpReqServiceObj.UpdateBasicDetail(formValues, technologydata, Refferer, empListId, AdLoginName).then(resp => {
                this.setState({ isDisable: false });
                alert("Basic details updated successfully");
                this.props.handleSpinner(true);
                this.props.handleTabClick();
            }).catch(() => {
                alert("Sorry. Error while adding employee...");
            });
        }
        else {
            //New Form 
            await newEmpReqServiceObj.AddBasicDetail(formValues, technologydata, Refferer, AdLoginName).then(resp => {
                let empIdState = { EmpListID: resp } as IEmpListIdState;
                this.props.setEmpId(empIdState);
                this.setState({ isDisable: false });
                // this.getEmployeecode(empIdState.EmpListID);
            }).catch(() => {
                alert("Sorry. Error while adding employee...");
            });
        }
    }
    public async getEmployeecode(empListId) {
        let newEmpReqServiceObj: BasicService = new BasicService();
        await newEmpReqServiceObj.GetLargestEmployeeCode().then(Employeecoderesp => {
            var employeeCode = Number(Employeecoderesp) + 1
            newEmpReqServiceObj.UpdateEmployeeCode((employeeCode.toString().length < 4 ? "0" + employeeCode : employeeCode).toString(), empListId).then(resp => {
                alert("Basic details updated successfully");
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
        var queryParameters = new UrlQueryParameterCollection(window.location.href);
        const queryID: number = parseInt(queryParameters.getValue("EmpID"));
        let isExistsInHR = false;
        if (this.props.empEmail != null && this.props.empEmail != undefined && this.props.empEmail != '') {
            var userGroups = await newEmpReqServiceObj.GetCurrentUserGroups(this.props.empEmail);
            if (userGroups != null && userGroups != undefined) {
                userGroups.forEach(grp => {
                    if (grp == 'HR Team')
                        isExistsInHR = true;
                });
            }

            var employementStatus = await newEmpReqServiceObj.GetEmploymentStatusByQuerryID(queryID);
            if (employementStatus == "Inactive") { this.setState({ isDisable: false }) }
        }


        var eId = await GetEmpListIdByUserEmail(this.props.empEmail);
        var queryEmpID = { EmpListID: 0 } as IEmpListIdState;

        if (queryID > 0 && eId.EmpListID != 0) {
            this.setState({ queryIDState: queryID });
            queryEmpID.EmpListID = queryID;
            this.props.setEmpId(queryEmpID);//set empId in store
            await this.props.showTabs(eId, isExistsInHR);
            this.props.assignedToHR(employementStatus);
            this.getuserData(queryEmpID);
        }
        else if (eId != null && eId != undefined) {
            this.props.setEmpId(eId);//set empId in store
            await this.props.showTabs(eId, isExistsInHR);
            this.props.assignedToHR(employementStatus);
            this.getuserData(eId);
        }
        if ((queryID > 0 || (eId.EmpListID != 0 && eId != null && eId != undefined)) && isExistsInHR == false) {
            this.setState({ disableDesignation: true });
        }
        this.setState({ isDisableUser: (isExistsInHR==false)?true:false })
        this.onSelectedItem = this.onSelectedItem.bind(this);
        this.PeoplePickerItems = this.PeoplePickerItems.bind(this);
        const empListId = store.getState().EmpListId;
        let newEmpServiceObj: BasicFormService = new BasicFormService();
        let myemail = await newEmpReqServiceObj.getRefferedByEmail(empListId);
        this.setState({ refferedBy: myemail });
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
            return (

                <div>
                    <div className={styles.employeeForm}>
                        <div className={styles.container}>
                            <div className={`ms-Grid-row ${styles.row}`}>{/* ms-fontColor-white  */}
                                <Form model="Basic" onSubmit={(val) => this.handleSubmit(val)}  >
                                    <div className={`ms-Grid-row ${styles.rowhr}`}>
                                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                            <label>Employee Code:</label>
                                        </div>
                                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4  block">
                                            <Control.text model=".EmployeeCode" id='.EmployeeCode' component={TextField} disabled={true} className={styles.marginb}
                                                validators={{ requiredEmployeeCode: (val) => val && val.length }} />
                                        </div>
                                    </div>
                                    <div className={`ms-Grid-row ${styles.rowhr}`}>
                                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                            <label>First Name :</label>
                                        </div>
                                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                            <Control.text model=".FirstName" id='.FirstName' disabled={this.state.isDisableUser} component={TextField} className={styles.marginb} />
                                        </div>
                                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                            <label>Last Name :</label>
                                        </div>
                                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                            <Control.text model=".LastName" id='.LastName' disabled={this.state.isDisableUser} component={TextField} className={styles.marginb} 
                                                />
                                        </div>
                                    </div>
                                    <div className={`ms-Grid-row ${styles.rowhr}`}>
                                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                            <label>Date Of Joining :</label>
                                        </div>
                                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                            <Control model='.DateofJoining' id='.DateofJoining' component={DatePicker} disabled={this.state.isDisableUser} className={styles.marginb}                                                 mapProps={{
                                                    value: (props) => { return props.viewValue; },
                                                    onSelectDate: (props) => { return props.onChange; }
                                                }}
                                            ></Control>
                                        </div>
                                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                            <label>Designation :</label>
                                        </div>
                                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                            <Control.select model=".Designation" id=".Designation" disabled={this.state.isDisableUser} className={styles.dropdowncustom}
                                               >
                                                <option>--Select--</option>
                                                {desigOpt}
                                            </Control.select>
                                        </div>
                                    </div>
                                    <div className={`ms-Grid-row ${styles.rowhr}`}>
                                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                            <label>Technology :</label>
                                        </div>
                                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                            <ListItemPicker listId='6fd1826b-625e-4288-8e10-df480fb0d17d'
                                                columnInternalName='Title'
                                                keyColumnInternalName='Id'
                                                itemLimit={5}
                                                disabled={this.state.isDisableUser}
                                                onSelectedItem={this.onSelectedItem}
                                                context={this.props.context}
                                                suggestionsHeaderText="Please select Technology"
                                                defaultSelectedItems={this.props.Basic.Technology ? this.props.Basic.Technology : this.state.selectedTechnologies}//{this.state.selectedTechnologies}
                                            />
                                        </div>
                                        <div className="clearfix"></div>
                                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                            <label>Company Email *:</label>
                                        </div>
                                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                            <Control.text
                                                model=".CompanyEmail"
                                                id='.CompanyEmail' className={styles.marginb} component={TextField} disabled={true}
                                                 />
                                        </div>
                                    </div>
                                    <div className={`ms-Grid-row ${styles.rowhr}`}>
                                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                            <label>Location :</label>
                                        </div>
                                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                            <Control.select model=".Location" id=".Location"
                                            disabled={this.state.isDisableUser}
                                                className={styles.dropdowncustom}
                                                >
                                                <option>--Select--</option>
                                                {this.props.Basic.locationOptions.map(location => { return <option key={location} value={location}>{location}</option>; })};
                                    </Control.select>
                                        </div>
                                        <div className="clearfix"></div>
                                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                            <label>Grade :</label>
                                        </div>
                                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                            <Control.select model=".Grade" id=".Grade"
                                                disabled={this.state.isDisableUser}
                                                className={styles.dropdowncustom} 
                                                >
                                                <option>--Select--</option>
                                                {this.props.Basic.gradeOptions.map(grade => { return <option key={grade} value={grade}>{grade}</option>; })};
                                    </Control.select>
                                        </div>
                                    </div>
                                    <div className={`ms-Grid-row ${styles.rowhr}`}>
                                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                            <label>Band :</label>
                                        </div>
                                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                            <Control.select style={{ height: "30px" }} model='.Band' id='.Band' disabled={this.state.isDisableUser} 
                                                >
                                                <option>--Select--</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </Control.select>
                                        </div>

                                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                            <label>Willing to travel for project purpose?</label>
                                        </div>
                                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg1 block">
                                            <Control.checkbox model=".WillingnessToTravelForProjectPurpose" disabled={this.state.isDisableUser} />
                                        </div>
                                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                            <label>Is Flexible with Work Hours?</label>
                                        </div>
                                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg1 block">
                                            <Control.checkbox model=".FlexibleOnWorkHoursOrTiming" disabled={this.state.isDisableUser} />
                                        </div>
                                    </div>
                                    <div className={`ms-Grid-row ${styles.rowhr}`}>
                                        {/* Manager*/}
                                        <div className='ms-Grid-col ms-u-sm12 ms-u-md2 block'>
                                            <label>Referred By:</label>
                                        </div>
                                        <div className={`ms-Grid-col ms-u-sm12 ms-u-md4 block ${styles.marginb}`}>
                                            <PeoplePicker
                                                context={this.props.context}
                                                personSelectionLimit={1}
                                                groupName={""} // Leave this blank in case you want to filter from all users
                                                showtooltip={false}
                                                disabled={this.state.isDisableUser}
                                                ensureUser={true}
                                                selectedItems={this.PeoplePickerItems}
                                                showHiddenInUI={false}
                                                principalTypes={[PrincipalType.User]}
                                                resolveDelay={1000}
                                                defaultSelectedUsers={[this.state.refferedBy] ? [this.state.refferedBy] : null}
                                            />

                                        </div>
                                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                            <label>Referral Source :</label>
                                        </div>
                                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                            <Control.select model=".RefferalSource" id=".RefferalSource"
                                                className={styles.dropdowncustom} disabled={this.state.isDisableUser}
                                               >
                                                <option>--Select--</option>
                                                {this.props.Basic.refferalSourceOptions.map(refSource => { return <option key={refSource} value={refSource}>{refSource}</option>; })};
                                    </Control.select>

                                    
                                           
                                        </div></div>
                                    <div className={`ms-Grid-row ${styles.rowhr}`}>
                                        <div className='ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg2 block'>
                                            <label>Department :</label>
                                        </div>
                                        <div className="ms-Grid-col ms-u-sm12 ms-u-md6 ms-u-lg4 block">
                                            <Control.select model=".Department" id=".Department"
                                                className={styles.dropdowncustom} disabled={this.state.isDisableUser}
                                            >
                                                <option>--Select--</option>
                                                {this.props.Basic.departmentOption.map(dep => { return <option key={dep} value={dep}>{dep}</option>; })};
                                    </Control.select></div></div>

                                    <DefaultButton id="DefaultSubmit" primary={true} text={"Save"} type="submit"
                                        className={styles.submitbutton} disabled={this.state.isDisableUser}/>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>);
        
    }
    private onSelectedItem = (data: { key: string; name: string }[]): void => {
        this.setState({ selectedTechnologies: data, display: "none" });

    }
    private PeoplePickerItems(items: any[]) {
        let array = [];
        array.push({ 'Email': items[0].secondaryText });
        this.setState({ refferedBy: array[0].Email });

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
