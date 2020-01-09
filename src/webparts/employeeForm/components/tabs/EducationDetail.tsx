import * as React from "react";
import { Form, Control } from "react-redux-form";
import { ICommonState } from "../../state/ICommonState";
import {
  SetTabName,
  GetInitialControlValuesAction,
  AddNewEmployee
} from "../../actions/NewFormControlsValuesAction";
import { IEducationDetailState } from "../../state/IEducationDetailState";
import EmployeeDetail from "./EmployeeDetail";
interface INewFormConnectedDispatch {
  setTabName: (tabName: ICommonState) => void;

  // Gets the options for dropdown fields
  getDefaultControlsData: () => void;

  //save data
  addNewEmployee: (eduData: IEducationDetailState) => void;
}

class EducationDetail extends React.Component<any> {
  constructor(props) {
    super(props);
    //props.educationDetails = [];
  }
componentDidMount(){
  console.log("Education Details");
}

  handleSubmit(formValues) {
    // Do anything you want with the form value
    const CommonState: ICommonState = { CurrentForm: "Education" };
    this.props.setTabName(CommonState);

    let eduData = {} as IEducationDetailState;
    eduData = formValues;
    // Call the connected dispatch to create new purchase request
    this.props.addNewEmployee(eduData);
  }
  public render() {
    return (
      <div>
        <Form model="Education" onSubmit={val => this.handleSubmit(val)}>
          <table>
          <tr><th colSpan={8} style={{textAlign:"left"}}>Education details</th></tr>
            <tr>
              <td>
                <label>Diploma/Degree</label>
                <Control.select model=".DiplomaDegree" id=".DiplomaDegree">
                  <option></option>
                  <option value="Degree">Degree</option>
                  <option value="Diploma">Diploma</option>
                  <option value="12th">12th</option>
                  <option value="10th">10th</option>
                </Control.select>
              </td>
              <td>
                <label>Grade</label>
                <Control.text model=".Grade" id=".Grade"></Control.text>
              </td>
              <td>
                <label>StartYear</label>
                <Control.text
                  model=".StartYear"
                  id=".StartYear"
                  placeholder="YYYY"
                ></Control.text>
              </td>
              <td>
                <label>EndYear</label>
                <Control.text
                  model=".EndYear"
                  id=".EndYear"
                  placeholder="YYYY"
                ></Control.text>
              </td>
              <td>
                <label>Board</label>
                <Control.text model=".Board" id=".Board"></Control.text>
              </td>
              <td>
                <label>SchoolCollege</label>
                <Control.text
                  model=".SchoolCollege"
                  id=".SchoolCollege"
                ></Control.text>
              </td>
              <td>
                <label>DegreeName</label>
                <Control.text
                  model=".DegreeName"
                  id=".DegreeName"
                ></Control.text>
              </td>
              <td>
                <button type="submit">+</button>
              </td>
            </tr>
          </table>
          <table>
            <tr><th colSpan={6} style={{textAlign:"left"}}>Certification details</th></tr>
            <tr>
              <td>
                <label>Certification</label>
                <Control.text model=".Certification" id=".Certification">
                </Control.text>
              </td>
              <td>
                <label>Start Year</label>
                <Control.text model=".StartYear" id=".StartYear" placeholder="YYYY"></Control.text>
              </td>
              <td>
                <label>YearOfCompletion</label>
                <Control.text
                  model=".YearOfCompletion"
                  id=".YearOfCompletion"
                  placeholder="YYYY"
                ></Control.text>
              </td>
              
              <td>
                <label>InstituteName</label>
                <Control.text model=".InstituteName" id=".InstituteName"></Control.text>
              </td>
             
              <td>
                <label>GradePercentage</label>
                <Control.text
                  model=".GradePercentage"
                  id=".GradePercentage"
                ></Control.text>
              </td>
              <td>
                <button type="submit">+</button>
              </td>
            </tr>
          </table>

          {/* <table>
          <tr>
            <td>
              <label>Diploma/Degree</label>
              <Control.select model=".DiplomaDegree" id=".DiplomaDegree">
                <option></option>
                <option value="Degree">Degree</option>
                <option value="Diploma">Diploma</option>
                <option value="12th">12th</option>
                <option value="10th">10th</option>
              </Control.select>
            </td>
            <td>
              <label>Grade</label>
              <Control.text model=".Grade" id=".Grade"></Control.text>
            </td>
            <td>
              <label>StartYear</label>
              <Control.text
                model=".StartYear"
                id=".StartYear"
                placeholder="YYYY"
              ></Control.text>
            </td>
            <td>
              <label>EndYear</label>
              <Control.text
                model=".EndYear"
                id=".EndYear"
                placeholder="YYYY"
              ></Control.text>
            </td>
            <td>
              <label>Board</label>
              <Control.text model=".Board" id=".Board"></Control.text>
            </td>
            <td>
              <label>SchoolCollege</label>
              <Control.text
                model=".SchoolCollege"
                id=".SchoolCollege"
              ></Control.text>
            </td>
            <td>
              <label>DegreeName</label>
              <Control.text
                model=".DegreeName"
                id=".DegreeName"
              ></Control.text>
            </td>
            <td>
              <button type="submit">+</button>
            </td>
          </tr>
          </table> */}
          <button type="submit">Save</button>
        </Form>
      </div >
    );
  }
}
export default EducationDetail;
