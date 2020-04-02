import * as React from "react";
import { Form, Control, Errors } from "react-redux-form";
import { ICommonState, IEmpListIdState } from "../../state/ICommonState";
import styles from '../EmployeeForm.module.scss';
import {
  SetTabName,
  GetInitialControlValuesAction,
  addEducationDetailRow,
  removeEducationDetailRow,
} from "../../actions/EducationDetailAction";
import { connect } from "react-redux";
import { IEducationDetailState } from "../../state/IEducationDetailState";
import { store } from "../../store/ConfigureStore";
import NewEmpService from '../../services/NewEmployeeService';
import { TextField, DefaultButton } from "office-ui-fabric-react/lib";

interface buttonStatus {
  buttonDisabled: boolean;
  isDisableUser:boolean;
 
}
interface IEducationDetailConnectedDispatch {
  setTabName: (tabName: ICommonState) => void;

  // Gets the options for dropdown fields
  getDefaultControlsData: (empListId: IEmpListIdState) => void;

  //adds empty array to state
  addEducationDetailRow: (section) => void;

  //removes selected array from state
  removeEducationDetailRow: (removedItem, section, index) => void;
}
const isNumber = (val) => !isNaN(Number(val));
const maxLength = (len) => (val) => val.length <= len;

class EducationDetail extends React.Component<any, buttonStatus> {
  constructor(props) {
    super(props);
    this.state = { 
      buttonDisabled: false,
         isDisableUser:false,
    };
  }
  public async componentDidMount() {
    const empListId = store.getState().EmpListId;
    await this.props.getDefaultControlsData(empListId);
    this.setState({isDisableUser:this.props.isAssignedToHR})
    
    if(this.props.isUserHR==false && this.props.isAssignedToHR==true){
      this.setState({buttonDisabled:true});
    }
  }
  //adds row in grids
  public handleRowAdd(section) {
    this.props.addEducationDetailRow(section);
  }

  //removes row from grid
  public handleRowRemove(section, index) {
    var confirmDelete = confirm("Are you sure you want to delete this item?")
    if (confirmDelete) {
      let removedItem = this.props.Education[section][index];
      this.props.removeEducationDetailRow(removedItem, section, index);
    }
    else { }
  }

  public async handleSubmit(formValues) {


    let eduData = {} as IEducationDetailState;
    eduData = formValues;
    if (eduData.certificationDetails.length == 0 && eduData.educationDetails.length == 0) {
      alert("Please add Education Details");
      this.handleRowAdd("educationDetails");
    }
    else {
      this.props.handleSpinner(false);
      const CommonState: ICommonState = { CurrentForm: "Education" };
      this.props.setTabName(CommonState);
      const empListId = store.getState().EmpListId;
      this.setState({ buttonDisabled: false });
      let newEmpServiceObj: NewEmpService = new NewEmpService();
      await newEmpServiceObj.saveEduDataInList(eduData, empListId);
      alert("Education Details saved succesfully");
      this.setState({ buttonDisabled: true });
      this.props.handleSpinner(true);
      this.props.handleTabClick();
    }
  }
  public isGreter(val, index) {
    var StartYear = parseInt(val);
    var EndYear = parseInt(this.props.Education.educationDetails[index].EndYear);
    if (!isNaN(StartYear) && !isNaN(EndYear)) {
      if (EndYear == 0) { return true; }
      else {
        var validation = (StartYear < EndYear) ? true : false;
        return validation;
      }
    } else { return true; }
  }

  public isLess(val, index) {
    var EndYear = parseInt(val);
    var StartYear = parseInt(this.props.Education.educationDetails[index].StartYear);

    if (!isNaN(StartYear) && !isNaN(EndYear)) {
      if (StartYear == 0) { return true; }
      else {
        var validation = (EndYear > StartYear) ? true : false;
        return validation;
      }
    }
    else { return true; }
  }

  public isGreters(val, index) {
    var StartYear = parseInt(val);
    var EndYear = parseInt(this.props.Education.certificationDetails[index].YearOfCompletion);
    if (!isNaN(StartYear) && !isNaN(EndYear)) {
      if (EndYear == 0) { return true; }
      else {
        var validation = (StartYear < EndYear) ? true : false;
        return validation;
      }
    } else { return true; }
  }
  public isLessYear(val, index) {
    var EndYear = parseInt(val);
    var StartYear = parseInt(this.props.Education.certificationDetails[index].StartYear);
    if (!isNaN(StartYear) && !isNaN(EndYear)) {
      if (StartYear == 0) { return true; }
      else {
        var validation = (EndYear > StartYear) ? true : false;
        return validation;
      }
    }
    else { return true; }
  }

  public render() {
    return (
      <div>
        <Form model="Education" onSubmit={val => this.handleSubmit(val)}>
          <div className={styles.employeeForm}>
            <div className={styles.container}>
              <div className={`ms-Grid-row ${styles.row}`}>   {/* ms-fontColor-white  */}
                <div className={styles.childdetailsec}>
                  <span className={styles.errors}> *Please mention education details from latest qualification upto 10th Education details</span>
                  <div className="table-responsive">
                  <table className="grid-visa" style={{ width: "100%" }}>
                    <tr>
                      <th colSpan={8} style={{ textAlign: "left" }}> <span>Education details <button className={styles.addbtn} disabled={this.state.isDisableUser} type="button" onClick={() => this.handleRowAdd("educationDetails")}>+</button></span></th>
                    </tr>
                    {
                      this.props.Education.educationDetails.map((education, i) => {
                        return (
                          <tr>
                            <td><label>Diploma/Degree *</label>
                              <Control.select style={{ height: "30px" }} model={`Education.educationDetails[${i}].DiplomaDegree`} id={`Education.educationDetails[${i}].DiplomaDegree`} 
                              disabled={this.state.isDisableUser}
                                validators={{ requiredQualification: (val) => val && val != "--Select--" }}>
                                <option>--Select--</option>
                                <option value="Graduation">Graduation</option>
                                <option value="Diploma">Diploma</option>
                                <option value="12th Education">12th Education</option>
                                <option value="10th Education">10th Education</option></Control.select>
                              <Errors
                                className={styles.errors}
                                show="touched"
                                model={`Education.educationDetails[${i}].DiplomaDegree`}
                                messages={{
                                  requiredQualification: 'Diploma/Degree is Required.'
                                }}
                              ></Errors></td>
                            <td><label>Grade *</label>
                              <Control.text model={`Education.educationDetails[${i}].Grade`} id={`Education.educationDetails[${i}].Grade`}
                                component={TextField} disabled={this.state.isDisableUser}
                                validators={{
                                  requiredGrade: (val) => val && val.length,
                                  maxLength: maxLength(255)
                                }}
                              ></Control.text>
                              <Errors
                                className={styles.errors}
                                show="touched"
                                model={`Education.educationDetails[${i}].Grade`}
                                messages={{
                                  requiredGrade: 'Grade is Required.',
                                  maxLength: "Max Charachters allowed 255"
                                }}
                              ></Errors></td>
                            <td><label>Start Year *</label>
                              <Control.text model={`Education.educationDetails[${i}].StartYear`}
                                id={`Education.educationDetails[${i}].StartYear`}
                                placeholder="YYYY"
                                component={TextField} disabled={this.state.isDisableUser}
                                validators={{
                                  requiredStartYearEdu: (val) => val,
                                  isLength:(val)=>(val.length==4 || val.length==0),
                                  notFutureYear: (val) => ((val && (new Date().getFullYear() >= val) && val.length < 5) || val.length == 0),
                                  isNumber,
                                  isGreter: (val) => ((this.isGreter(val, i)) || val.length == 0)
                                }}
                              ></Control.text>
                              <Errors
                                className={styles.errors} 
                                show="touched"
                                model={`Education.educationDetails[${i}].StartYear`}
                                messages={{
                                  requiredStartYearEdu: 'Start Year is Required.',
                                  isNumber: "Enter a valid Year",
                                  notFutureYear: "Year can not be future year",
                                  isGreter: "Start Year can not be greater than end year ",
                                  isLength:"Enter a valid Year"
                                }}
                              ></Errors></td>
                            <td><label>End Year *</label>
                              <Control.text model={`Education.educationDetails[${i}].EndYear`} id={`Education.educationDetails[${i}].EndYear`} placeholder="YYYY"
                                component={TextField} disabled={this.state.isDisableUser}
                                validators={{
                                  requiredEndYear: (val) => val,
                                  isNumber,
                                  isLength:(val)=>(val.length==4 || val.length==0),
                                  requiredDateEnd: (val) => ((val && (new Date().getFullYear() >= val) && val.length < 5) || val.length == 0),
                                  isLess: (val) => ((this.isLess(val, i)) || val.length == 0)
                                }}
                              ></Control.text>
                              <Errors
                                className={styles.errors}
                                show="touched"
                                model={`Education.educationDetails[${i}].EndYear`}
                                messages={{
                                  requiredEndYear: 'End Year is Required.',
                                  isNumber: "Enter a valid Year",
                                  requiredDateEnd: "Year can not be future year",
                                  isLess: "End Year can not be less than start year ",
                                  isLength:"Enter a valid Year"
                                }}
                              ></Errors></td>
                            <td><label>Board *</label>
                              <Control.text model={`Education.educationDetails[${i}].Board`} id={`Education.educationDetails[${i}].Board`}
                                component={TextField} disabled={this.state.isDisableUser}
                                validators={{
                                  requiredEducationBoard: (val) => val && val.length,
                                  maxLength: maxLength(255)
                                }}
                              ></Control.text>
                              <Errors
                                className={styles.errors}
                                show="touched"
                                model={`Education.educationDetails[${i}].Board`}
                                messages={{
                                  requiredEducationBoard: 'Board Name is Required.',
                                  maxLength: "Max Charachters allowed 255"
                                }}
                              ></Errors></td>
                            <td><label>School/College *</label>
                              <Control.text model={`Education.educationDetails[${i}].SchoolCollege`} id={`Education.educationDetails[${i}].SchoolCollege`}
                                component={TextField} disabled={this.state.isDisableUser}
                                validators={{
                                  requiredSchoolCollege: (val) => val && val.length,
                                  maxLength: maxLength(255)
                                }}
                              ></Control.text>
                              <Errors
                                className={styles.errors}
                                show="touched"
                                model={`Education.educationDetails[${i}].SchoolCollege`}
                                messages={{
                                  requiredSchoolCollege: 'School/College Name is Required.',
                                  maxLength: "Max Charachters allowed 255"
                                }}
                              ></Errors></td>
                            <td><label>Degree Name *</label>
                              <Control.text model={`Education.educationDetails[${i}].DegreeName`} id={`Education.educationDetails[${i}].DegreeName`}
                                component={TextField} disabled={this.state.isDisableUser}
                                validators={{
                                  requiredDegreeName: (val) => val && val.length,
                                  maxLength: maxLength(255)
                                }}
                              ></Control.text>
                              <Errors
                                className={styles.errors}
                                show="touched"
                                model={`Education.educationDetails[${i}].DegreeName`}
                                messages={{
                                  requiredDegreeName: 'Degree Name is Required.',
                                  maxLength: "Max Charachters allowed 255"
                                }}
                              ></Errors></td>
                            <td>
                              <button className={styles.removebtn} disabled={this.state.isDisableUser} type="button" style={{ marginTop: "20px" }} onClick={() => this.handleRowRemove("educationDetails", i)}>-</button></td>
                          </tr>);
                      })}
                  </table>
                </div>
                </div>
                <div className={styles.childdetailsec}>
                <div className="table-responsive">
                  <table style={{ width: "100%" }}>
                    <tr>
                      <th colSpan={6} style={{ textAlign: "left" }}><span>Certification details <button type="button" disabled={this.state.isDisableUser} onClick={() => this.handleRowAdd("certificationDetails")} className={styles.addbtn}>+</button></span></th>
                    </tr>
                    {this.props.Education.certificationDetails.map((certification, i) => {
                      return (
                        <tr>
                          <td><label>Certification *</label>
                            <Control.text model={`Education.certificationDetails[${i}].Certification`} id={`Education.certificationDetails[${i}].Certification`}
                              component={TextField}
                              validators={{
                                requiredCertification: (val) => val && val.length,
                                maxLength: maxLength(255)
                              }}></Control.text>
                            <Errors
                              className={styles.errors}
                              show="touched"
                              model={`Education.certificationDetails[${i}].Certification`}
                              messages={{
                                requiredCertification: 'Certification is Required.',
                                maxLength: "Max Charachters allowed 255"
                              }}
                            ></Errors>
                          </td>
                          <td><label>Start Year *</label>
                            <Control.text model={`Education.certificationDetails[${i}].StartYear`} id={`Education.certificationDetails[${i}].StartYear`} placeholder="YYYY"
                              component={TextField}
                              validators={{
                                requiredStartYear: (val) => val ,
                                isNumber,
                                isLength:(val)=>(val.length==4 || val.length==0),
                                notFutureYear: (val) => ((val && (new Date().getFullYear() >= val) && val.length < 5) || val.length == 0),
                                isGretes: (val) => ((this.isGreters(val, i)) || val.length == 0)
                              }}></Control.text>
                            <Errors
                              className={styles.errors}
                              show="touched"
                              model={`Education.certificationDetails[${i}].StartYear`}
                              messages={{
                                requiredStartYear: 'Start Year is Required.',
                                isNumber: "Enter a valid Year",
                                notFutureYear: "Year can not be future year",
                                  isLength:"Enter a valid Year",
                                  isGretes:"Start Year can not be greater than end year"
                              }}
                            ></Errors>
                          </td>
                          <td><label>Year Of Completion *</label>
                            <Control.text model={`Education.certificationDetails[${i}].YearOfCompletion`} id={`Education.certificationDetails[${i}].YearOfCompletion`} placeholder="YYYY"
                              component={TextField}
                              validators={{
                                requiredYearofCompletion: (val) => val ,
                                isNumber,
                                maxLength: maxLength(4),
                                isLength:(val)=>(val.length==4 || val.length==0),
                                isLessYear: (val) => ((this.isLessYear(val, i)) || val.length == 0),
                                notFutureYear: (val) => ((val && (new Date().getFullYear() >= val) && val.length < 5) || val.length == 0),
                              }}></Control.text>
                            <Errors
                              className={styles.errors}
                              show="touched"
                              model={`Education.certificationDetails[${i}].YearOfCompletion`}
                              messages={{
                                requiredYearofCompletion: 'Year Of Completion is Required.',
                                isNumber: "Enter a valid Year",
                                notFutureYear: "Year can not be future year",
                                isLength:"Enter a valid Year",
                                isLessYear: "Year Of Completion can not be less than start year ",
                              }}
                            ></Errors>
                          </td>
                          <td><label>Institute Name *</label>
                            <Control.text model={`Education.certificationDetails[${i}].InstituteName`} id={`Education.certificationDetails[${i}].InstituteName`}
                              component={TextField}
                              validators={{
                                requiredInstituteName: (val) => val && val.length,
                                maxLength: maxLength(255)
                              }}></Control.text>
                            <Errors
                              className={styles.errors}
                              show="touched"
                              model={`Education.certificationDetails[${i}].InstituteName`}
                              messages={{
                                requiredInstituteName: 'Institute Name is Required.',
                                maxLength: "Max Charachters allowed 255"
                              }}
                            ></Errors>
                          </td>
                          <td><label>Grade/Percentage *</label>
                            <Control.text model={`Education.certificationDetails[${i}].GradePercentage`} id={`Education.certificationDetails[${i}].GradePercentage`}
                              component={TextField}
                              validators={{
                                requiredGradePercentage: (val) => val && val.length,
                                maxLength: maxLength(255)
                              }}></Control.text>
                            <Errors
                              className={styles.errors}
                              show="touched"
                              model={`Education.certificationDetails[${i}].GradePercentage`}
                              messages={{
                                requiredGradePercentage: ' Grade or Percentage is Required.',
                                maxLength: "Max Charachters allowed 255"
                              }}
                            ></Errors>
                          </td>
                          <td>
                            <button type="button" style={{ marginTop: "20px" }} disabled={this.state.isDisableUser} onClick={() => this.handleRowRemove("certificationDetails", i)}   className={styles.removebtn}>-</button></td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
                </div>
                <div >
                  <DefaultButton id="DefaultSubmit" primary={true} text={"Submit"} type="submit"
                    disabled={this.state.buttonDisabled} className={styles.submitbutton} />
                </div>
              </div>
            </div>
          </div>
        </Form >
      </div >
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch): IEducationDetailConnectedDispatch => {
  return {
    setTabName: SetTabName,
    getDefaultControlsData: (empListId) => {
      return dispatch(GetInitialControlValuesAction(empListId.EmpListID));
    },
    addEducationDetailRow: (section) => {
      return dispatch(addEducationDetailRow(section));
    },
    removeEducationDetailRow: (removedItem, section, index) => {
      return dispatch(removeEducationDetailRow(removedItem, section, index));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EducationDetail);
