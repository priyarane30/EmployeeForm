import * as React from "react";
import { Form, Control } from "react-redux-form";
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

interface buttonStatus {
    buttonDisabled: boolean
}

interface IProfessionalDetailConnectedDispatch {
    setTabName: (tabName: ICommonState) => void;

    // Gets the options for dropdown fields
    getDefaultControlsData: (empListId: IEmpListIdState) => void;
    //616
    //adds empty array to state
    addProfessionalDetailRow: (section) => void;

    //removes selected array from state
    removeProfessionalDetailRow: (section, index) => void;
}

class ProfessionalDetail extends React.Component<any, buttonStatus> {
    constructor(props) {
        super(props);
        const buttonState = {} as buttonStatus
        this.state = { buttonDisabled: false };
    }
    componentDidMount() {
        console.log("Professional Details");
        const empListId = store.getState().EmpListId;
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
    async handleSubmit(formValues) {
        // Do anything you want with the form value
        const CommonState: ICommonState = { CurrentForm: "Professional Details" };
        this.props.setTabName(CommonState);

        let pdData = {} as IProfessionalDetailState;
        pdData = formValues;
        const empListId = store.getState().EmpListId;
        console.log(pdData)
        let newEmpServiceObj: NewEmpService = new NewEmpService();
        debugger;
        await newEmpServiceObj.saveProfessionalDetailInList(pdData,empListId)
        // Call the connected dispatch to create new purchase request
        // this.props.saveDataToSPList(eduData, empListId);
        this.setState({ buttonDisabled: true })

    }
    public isFresher(props)
    {
        if(this.props.ProfessionalDetail.IsFresher == false){
            <div>False</div>
        }
        if(props.ProfessionalDetail.IsFresher == true){
           <div>True</div>
        }
    }
    public render() {
        return (<div>

            <div className='col'> {/* Eligible for rehire*/}
                <label>Fresher:</label>
                <Control.checkbox model='ProfessionalDetail.IsFresher' id='ProfessionalDetail.IsFresher' />
            </div>
            {/* {this.isFresher(this.props.ProfessionalDetail)} */}
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
                                            <option value="0">--Select--</option>

                                            {this.props.ProfessionalDetail.organizationDetails[i].reasonOfLeavingOptions.map(reasons => {
                                                return <option key={reasons} value={reasons}>{reasons}</option>
                                            })};
                                        </Control.select>
                                    </td>
                                    <td>
                                        <button type="button"
                                            onClick={() => this.handleRowRemove("ProfessionalDetail", i)}>-</button>
                                    </td>
                                </tr>
                            )
                        })}
                </table>
                <table>

                    <tr>
                        <th colSpan={2} style={{ textAlign: "left" }}>Technology / Tools Skills</th>
                        <td colSpan={6} style={{ textAlign: "left" }}>
                            <button type="button" onClick={() => this.handleRowAdd("Technology")}>+</button>
                        </td>
                    </tr>
                    <tr>
                        <th>Technology</th>
                        <th>SinceWhen</th>
                        <th>Expertise</th>
                        <th>Rating</th>
                        <th>Action</th>
                    </tr>
                    {this.props.ProfessionalDetail.technologyDetails.map((technologies, i) => {
                        return (
                            <tr key={i}>
                                <td>
                                    <Control.select model={`ProfessionalDetail.technologyDetails[${i}].Technology`} id={technologies.Technology}>
                                        <option value="0">--Select--</option>
                                        {this.props.ProfessionalDetail.technologyDetails[i].technologyOptions.map(technology => {
                                            return <option key={technology} value={technology}>{technology}</option>
                                        })};
                                    </Control.select>
                                </td>
                                <td>
                                    <Control.select model={`ProfessionalDetail.technologyDetails[${i}].SinceWhen`} id={technologies.SinceWhen}>
                                        <option value="0">--Select--</option>
                                        <option value="Currently using">Currently using</option>
                                        <option value="< 3 months">&lt; 3 months</option>
                                        <option value="3-6 months">3-6 months</option>
                                        <option value="6 months - 1 year">6 months - 1 year</option>
                                        <option value="1 - 2 years">1 - 2 years</option>
                                        <option value="> 2 years">&gt; 2 years</option>
                                    </Control.select>

                                </td>
                                <td>
                                    <Control.select model={`ProfessionalDetail.technologyDetails[${i}].Expertise`} id={technologies.Expertise}>
                                        <option value="0">--Select--</option>
                                        <option value="Expert">Expert</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Beginner">Beginner</option>
                                    </Control.select>
                                </td>
                                <td>
                                    <Control.select model={`ProfessionalDetail.technologyDetails[${i}].Rating`} id={technologies.Rating}>
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
                                </td>
                                <td>
                                    <button type="button" onClick={() => this.handleRowRemove("Technology", i)}>-</button>
                                </td>
                            </tr>
                        );
                    })}             
                </table>
                <button type="submit">Submit</button>
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
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfessionalDetail);