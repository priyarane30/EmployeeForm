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
  buttonDisabled: boolean
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
    this.state = { buttonDisabled: false }
  }
  async componentDidMount() {
    const empListId = store.getState().EmpListId;
    await this.props.getDefaultControlsData(empListId);
  }
  //adds row in grids
  handleRowAdd(section) {
    this.props.addEducationDetailRow(section);
  }

  //removes row from grid
  handleRowRemove(section, index) {
    let removedItem = this.props.Education[section][index]
    this.props.removeEducationDetailRow(removedItem, section, index);
  }

  async handleSubmit(formValues) {
    this.props.handleSpinner(false);
    const CommonState: ICommonState = { CurrentForm: "Education" };
    this.props.setTabName(CommonState);
    let eduData = {} as IEducationDetailState;
    eduData = formValues;
    const empListId = store.getState().EmpListId;
    this.setState({ buttonDisabled: true })
    let newEmpServiceObj: NewEmpService = new NewEmpService();
    await newEmpServiceObj.saveEduDataInList(eduData, empListId)
    alert("Education Details saved Succesfully")
    this.setState({ buttonDisabled: false });
    this.props.handleSpinner(true);
    this.props.handleTabClick();
  }

  public render() {
    return (
      <div>
        <Form model="Education" onSubmit={val => this.handleSubmit(val)}>
          <div className={styles.employeeForm}>
            <div className={styles.container}>
              <div className={`ms-Grid-row  ms-fontColor-white ${styles.row}`}>
                <table style={{ width: "100%" }}>
                  <tr>
                    <th colSpan={8} style={{ textAlign: "left" }}>Education details <button type="button" onClick={() => this.handleRowAdd("educationDetails")}>+</button></th>
                  </tr>
                  {
                    this.props.Education.educationDetails.map((education, i) => {
                      return (
                        <tr>
                          <td><label>Diploma/Degree</label>
                            <Control.select style={{ height: "30px" }} model={`Education.educationDetails[${i}].DiplomaDegree`} id={`Education.educationDetails[${i}].DiplomaDegree`}
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
                                requiredQualification: 'Required'
                              }}
                            ></Errors></td>
                          <td><label>Grade</label>
                            <Control.text model={`Education.educationDetails[${i}].Grade`} id={`Education.educationDetails[${i}].Grade`}
                              component={TextField}
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
                                requiredGrade: 'Required',
                                maxLength: "Max Charachters allowed 255"
                              }}
                            ></Errors></td>
                          <td><label>StartYear</label>
                            <Control.text model={`Education.educationDetails[${i}].StartYear`}
                              id={`Education.educationDetails[${i}].StartYear`}
                              placeholder="YYYY"
                              component={TextField}
                              validators={{
                                requiredStartYearEdu: (val) => val && val.length == 4,
                                isNumber
                              }}
                            ></Control.text>
                            <Errors
                              className={styles.errors}
                              show="touched"
                              model={`Education.educationDetails[${i}].StartYear`}
                              messages={{
                                requiredStartYearEdu: 'Enter Year in Format(YYYY)',
                                isNumber: "Enter a valid Year"
                              }}
                            ></Errors></td>
                          <td><label>End Year</label>
                            <Control.text model={`Education.educationDetails[${i}].EndYear`} id={`Education.educationDetails[${i}].EndYear`} placeholder="YYYY"
                              component={TextField}
                              validators={{
                                requiredEndYear: (val) => val && val.length == 4,
                                isNumber,
                              }}
                            ></Control.text>
                            <Errors
                              className={styles.errors}
                              show="touched"
                              model={`Education.educationDetails[${i}].EndYear`}
                              messages={{
                                requiredEndYear: 'Enter Year in Format(YYYY)',
                                isNumber: "Enter a valid Year",
                              }}
                            ></Errors></td>
                          <td><label>Board</label>
                            <Control.text model={`Education.educationDetails[${i}].Board`} id={`Education.educationDetails[${i}].Board`}
                              component={TextField}
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
                                requiredEducationBoard: 'Required',
                                maxLength: "Max Charachters allowed 255"
                              }}
                            ></Errors></td>
                          <td><label>SchoolCollege</label>
                            <Control.text model={`Education.educationDetails[${i}].SchoolCollege`} id={`Education.educationDetails[${i}].SchoolCollege`}
                              component={TextField}
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
                                requiredSchoolCollege: 'Required',
                                maxLength: "Max Charachters allowed 255"
                              }}
                            ></Errors></td>
                          <td><label>DegreeName</label>
                            <Control.text model={`Education.educationDetails[${i}].DegreeName`} id={`Education.educationDetails[${i}].DegreeName`}
                              component={TextField}
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
                                requiredDegreeName: 'Required.',
                                maxLength: "Max Charachters allowed 255"
                              }}
                            ></Errors></td>
                          <td>
                            <button type="button" style={{ marginTop: "20px" }} onClick={() => this.handleRowRemove("educationDetails", i)}>-</button></td>
                        </tr>)
                    })}
                </table>
                <table>
                  <tr>
                    <th colSpan={6} style={{ textAlign: "left" }}>Certification details <button type="button" onClick={() => this.handleRowAdd("certificationDetails")}>+</button></th>
                  </tr>
                  {this.props.Education.certificationDetails.map((certification, i) => {
                    return (
                      <tr>
                        <td><label>Certification</label>
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
                              requiredCertification: 'Required',
                              maxLength: "Max Charachters allowed 255"
                            }}
                          ></Errors>
                        </td>
                        <td><label>Start Year</label>
                          <Control.text model={`Education.certificationDetails[${i}].StartYear`} id={`Education.certificationDetails[${i}].StartYear`} placeholder="YYYY"
                            component={TextField}
                            validators={{
                              requiredStartYear: (val) => val && val.length == 4,
                              isNumber
                            }}></Control.text>
                          <Errors
                            className={styles.errors}
                            show="touched"
                            model={`Education.certificationDetails[${i}].StartYear`}
                            messages={{
                              requiredStartYear: 'Enter Year in Format(YYYY)',
                              isNumber: "Enter a valid Year",
                            }}
                          ></Errors>
                        </td>
                        <td><label>YearOfCompletion</label>
                          <Control.text model={`Education.certificationDetails[${i}].YearOfCompletion`} id={`Education.certificationDetails[${i}].YearOfCompletion`} placeholder="YYYY"
                            component={TextField}
                            validators={{
                              requiredYearofCompletion: (val) => val && val.length == 4,
                              isNumber,
                              maxLength: maxLength(4)
                            }}></Control.text>
                          <Errors
                            className={styles.errors}
                            show="touched"
                            model={`Education.certificationDetails[${i}].YearOfCompletion`}
                            messages={{
                              requiredYearofCompletion: 'Enter Year in Format(YYYY)',
                              isNumber: "Enter a valid Year"
                            }}
                          ></Errors>
                        </td>
                        <td><label>InstituteName</label>
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
                              requiredInstituteName: 'Required',
                              maxLength: "Max Charachters allowed 255"
                            }}
                          ></Errors>
                        </td>
                        <td><label>GradePercentage</label>
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
                              requiredGradePercentage: 'Required',
                              maxLength: "Max Charachters allowed 255"
                            }}
                          ></Errors>
                        </td>
                        <td>
                          <button type="button" style={{ marginTop: "20px" }} onClick={() => this.handleRowRemove("certificationDetails", i)}>-</button></td>
                      </tr>)
                  })}
                </table>
                <div >
                  <DefaultButton id="DefaultSubmit" primary={true} text={"Submit"} type="submit"
                    disabled={this.state.buttonDisabled} className={styles.button} />
                </div>
              </div>
            </div>
          </div>
        </Form >
      </div >
    );
  }
}

const mapStateToProps = function (state) {
  return state;
}

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
      return dispatch(removeEducationDetailRow(removedItem, section, index))
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EducationDetail);
