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
  removeEducationDetailRow: (section, index) => void;
}

class EducationDetail extends React.Component<any, buttonStatus> {
  constructor(props) {
    super(props);
    const buttonState = {} as buttonStatus
    this.state = { buttonDisabled: false }
  }
  async componentDidMount() {
    console.log("did mount")
    const empListId = store.getState().EmpListId;
    await this.props.getDefaultControlsData(empListId);
  }
  //adds row in grids
  handleRowAdd(section) {
    this.props.addEducationDetailRow(section);
  }

  //removes row from grid
  handleRowRemove(section, index) {

    this.props.removeEducationDetailRow(section, index);


  }

  async handleSubmit(formValues) {
    // Do anything you want with the form value
    const CommonState: ICommonState = { CurrentForm: "Education" };
    this.props.setTabName(CommonState);

    let eduData = {} as IEducationDetailState;
    eduData = formValues;
    const empListId = store.getState().EmpListId;
    // Call the connected dispatch to create new purchase request
    this.setState({ buttonDisabled: true })
    let newEmpServiceObj: NewEmpService = new NewEmpService();
    await newEmpServiceObj.saveEduDataInList(eduData, empListId)
    this.setState({ buttonDisabled: false })
  }

  public render() {
    { console.log("render") }
    if (!this.props.Education.educationDetails  || !this.props.Education.certificationDetails) return (<div> Loading.... </div>)
    return (

      <div>
        <Form model="Education" onSubmit={val => this.handleSubmit(val)}>

          <table style={{ width: "100%" }}>
            <tr>
              <th colSpan={2} style={{ textAlign: "left" }}>Education details</th>
              <td colSpan={6} style={{ textAlign: "left" }}>
                <button type="button" onClick={() => this.handleRowAdd("Education")}>+</button>
              </td>
            </tr>
            {
              this.props.Education.educationDetails.map((education, i) => {
                return (
                  <tr>
                    <td><label>Diploma/Degree</label>
                      <Control.select model={`Education.educationDetails[${i}].DiplomaDegree`} id={i}
                      validators={{requiredQualification: (val) => val && val!="--Select--"}}>
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
                      <Control.text model={`Education.educationDetails[${i}].Grade`} id={education.Grade}
                      validators={{requiredGrade: (val) => val && val.length}}
                      ></Control.text>
                      <Errors
                      className={styles.errors}
                      show="touched"
                      model={`Education.educationDetails[${i}].Grade`}
                      messages={{
                        requiredGrade: 'Required'
                      }}
                    ></Errors></td>
                    <td><label>StartYear</label>
                      <Control.text model={`Education.educationDetails[${i}].StartYear`} 
                      id={education.StartYear} 
                      placeholder="YYYY"
                      validators={{requiredStartYearEdu: (val) => val && val.length}}
                      ></Control.text>
                      <Errors
                      className={styles.errors}
                      show="touched"
                      model={`Education.educationDetails[${i}].StartYear`}
                      messages={{
                        requiredStartYearEdu: 'Required'
                      }}
                    ></Errors></td>
                    <td><label>EndYear</label>
                      <Control.text model={`Education.educationDetails[${i}].EndYear`} id={education.EndYear} placeholder="YYYY"
                      validators={{requiredEndYear: (val) => val && val.length}}
                      ></Control.text>
                      <Errors
                      className={styles.errors}
                      show="touched"
                      model={`Education.educationDetails[${i}].EndYear`}
                      messages={{
                        requiredEndYear: 'Required'
                      }}
                    ></Errors></td>
                    <td><label>Board</label>
                      <Control.text model={`Education.educationDetails[${i}].Board`} id={education.Board}
                      validators={{requiredEducationBoard: (val) => val && val.length}}
                      ></Control.text>
                      <Errors
                      className={styles.errors}
                      show="touched"
                      model={`Education.educationDetails[${i}].Board`}
                      messages={{
                        requiredEducationBoard: 'Required'
                      }}
                    ></Errors></td>
                    <td><label>SchoolCollege</label>
                      <Control.text model={`Education.educationDetails[${i}].SchoolCollege`} id={education.SchoolCollege}
                      validators={{requiredSchoolCollege: (val) => val && val.length}}
                      ></Control.text>
                      <Errors
                      className={styles.errors}
                      show="touched"
                      model={`Education.educationDetails[${i}].SchoolCollege`}
                      messages={{
                        requiredSchoolCollege: 'Required'
                      }}
                    ></Errors></td>
                    <td><label>DegreeName</label>
                      <Control.text model={`Education.educationDetails[${i}].DegreeName`} id={education.DegreeName}
                      validators={{requiredDegreeName: (val) => val && val.length}}
                      ></Control.text>
                      <Errors
                      className={styles.errors}
                      show="touched"
                      model={`Education.educationDetails[${i}].DegreeName`}
                      messages={{
                        requiredDegreeName: 'Required.'
                      }}
                    ></Errors></td>
                    <td>
                      <button type="button" onClick={() => this.handleRowRemove("Education", i)}>-</button></td>
                  </tr>)
              })}

          </table >
          <table>

            <tr>
              <th colSpan={2} style={{ textAlign: "left" }}>Certification details</th>
              <td colSpan={4} style={{ textAlign: "left" }}>
                <button type="button" onClick={() => this.handleRowAdd("Certification")}>+</button>
              </td>
            </tr>
            {this.props.Education.certificationDetails.map((certification, i) => {
              return (
                <tr>
                  <td><label>Certification</label>
                    <Control.text model={`Education.certificationDetails[${i}].Certification`} id="certification.Certification"
                    validators={{requiredCertification: (val) => val && val.length}}></Control.text>
                    <Errors
                      className={styles.errors}
                      show="touched"
                      model={`Education.certificationDetails[${i}].Certification`}
                      messages={{
                        requiredCertification: 'Required'
                      }}
                    ></Errors>
                    </td>
                  <td><label>Start Year</label>
                    <Control.text model={`Education.certificationDetails[${i}].StartYear`} id="certification.StartYear" placeholder="YYYY"
                    validators={{requiredStartYear: (val) => val && val.length}}></Control.text>
                    <Errors
                      className={styles.errors}
                      show="touched"
                      model={`Education.certificationDetails[${i}].StartYear`}
                      messages={{
                        requiredStartYear: 'Required'
                      }}
                    ></Errors>
                    </td>
                  <td><label>YearOfCompletion</label>
                    <Control.text model={`Education.certificationDetails[${i}].YearOfCompletion`} id="certification.YearOfCompletion" placeholder="YYYY"
                    validators={{requiredYearofCompletion: (val) => val && val.length}}></Control.text>
                    <Errors
                      className={styles.errors}
                      show="touched"
                      model={`Education.certificationDetails[${i}].YearOfCompletion`}
                      messages={{
                        requiredYearofCompletion: 'Required'
                      }}
                    ></Errors>
                    </td>
                  <td><label>InstituteName</label>
                    <Control.text model={`Education.certificationDetails[${i}].InstituteName`} id="certification.InstituteName"
                    validators={{requiredInstituteName: (val) => val && val.length}}></Control.text>
                    <Errors
                      className={styles.errors}
                      show="touched"
                      model={`Education.certificationDetails[${i}].InstituteName`}
                      messages={{
                        requiredInstituteName: 'Required'
                      }}
                    ></Errors>
                    </td>
                  <td><label>GradePercentage</label>
                    <Control.text model={`Education.certificationDetails[${i}].GradePercentage`} id="certification.GradePercentage"
                    validators={{requiredGradePercentage: (val) => val && val.length}}></Control.text>
                    <Errors
                      className={styles.errors}
                      show="touched"
                      model={`Education.certificationDetails[${i}].GradePercentage`}
                      messages={{
                        requiredGradePercentage: 'Required'
                      }}
                    ></Errors>
                    </td>
                  <td>
                    <button type="button" onClick={() => this.handleRowRemove("Certification", i)}>-</button></td>
                </tr>)
            })}
          </table>
          <button type="submit" disabled={this.state.buttonDisabled}>Submit</button>
        </Form >
      </div >
    );
  }
}
const mapStateToProps = function (state) {
  //console.log(state)
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
    removeEducationDetailRow: (section, index) => {
      return dispatch(removeEducationDetailRow(section, index))
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EducationDetail);
