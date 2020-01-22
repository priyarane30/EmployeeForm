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
        const CommonState: ICommonState = { CurrentForm: "Professional Details" };
        this.props.setTabName(CommonState);

        let pdData = {} as IProfessionalDetailState;
        pdData = formValues;
        const empListId = store.getState().EmpListId;

        this.setState({ buttonDisabled: true })
        let newEmpServiceObj: NewEmpService = new NewEmpService();
        await newEmpServiceObj.saveProfessionalDetailInList(pdData, empListId)
        this.setState({ buttonDisabled: false })

    }

    public render() {
        if (!this.props.ProfessionalDetail) return (<div> Loading.... </div>);
        return (
            <div className={styles.employeeForm}>
                <Form model="ProfessionalDetail" onSubmit={val => this.handleSubmit(val)}>
                    <div className={styles.employeeForm}>
                        <div className={styles.container}>
                            <div className='col'> {/* Eligible for rehire*/}
                                <label>Fresher:</label>
                                <Control.checkbox model='ProfessionalDetail.IsFresher' id='ProfessionalDetail.IsFresher' />
                            </div>
                            {this.isUserFresher(this.props.ProfessionalDetail)}

                            <button type="submit" disabled={this.state.buttonDisabled}>Submit</button>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }

    isUserFresher(props) {
        //If user is come from another orgenization
        if (props.IsFresher == false) {
            return (
                <div  className={`ms-Grid-row  ms-fontColor-white ${styles.row}`}>
                    <span className={styles.errors}> *Please mention professional details from latest organization</span>
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
                            <th>Total Exp.(Month)</th>
                            <th>Reason For Leaving</th>
                            <th>Action</th>
                        </tr>
                        {
                            this.props.ProfessionalDetail.organizationDetails.map((organizations, i) => {

                                return (
                                    <tr>
                                        <td><Control.text model={`ProfessionalDetail.organizationDetails[${i}].organization`} id={organizations.organization}
                                            validators={{ requiredorganization: (val) => val && val.length }} />
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`ProfessionalDetail.organizationDetails[${i}].organization`}
                                                messages={{
                                                    requiredorganization: 'organization Required'
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Control.text model={`ProfessionalDetail.organizationDetails[${i}].designation`} id={organizations.designation}
                                                validators={{ requireddesignation: (val) => val && val.length }} />
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`ProfessionalDetail.organizationDetails[${i}].designation`}
                                                messages={{
                                                    requireddesignation: 'designation Required'
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Control.text model={`ProfessionalDetail.organizationDetails[${i}].startDate`} id={organizations.startDate} placeholder="MMM-YYYY"
                                                validators={{ requiredstartDate: (val) => val && val.length }} />
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`ProfessionalDetail.organizationDetails[${i}].startDate`}
                                                messages={{
                                                    requiredstartDate: 'start Month Required'
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Control.text model={`ProfessionalDetail.organizationDetails[${i}].endDate`} id={organizations.endDate} placeholder="MMM-YYYY"
                                                validators={{ requiredendDate: (val) => val && val.length }} />
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`ProfessionalDetail.organizationDetails[${i}].endDate`}
                                                messages={{
                                                    requiredendDate: 'End Month Required'
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Control.text model={`ProfessionalDetail.organizationDetails[${i}].reportingTo`} id={organizations.reportingTo}
                                                validators={{ requiredreportingTo: (val) => val && val.length }} />
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`ProfessionalDetail.organizationDetails[${i}].reportingTo`}
                                                messages={{
                                                    requiredreportingTo: 'reporting To Required'
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Control.text model={`ProfessionalDetail.organizationDetails[${i}].reportingDesignation`} id={organizations.reportingDesignation}
                                                validators={{ requiredreportingDesignation: (val) => val && val.length }} />
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`ProfessionalDetail.organizationDetails[${i}].reportingDesignation`}
                                                messages={{
                                                    requiredreportingDesignation: 'reporting Designation Required'
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Control.text model={`ProfessionalDetail.organizationDetails[${i}].totalExp`} id={organizations.totalExp}
                                                validators={{ requiredtotalExp: (val) => val && val.length }} />
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`ProfessionalDetail.organizationDetails[${i}].totalExp`}
                                                messages={{
                                                    requiredtotalExp: 'total Exp Required'
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Control.select model={`ProfessionalDetail.organizationDetails[${i}].reasonForLeaving`} id={organizations.reasonForLeaving}
                                                validators={{ requiredreasonForLeaving: (val) => val && val.length }} >
                                                <option value="0">--Select--</option>

                                                {this.props.ProfessionalDetail.organizationDetails[i].reasonOfLeavingOptions.map(reasons => {
                                                    return <option key={reasons} value={reasons}>{reasons}</option>
                                                })};
                                            </Control.select>
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`ProfessionalDetail.organizationDetails[${i}].reasonForLeaving`}
                                                messages={{
                                                    requiredreasonForLeaving: 'reason For Leaving Required'
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <button type="button"
                                                onClick={() => this.handleRowRemove("ProfessionalDetail", i)}>-</button>
                                        </td>
                                    </tr>
                                )
                            })}
                    </table>
                </div>
            )
        }
        //If User come from direct College
        else if (props.IsFresher == true) {
            return (
                <div  className={`ms-Grid-row  ms-fontColor-white ${styles.row}`}>
                    <span className={styles.errors}> *Please mention mininum 1 Technology / Tools in below section</span>
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
                                        <Control.select model={`ProfessionalDetail.technologyDetails[${i}].Technology`} id={technologies.Technology}
                                            validators={{ requiredtechnology: (val) => val && val != "--Select--" }}>
                                            <option value="0">--Select--</option>
                                            {this.props.ProfessionalDetail.technologyDetails[i].technologyOptions.map(technology => {
                                                return <option key={technology} value={technology}>{technology}</option>
                                            })};
                                        </Control.select>
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model={`ProfessionalDetail.technologyDetails[${i}].Technology`}
                                            messages={{
                                                requiredtechnology: 'Technology Required'
                                            }} />
                                    </td>
                                    <td>
                                        <Control.select model={`ProfessionalDetail.technologyDetails[${i}].SinceWhen`} id={technologies.SinceWhen}
                                            validators={{ requiredSincewhen: (val) => val && val.length }}>
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
                                                requiredSincewhen: 'Since When Required'
                                            }} />
                                    </td>
                                    <td>
                                        <Control.select model={`ProfessionalDetail.technologyDetails[${i}].Expertise`} id={technologies.Expertise}
                                            validators={{ requiredExpertise: (val) => val && val.length }}>
                                            <option value="0">--Select--</option>
                                            <option value="Expert">Expert</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Beginner">Beginner</option>
                                        </Control.select>
                                        <Errors
                                            className={styles.errors}
                                            show="touched"
                                            model={`ProfessionalDetail.technologyDetails[${i}].Expertise`}
                                            messages={{
                                                requiredExpertise: 'Expertise Required'
                                            }} />
                                    </td>
                                    <td>
                                        <Control.select model={`ProfessionalDetail.technologyDetails[${i}].Rating`} id={technologies.Rating}
                                            validators={{ requiredRating: (val) => val && val.length }}>
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
                                                requiredRating: 'Rating Required'
                                            }} />
                                    </td>
                                    <td>
                                        <button type="button" onClick={() => this.handleRowRemove("Technology", i)}>-</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </table>
                </div>
            )
        }
    }
}
const mapStateToProps = function (state) {
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