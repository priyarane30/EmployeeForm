import * as React from "react";
import { Form, Control } from "react-redux-form";
import { ICommonState } from "../../../state/ICommonState";
import {
  SetTabName,
  GetInitialControlValuesAction,
  addEducationDetailRow,
  removeEducationDetailRow,
  SaveDataToSPList
} from "../../../actions/EducationDetailAction";
import { connect } from "react-redux";
import { IEducationDetailState } from "../../../state/IEducationDetailState";

interface IEducationDetailConnectedDispatch {
  setTabName: (tabName: ICommonState) => void;

  // Gets the options for dropdown fields
  getDefaultControlsData: () => void;

  //adds empty array to state
  addEducationDetailRow: (section) => void;

  //removes selected array from state
  removeEducationDetailRow: (section,index) => void;

  //save data in SP list
  SaveDataToSPList: (eduData:IEducationDetailState)=>void;
}

class EducationDetail extends React.Component<any> {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.getDefaultControlsData();

  }
  //adds row in grids
  handleRowAdd(section) {
    if (section == "Education") {
      this.props.addEducationDetailRow(section);
    }
    else{
      this.props.addEducationDetailRow(section);
    }

  }

  //removes row from grid
  handleRowRemove(section, index) {
    if (section == "Education") {
      this.props.removeEducationDetailRow(section,index);
    }
    else{
      this.props.removeEducationDetailRow(section,index);
    }

  }

  handleSubmit(formValues) {
    // Do anything you want with the form value
    const CommonState: ICommonState = { CurrentForm: "Education" };
    this.props.setTabName(CommonState);

    let eduData = {} as IEducationDetailState;
    eduData = formValues;
    // Call the connected dispatch to create new purchase request
    this.props.SaveDataToSPList(eduData);
  }

  public render() {
    return (
      <div>
        <Form model="Education" onSubmit={val => this.handleSubmit(val)}>

          <table>
            <tr>
              <th colSpan={2} style={{ textAlign: "left" }}>Education details</th>
              <td colSpan={6} style={{ textAlign: "left" }}>
                <button type="button" onClick={() => this.handleRowAdd("Education")}>+</button>
              </td>
            </tr>
            {console.log(this.props)}
            {

              this.props.Education.educationDetails.map((education, i) => {
                return (<tr key={i}><td><label>Diploma/Degree</label><Control.select model={`Education.educationDetails[${i}].DiplomaDegree`} defaultValue={education.DiplomaDegree} id="education.DiplomaDegree"><option></option><option value="Graduation">Graduation</option><option value="Diploma">Diploma</option><option value="12th Education">12th Education</option><option value="10th Education">10th Education</option></Control.select></td><td><label>Grade</label><Control.text model={`Education.educationDetails[${i}].Grade`} id={education.Grade}></Control.text></td><td><label>StartYear</label><Control.text model={`Education.educationDetails[${i}].StartYear`} id={education.StartYear} placeholder="YYYY"></Control.text></td><td><label>EndYear</label><Control.text model={`Education.educationDetails[${i}].EndYear`} id={education.EndYear} placeholder="YYYY"></Control.text></td><td><label>Board</label><Control.text model={`Education.educationDetails[${i}].Board`} id={education.Board}></Control.text></td> <td><label>SchoolCollege</label><Control.text model={`Education.educationDetails[${i}].SchoolCollege`} id={education.SchoolCollege}></Control.text></td><td><label>DegreeName</label><Control.text model={`Education.educationDetails[${i}].DegreeName`} id={education.DegreeName}></Control.text></td><td><button type="button" onClick={() => this.handleRowRemove("Education", i)}>-</button></td></tr>)
              })}

          </table >
          <table>
          
            <tr>
              <th colSpan={2} style={{ textAlign: "left" }}>Education details</th>
              <td colSpan={4} style={{ textAlign: "left" }}>
                <button type="button" onClick={() => this.handleRowAdd("Certification")}>+</button>
              </td>
            </tr>
            {this.props.Education.certificationDetails.map((certification,i)=>{
            return (<tr key={i}><td><label>Certification</label><Control.text model={`Education.certificationDetails[${i}].Certification`} id="certification.Certification"></Control.text></td><td><label>Start Year</label><Control.text model={`Education.certificationDetails[${i}].StartYear`} id="certification.StartYear" placeholder="YYYY"></Control.text></td><td><label>YearOfCompletion</label><Control.text model={`Education.certificationDetails[${i}].YearOfCompletion`} id="certification.YearOfCompletion" placeholder="YYYY"></Control.text></td><td><label>InstituteName</label><Control.text model={`Education.certificationDetails[${i}].InstituteName`} id="certification.InstituteName"></Control.text></td><td><label>GradePercentage</label><Control.text model={`Education.certificationDetails[${i}].GradePercentage`}id="certification.GradePercentage"></Control.text></td><td><button type="button" onClick={() => this.handleRowRemove("Certification", i)}>-</button></td></tr>)
  })}
            
          </table>


          <button type="submit">Save</button>
        </Form >
      </div >
    );
  }
}



const mapStateToProps = function (state) {
  console.log(state)
  return state;
}

const mapDispatchToProps = (dispatch): IEducationDetailConnectedDispatch => {


  return {
    setTabName: SetTabName,
    getDefaultControlsData: () => {
      return dispatch(GetInitialControlValuesAction());
    },
    addEducationDetailRow: (section) => {
      return dispatch(addEducationDetailRow(section));
    },
    removeEducationDetailRow: (section,index) => {
      return dispatch(removeEducationDetailRow(section,index))
    },
    SaveDataToSPList: (eduData)=>{
      return dispatch(SaveDataToSPList(eduData))
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EducationDetail);
