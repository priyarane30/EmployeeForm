import * as React from "react";
import { Form, Control } from "react-redux-form";
import { ICommonState, IEmpListIdState } from "../../../state/ICommonState";
import { connect } from "react-redux";
import { IProfessionalDetailState } from "../../../state/IProfessionalDetailControlState";
import { store } from "../../../store/ConfigureStore";
import NewEmpService from '../../../services/NewEmployeeService';

interface buttonStatus {
    buttonDisabled: boolean
}

interface IProfessionalDetailConnectedDispatch {
    setTabName: (tabName: ICommonState) => void;

    // Gets the options for dropdown fields
    getDefaultControlsData: (empListId: IEmpListIdState) => void;

    //adds empty array to state
    addProfessionalDetailRow: (section) => void;

    //removes selected array from state
    removeProfessionalDetailRow: (section, index) => void;
}

class ProfessionalDetail extends React.Component<any, buttonStatus> {
    constructor(props) {
        super(props);
        const buttonState = {} as buttonStatus
        this.state = { buttonDisabled: false }
    }
    componentDidMount() {
        console.log("Eduction Details");
        const empListId = store.getState().EmpListId;
        //debugger
        this.props.getDefaultControlsData(empListId);
    }
    //adds row in grids
    handleRowAdd(section) {
        this.props.addProfessionalDetailRow(section);
    }
    //removes row from grid
    handleRowRemove(section, index) {
        if (section == "ProfessionalDetail") {
            this.props.removeProfessionalDetailRow(section, index);
        }
        else {
            this.props.removeProfessionalDetailRow(section, index);
        }

    }
    handleSubmit(formValues) {
        // Do anything you want with the form value
        const CommonState: ICommonState = { CurrentForm: "Professional Details" };
        this.props.setTabName(CommonState);

        let pdData = {} as IProfessionalDetailState;
        pdData = formValues;
        const empListId = store.getState().EmpListId;
        // Call the connected dispatch to create new purchase request
        // this.props.saveDataToSPList(eduData, empListId);
        this.setState({ buttonDisabled: true })

    }
    public render() {
        return (<div>
            <Form model="ProfessionalDetail" onSubmit={val => this.handleSubmit(val)}>

                <table style={{ width: "100%", tableLayout: "fixed" }}>
                    <tr>
                        <th colSpan={2} style={{ textAlign: "left" }}>Organization details</th>
                        <td colSpan={6} style={{ textAlign: "left" }}>
                            <button type="button" onClick={() => this.handleRowAdd("ProfessionalDetail")}>+</button>
                        </td>
                    </tr>
                    <tr>
                        <th>Organization</th>
                        <th>Designation/Role</th>
                        <th>Start Month</th>
                        <th>End Month</th>
                        <th>Reporting To</th>
                        <th>Reporting Designation</th>
                        <th>Reason For Leaving</th>
                        <th>Total Exp.(Month)</th>
                        <th>Action</th>
                    </tr>
                    {console.log(this.props.ProfessionalDetail)}
                    {

                        this.props.ProfessionalDetail.organizationDetails.map((organizations, i) => {
                            return (
                                <tr>
                                    <td><Control.text model={`ProfessionalDetail.organizationDetails[${i}].organization`} id={organizations.organization} /></td>
                                    <td><Control.text model={`ProfessionalDetail.organizationDetails[${i}].designation`} id={organizations.designation} /></td>
                                    <td><Control.text model={`ProfessionalDetail.organizationDetails[${i}].startDate`} id={organizations.startDate} /></td>
                                    <td><Control.text model={`ProfessionalDetail.organizationDetails[${i}].endDate`} id={organizations.endDate} /></td>
                                    <td><Control.text model={`ProfessionalDetail.organizationDetails[${i}].reportingTo`} id={organizations.reportingTo} /></td>
                                    <td><Control.text model={`ProfessionalDetail.organizationDetails[${i}].reportingDesignation`} id={organizations.reportingDesignation} /></td>
                                    <td><Control.text model={`ProfessionalDetail.organizationDetails[${i}].totalExp`} id={organizations.totalExp} /></td>
                                    <td>
                                        <Control.select model={`ProfessionalDetail.organizationDetails[${i}].reasonForLeaving`} id={organizations.reasonForLeaving}>
                                            <option>--Select--</option>

                                            {/* {this.props.ProfessionalDetail.reasonOfLeavingOptions.map(reasons => {
                                        return <option key={reasons} value={reasons}>{reasons}</option>
                                    })}; */}
                                        </Control.select>
                                    </td>
                                    <td>
                                        <button type="button"
                                            onClick={() => this.handleRowRemove("Education", i)}>-</button>
                                    </td>
                                </tr>
                            )
                        })}
                </table>
                <table>

                    <tr>
                        <th colSpan={2} style={{ textAlign: "left" }}>Technology / Tools Skills</th>
                        <td colSpan={4} style={{ textAlign: "left" }}>
                            <button type="button" onClick={() => this.handleRowAdd("Technology")}>+</button>
                        </td>
                    </tr>
                    <tr>
                        <th>Technology</th>
                        <th>SinceWhen</th>
                        <th>Expertise</th>
                        <th>Rating</th>
                    </tr>
                    {this.props.ProfessionalDetail.technologyDetails.map((technologies, i) => {
                        return (
                            <tr key={i}>
                                <td>
                                    <Control.text model={`ProfessionalDetail.technologyDetails[${i}].Technology`} id={technologies.Technology}></Control.text>
                                </td>
                                <td>
                                    <Control.text model={`ProfessionalDetail.technologyDetails[${i}].SinceWhen`} id={technologies.SinceWhen} placeholder="YYYY"></Control.text>
                                </td>
                                <td>
                                    <Control.text model={`ProfessionalDetail.technologyDetails[${i}].Expertise`} id={technologies.Expertise} placeholder="YYYY"></Control.text>
                                </td>
                                <td>
                                    <Control.text model={`ProfessionalDetail.technologyDetails[${i}].Rating`} id={technologies.Rating}></Control.text>
                                </td>
                                <td>
                                    <button type="button" onClick={() => this.handleRowRemove("Technology", i)}>-</button>
                                </td>
                            </tr>
                        );
                    })}
                </table>
            </Form>
        </div>
        );
    }
}
const mapStateToProps = function (state) {
    //console.log(state)
    return state;
  }
  
  
  const mapDispatchToProps = (dispatch): IProfessionalDetailConnectedDispatch => {
  
  
    return {
      setTabName: SetTabName,
      getDefaultControlsData: (empListId) => {
        return dispatch(GetInitialControlValuesAction(empListId.EmpListID));
      },
      addProfessionalDetailRow: (section) => {
        return dispatch(addProfessionalDetailRow(section));
      },
      removeProfessionalDetailRow: (section, index) => {
        return dispatch(removeProfessionalDetailRow(section, index))
      },
      // saveDataToSPList: (eduData, empListId) => {
      //   return dispatch(SaveDataToSPList(eduData, empListId.EmpListID))
      // }
    };
  };
  export default connect(mapStateToProps, mapDispatchToProps)(ProfessionalDetail);