import * as React from "react";
import { Form, Control, Errors } from "react-redux-form";
import { ICommonState, IEmpListIdState } from "../../state/ICommonState";
import { connect } from "react-redux";
import {
    SetTabName,
    GetInitialControlValuesAction,
    addProfessionalDetailRow,
    removeProfessionalDetailRow
} from "../../actions/ProfessionalDetailFormControlsValuesAction";
import { IProfessionalDetailState } from "../../state/IProfessionalDetailControlState";
import { store } from "../../store/ConfigureStore";
import NewEmpService from '../../services/NewEmployeeService';
import styles from "../EmployeeForm.module.scss";
import { TextField, DefaultButton } from "office-ui-fabric-react/lib";

interface buttonStatus {
    buttonDisabled: boolean;
    isDisableUser:boolean;

}
interface IProfessionalDetailConnectedDispatch {
    setTabName: (tabName: ICommonState) => void;
    getDefaultControlsData: (empListId: IEmpListIdState) => void; // Gets the options for dropdown fields
    //616
    addProfessionalDetailRow: (section) => void;  //adds empty array to state
    removeProfessionalDetailRow: (removedItem, section, index) => void; //removes selected array from state
}

class ProfessionalDetail extends React.Component<any, buttonStatus> {
    constructor(props) {
        super(props);
        this.state = { buttonDisabled: false,
            isDisableUser:false,
        };
    }
    public componentDidMount() {
        const empListId = store.getState().EmpListId;
        this.props.getDefaultControlsData(empListId);
            this.setState({isDisableUser:this.props.isDisabledToUser})
            if(this.props.isDisabledToUser==true){
                this.setState({buttonDisabled:true});
            }
    }

    //adds row in grids
    public handleRowAdd(section) {
        this.props.addProfessionalDetailRow(section);
    }

    //removes row from grid
    public handleRowRemove(section, index) {
        // this.props.ProfessionalDetail[section][index]
        var confirmDelete = confirm("Are you sure you want to delete this item?")
        if (confirmDelete) {
            let removedItem = this.props.ProfessionalDetail[section][index];
            this.props.removeProfessionalDetailRow(removedItem, section, index);
        }
        else { }
    }
    public isGreters(val, index) {
        var StartYear = val.split('-');
         var year = parseInt(StartYear[1]);
        var EndYear =this.props.ProfessionalDetail.organizationDetails[index].endDate.split('-');
        var splitEndYear= parseInt(EndYear[1]);
        if (!isNaN(year) && !isNaN(splitEndYear)) {
          if (splitEndYear == 0) { return true; }
          else {
            var validation = (year < splitEndYear) ? true : false;
            return validation;
          }
        } else { return true; }
      }
      public isLessYear(val, index) {
        var EndYear = val.split('-');
         var year = parseInt(EndYear[1]);
        var StartYear = this.props.ProfessionalDetail.organizationDetails[index].startDate.split('-');
        var splitStartYear= parseInt(StartYear[1]);
        if (!isNaN(year) && !isNaN(splitStartYear)) {
          if (splitStartYear == 0) { return true; }
          else {
            var validation = (year > splitStartYear) ? true : false;
            return validation;
          }
        }
        else { return true; }
      }

    public async handleSubmit(formValues) {
        let pdData = {} as IProfessionalDetailState;
        pdData = formValues;
        if(pdData.IsFresher==true){
            if (pdData.technologyDetails.length == 0) { 
                alert("Please enter required data");
               // this.handleRowAdd("ProfessionalDetail")
                this.handleRowAdd("Technology");
            }
            else {
                this.props.handleSpinner(false);
                const CommonState: ICommonState = { CurrentForm: "Professional Details" };
                this.props.setTabName(CommonState);
                const empListId = store.getState().EmpListId;
                this.setState({ buttonDisabled: true });
                let newEmpServiceObj: NewEmpService = new NewEmpService();
                await newEmpServiceObj.saveProfessionalDetailInList(pdData, empListId,this.state.isDisableUser);
                this.setState({ buttonDisabled: false });
                this.props.handleSpinner(true);
                this.props.handleTabClick();
                (this.state.isDisableUser)?alert("Technology updated succesfully"): alert("Professional details updated successfully")
            }
        }
        else if(pdData.IsFresher==false){if (pdData.organizationDetails.length == 0 || pdData.technologyDetails.length == 0) { 
            alert("Please enter required data");
           // this.handleRowAdd("ProfessionalDetail")
            this.handleRowAdd("Technology");
        }
        else {
            this.props.handleSpinner(false);
            const CommonState: ICommonState = { CurrentForm: "Professional Details" };
            this.props.setTabName(CommonState);
            const empListId = store.getState().EmpListId;
            this.setState({ buttonDisabled: true });
            let newEmpServiceObj: NewEmpService = new NewEmpService();
            await newEmpServiceObj.saveProfessionalDetailInList(pdData, empListId, this.state.isDisableUser);
            this.setState({ buttonDisabled: false });
            this.props.handleSpinner(true);
            this.props.handleTabClick();
            (this.state.isDisableUser)?alert("Technology updated succesfully"): alert("Professional details updated successfully")
        }

    }
   
        //else if(pdData.technologyDetails.length == 0){
        //    alert("Please enter required data");
        //    this.handleRowAdd("Technology");
       // }
       
    }

    public render() {
        if (!this.props.ProfessionalDetail) return (<div> Loading.... </div>);
        if(this.state.isDisableUser==false){
        return (
            <div className={styles.employeeForm}>
                <div className={styles.container}>
                    <Form model="ProfessionalDetail" onSubmit={val => this.handleSubmit(val)}>
                        <div className='col'> {/* Eligible for rehire*/}
                            <label style={{ paddingLeft: "15px" }}>Fresher:</label>
                            <Control.checkbox model='ProfessionalDetail.IsFresher' disabled={this.state.isDisableUser} id='ProfessionalDetail.IsFresher' />
                        </div>
                        {this.isUserFresher(this.props.ProfessionalDetail)}
                        <div className={`ms-Grid-row ${styles.row}`}>{/* ms-fontColor-white  */}
                            <span className={styles.errors}> *Please mention mininum 1 Technology / Tools in below section</span>
                            <div className={styles.childdetailsec}>
                            <div className="table-responsive">
                                <table className="grid-visa" style={{ width: "100%" }}>
                                    <tr>
                                        <th colSpan={8} style={{ textAlign: "left" }}><span> Technology / Tools Skills <button className={styles.addbtn}  type="button"  onClick={() => this.handleRowAdd("Technology")}>+</button></span></th>

                                    </tr>
                                    {this.props.ProfessionalDetail.technologyDetails.map((technologies, i) => {
                                        return (
                                            <tr key={i}>
                                                <td> {/* Technology */}
                                                    <label>Technology *</label>
                                                    <Control.select model={`ProfessionalDetail.technologyDetails[${i}].Technology`} id={technologies.Technology} 
                                                        validators={{ requiredtechnology: (val) => val && val != "--Select--" }} style={{ height: "30px", width: "100%" }}>
                                                        <option value="0">--Select--</option>
                                                        {this.props.ProfessionalDetail.technologyDetails[i].technologyOptions.map(technology => {
                                                            return <option key={technology} value={technology}>{technology}</option>;
                                                        })}
                                                    </Control.select>
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.technologyDetails[${i}].Technology`}
                                                        messages={{
                                                            requiredtechnology: 'Technology is Required.'
                                                        }} />
                                                </td>
                                                <td> {/* SinceWhen */}
                                                    <label>Since When *</label>
                                                    <Control.select model={`ProfessionalDetail.technologyDetails[${i}].SinceWhen`} id={technologies.SinceWhen}  
                                                        validators={{ requiredSincewhen: (val) => val && val != "--Select--" }} style={{ height: "30px", width: "100%" }}>
                                                        <option value="0">--Select--</option>
                                                        <option value="Currently using">Currently using</option>
                                                        <option value="< 3 months">&lt; 3 months</option>
                                                        <option value="3-6 months">3-6 months</option>
                                                        <option value="6 months - 1 year">6 months - 1 year</option>
                                                        <option value="1 - 2 years">1 - 2 years</option>
                                                        <option value="> 2 years">&gt; 2 years</option>
                                                    </Control.select>
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.technologyDetails[${i}].SinceWhen`}
                                                        messages={{
                                                            requiredSincewhen: 'Since When is Required.'
                                                        }} />
                                                </td>
                                                <td> {/* Expertise */}
                                                    <label>Expertise *</label>
                                                    <Control.select model={`ProfessionalDetail.technologyDetails[${i}].Expertise`} id={technologies.Expertise}
                                                         validators={{ requiredExpertise: (val) => val && val != "--Select--" }} style={{ height: "30px", width: "100%" }}>
                                                        <option value="0">--Select--</option>
                                                        <option value="Beginner">Beginner</option>
                                                        <option value="Expert">Expert</option>
                                                        <option value="Intermediate">Intermediate</option>
                                                      
                                                    </Control.select>
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.technologyDetails[${i}].Expertise`}
                                                        messages={{
                                                            requiredExpertise: 'Expertise is Required.'
                                                        }} />
                                                </td>
                                                <td> {/* Rating */}
                                                    <label>Rating *</label>
                                                    <Control.select model={`ProfessionalDetail.technologyDetails[${i}].Rating`} id={technologies.Rating}
                                                       validators={{ requiredRating: (val) => val && val != "0" }} style={{ height: "30px", width: "100%" }}>
                                                        <option value="0">0</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                        <option value="6">6</option>
                                                        <option value="7">7</option>
                                                        <option value="8">8</option>
                                                        <option value="9">9</option>
                                                        <option value="10">10</option>
                                                    </Control.select>
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.technologyDetails[${i}].Rating`}
                                                        messages={{
                                                            requiredRating: 'Rating is Required.'
                                                        }}
                                                    />
                                                </td>
                                                <td> {/* Action */}
                                                    <button className={styles.removebtn} type="button" disabled={this.state.isDisableUser} onClick={() => this.handleRowRemove("technologyDetails", i)} style={{ marginTop: "20px" }}>-</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </table>
                            </div></div>
                            <DefaultButton id="DefaultSubmit" primary={true} text={"Submit"} type="submit"
                         disabled={this.state.buttonDisabled} className={styles.submitbutton} />
                        </div>
                      
                    </Form>
                </div>
            </div >
            );
        }
        else{
            
        return (
            <div className={styles.employeeForm}>
                <div className={styles.container}>
                    <Form model="ProfessionalDetail" onSubmit={val => this.handleSubmit(val)}>
                        <div className='col'> {/* Eligible for rehire*/}
                            <label style={{ paddingLeft: "15px" }}>Fresher:</label>
                            <Control.checkbox model='ProfessionalDetail.IsFresher' disabled={this.state.isDisableUser} id='ProfessionalDetail.IsFresher' />
                        </div>
                        {this.isUserFresher(this.props.ProfessionalDetail)}
                        <div className={`ms-Grid-row ${styles.row}`}>{/* ms-fontColor-white  */}
                            <span className={styles.errors}> *Please mention mininum 1 Technology / Tools in below section</span>
                            <div className={styles.childdetailsec}>
                            <div className="table-responsive">
                                <table className="grid-visa" style={{ width: "100%" }}>
                                    <tr>
                                        <th colSpan={8} style={{ textAlign: "left" }}><span> Technology / Tools Skills <button className={styles.addbtn}  type="button"  onClick={() => this.handleRowAdd("Technology")}>+</button></span></th>

                                    </tr>
                                    {this.props.ProfessionalDetail.technologyDetails.map((technologies, i) => {
                                        return (
                                            <tr key={i}>
                                                <td> {/* Technology */}
                                                    <label>Technology *</label>
                                                    <Control.select model={`ProfessionalDetail.technologyDetails[${i}].Technology`} id={technologies.Technology}  
                                                        validators={{ requiredtechnology: (val) => val && val != "--Select--" }} style={{ height: "30px", width: "100%" }}>
                                                        <option value="0">--Select--</option>
                                                        {this.props.ProfessionalDetail.technologyDetails[i].technologyOptions.map(technology => {
                                                            return <option key={technology} value={technology}>{technology}</option>;
                                                        })}
                                                    </Control.select>
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.technologyDetails[${i}].Technology`}
                                                        messages={{
                                                            requiredtechnology: 'Technology is Required.'
                                                        }} />
                                                </td>
                                                <td> {/* SinceWhen */}
                                                    <label>Since When *</label>
                                                    <Control.select model={`ProfessionalDetail.technologyDetails[${i}].SinceWhen`} id={technologies.SinceWhen}  
                                                        validators={{ requiredSincewhen: (val) => val && val != "--Select--" }} style={{ height: "30px", width: "100%" }}>
                                                        <option value="0">--Select--</option>
                                                        <option value="Currently using">Currently using</option>
                                                        <option value="< 3 months">&lt; 3 months</option>
                                                        <option value="3-6 months">3-6 months</option>
                                                        <option value="6 months - 1 year">6 months - 1 year</option>
                                                        <option value="1 - 2 years">1 - 2 years</option>
                                                        <option value="> 2 years">&gt; 2 years</option>
                                                    </Control.select>
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.technologyDetails[${i}].SinceWhen`}
                                                        messages={{
                                                            requiredSincewhen: 'Since When is Required.'
                                                        }} />
                                                </td>
                                                <td> {/* Expertise */}
                                                    <label>Expertise *</label>
                                                    <Control.select model={`ProfessionalDetail.technologyDetails[${i}].Expertise`} id={technologies.Expertise}
                                                         validators={{ requiredExpertise: (val) => val && val != "--Select--" }} style={{ height: "30px", width: "100%" }}>
                                                        <option value="0">--Select--</option>
                                                        <option value="Beginner">Beginner</option>
                                                        <option value="Expert">Expert</option>
                                                        <option value="Intermediate">Intermediate</option>
                                                      
                                                    </Control.select>
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.technologyDetails[${i}].Expertise`}
                                                        messages={{
                                                            requiredExpertise: 'Expertise is Required.'
                                                        }} />
                                                </td>
                                                <td> {/* Rating */}
                                                    <label>Rating *</label>
                                                    <Control.select model={`ProfessionalDetail.technologyDetails[${i}].Rating`} id={technologies.Rating}
                                                       validators={{ requiredRating: (val) => val && val != "0" }} style={{ height: "30px", width: "100%" }}>
                                                        <option value="0">0</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                        <option value="6">6</option>
                                                        <option value="7">7</option>
                                                        <option value="8">8</option>
                                                        <option value="9">9</option>
                                                        <option value="10">10</option>
                                                    </Control.select>
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.technologyDetails[${i}].Rating`}
                                                        messages={{
                                                            requiredRating: 'Rating is Required.'
                                                        }}
                                                    />
                                                </td>
                                                <td> {/* Action */}
                                                    <button className={styles.removebtn} type="button" disabled={this.state.isDisableUser} onClick={() => this.handleRowRemove("technologyDetails", i)} style={{ marginTop: "20px" }}>-</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </table>
                            </div></div>
                            <DefaultButton id="DefaultSubmit" primary={true} text={"Update"} type="submit"
                                 className={styles.submitbutton} />
                        </div>
                      
                    </Form>
                </div>
            </div >
        );
        }
    }

   
    public isUserFresher(props) {
        //If user is come from another orgenization
        if (props.IsFresher == false) {
            return (
                <div className={`ms-Grid-row ${styles.row}`}>{/* ms-fontColor-white  */}
                    <span className={styles.errors}> *Please mention professional details from latest organization</span>
                    <div className={styles.childdetailsec}>
                    <div className="table-responsive">
                            <table className="grid-visa">
                                <tr>
                                    <th colSpan={8} style={{ textAlign: "left" }}><span>Organization details  <button className={styles.addbtn} type="button" disabled={this.state.isDisableUser} onClick={() => this.handleRowAdd("ProfessionalDetail")}>+</button></span></th>

                                </tr>
                                {
                                    this.props.ProfessionalDetail.organizationDetails.map((organizations, i) => {
                                        return (
                                            <tr>
                                                <td style={{ width: "200px" }}> {/* Organization */}
                                                    <label className={styles.orgdetailslabel}>Organization*</label>
                                                    <Control.text model={`ProfessionalDetail.organizationDetails[${i}].organization`} id={organizations.organization}
                                                       disabled={this.state.isDisableUser} validators={{ requiredorganization: (val) => val && val.length && !(Number(val)) }} component={TextField} />
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.organizationDetails[${i}].organization`}
                                                        messages={{
                                                            requiredorganization: 'Organization Name is Required.'
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ width: "200px" }}> {/* Designation/Role */}
                                                    <label className={styles.orgdetailslabel}>Designation /Role*</label>
                                                    <Control.text model={`ProfessionalDetail.organizationDetails[${i}].designation`} id={organizations.designation}
                                                       disabled={this.state.isDisableUser} validators={{ requireddesignation: (val) => val && val.length && !(Number(val)) }} component={TextField} />
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.organizationDetails[${i}].designation`}
                                                        messages={{
                                                            requireddesignation: 'Designation is Required.'
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ width: "200px" }}> {/* Start Month */}
                                                    <label className={styles.orgdetailslabel}>Start Month*</label>
                                                    <Control.text model={`ProfessionalDetail.organizationDetails[${i}].startDate`} id={organizations.startDate} placeholder="MMM-YYYY"
                                                     disabled={this.state.isDisableUser}   validators={{
                                                            requiredstartDate: (val) => val && val.length,
                                                            isStartMonth: (val) => (/^[a-zA-Z\s]{3}-[0-9\s]{4}$/i.test(val) || val.length==0),
                                                            isGreters: (val) => ((this.isGreters(val, i)) || val.length == 0)
                                                        }} component={TextField} />
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.organizationDetails[${i}].startDate`}
                                                        messages={{
                                                            requiredstartDate: 'Start Month is Required.',
                                                            isStartMonth: 'Must be MMM-yyyy',
                                                            isGreters: "Start Year can not be greater than end year ",
                                                            
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ width: "200px" }}> {/* End  Month */}
                                                    <label className={styles.orgdetailslabel}>End Month*</label>
                                                    <Control.text model={`ProfessionalDetail.organizationDetails[${i}].endDate`} id={organizations.endDate} placeholder="MMM-YYYY"
                                                     disabled={this.state.isDisableUser}    validators={{
                                                            requiredendDate: (val) => val && val.length,
                                                            isEndMonth: (val) => (/^[a-zA-Z\s]{3}-[0-9\s]{4}$/i.test(val)|| val.length==0),
                                                            isLess: (val) => ((this.isLessYear(val, i)) || val.length == 0)
                                                        }} component={TextField} />
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.organizationDetails[${i}].endDate`}
                                                        messages={{
                                                            requiredendDate: 'End Month is Required.',
                                                            isEndMonth: 'Must be MMM-yyyy',
                                                            isLess: "End Year can not be less than start year ",
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ width: "200px" }}> {/* Reporting To */}
                                                    <label className={styles.orgdetailslabel}>Reporting To*</label>
                                                    <Control.text model={`ProfessionalDetail.organizationDetails[${i}].reportingTo`} id={organizations.reportingTo}
                                                      disabled={this.state.isDisableUser}  validators={{ requiredreportingTo: (val) => val && val.length && !(Number(val)) }} component={TextField} />
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.organizationDetails[${i}].reportingTo`}
                                                        messages={{
                                                            requiredreportingTo: 'Reporting To is Required.'
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ width: "200px" }}> {/* Reporting Designation */}
                                                    <label className={styles.orgdetailslabel}>Reporting Designation*</label>
                                                    <Control.text model={`ProfessionalDetail.organizationDetails[${i}].reportingDesignation`} id={organizations.reportingDesignation}
                                                      disabled={this.state.isDisableUser}  validators={{ requiredreportingDesignation: (val) => val && val.length && !(Number(val)) }} component={TextField} />
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.organizationDetails[${i}].reportingDesignation`}
                                                        messages={{
                                                            requiredreportingDesignation: 'Reporting Designation is Required.'
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ width: "200px" }}> {/* Total Exp.(Month) */}
                                                    <label className={styles.orgdetailslabel}>Total Exp.(Month)*</label>
                                                    <Control.text model={`ProfessionalDetail.organizationDetails[${i}].totalExp`} id={organizations.totalExp}
                                                      disabled={this.state.isDisableUser}  validators={{
                                                            requiredtotalExp: (val) => Number(val) && val.length
                                                        }} component={TextField} />
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.organizationDetails[${i}].totalExp`}
                                                        messages={{
                                                            requiredtotalExp: 'Total Exp in Month(Number) is Required.'
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ width: "200px" }}> {/* Reason For Leaving */}
                                                    <label className={styles.orgdetailslabel}>Reason For Leaving*</label>
                                                    <Control.select model={`ProfessionalDetail.organizationDetails[${i}].reasonForLeaving`} id={organizations.reasonForLeaving}
                                                    disabled={this.state.isDisableUser}    validators={{ requiredreasonForLeaving: (val) => val && val != "--Select--" }} style={{ height: "30px", width: "100%" }}>
                                                        <option value="0">--Select--</option>

                                                        {this.props.ProfessionalDetail.organizationDetails[i].reasonOfLeavingOptions.map(reasons => {
                                                            return <option key={reasons} value={reasons}>{reasons}</option>;
                                                        })};
                                            </Control.select>
                                                    <Errors
                                                        className={styles.errors}
                                                        show="touched"
                                                        model={`ProfessionalDetail.organizationDetails[${i}].reasonForLeaving`}
                                                        messages={{
                                                            requiredreasonForLeaving: 'Reason For Leaving is Required.'
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ width: "25px" }}> {/* Action */}
                                                    <button className={styles.removebtn} type="button" disabled={this.state.isDisableUser} onClick={() => this.handleRowRemove("organizationDetails", i)}   style={{ marginTop: "52px" }}>-</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </table>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
const mapStateToProps = (state) => {
    return state;
};
const mapDispatchToProps = (dispatch): IProfessionalDetailConnectedDispatch => {
    return {
        setTabName: SetTabName,
        getDefaultControlsData: (empListId) => {
            return dispatch(GetInitialControlValuesAction(empListId.EmpListID));
        },
        addProfessionalDetailRow: (section) => {
            return dispatch(addProfessionalDetailRow(section));
        },
        removeProfessionalDetailRow: (removedItem, section, index) => {
            return dispatch(removeProfessionalDetailRow(removedItem, section, index));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfessionalDetail);