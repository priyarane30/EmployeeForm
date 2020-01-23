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
    buttonDisabled: boolean
}
interface IProfessionalDetailConnectedDispatch {
    setTabName: (tabName: ICommonState) => void;
    getDefaultControlsData: (empListId: IEmpListIdState) => void; // Gets the options for dropdown fields
    //616
    addProfessionalDetailRow: (section) => void;  //adds empty array to state
    removeProfessionalDetailRow: (section, index) => void; //removes selected array from state
}

class ProfessionalDetail extends React.Component<any, buttonStatus> {
    constructor(props) {
        super(props);
        this.state = { buttonDisabled: false };
    }
    componentDidMount() {
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
        this.props.handleTabClick();
    }

    public render() {
        if (!this.props.ProfessionalDetail) return (<div> Loading.... </div>);
        return (
            <div className={styles.employeeForm}>
                <div className={styles.container}>
                    <Form model="ProfessionalDetail" onSubmit={val => this.handleSubmit(val)}>
                        <div className='col'> {/* Eligible for rehire*/}
                            <label>Fresher:</label>
                            <Control.checkbox model='ProfessionalDetail.IsFresher' id='ProfessionalDetail.IsFresher' />
                        </div>
                        {this.isUserFresher(this.props.ProfessionalDetail)}
                        <DefaultButton id="DefaultSubmit" primary={true} text={"Submit"} type="submit"
                            disabled={this.state.buttonDisabled} className={styles.button} />
                    </Form>
                </div>
            </div >
        );
    }

    isUserFresher(props) {
        //If user is come from another orgenization
        if (props.IsFresher == false) {
            return (
                <div className={`ms-Grid-row  ms-fontColor-white ${styles.row}`}>
                    <span className={styles.errors}> *Please mention professional details from latest organization</span>
                    <table style={{ width: "100%", tableLayout: "fixed" }}>
                        <tr>
                            <th colSpan={2} style={{ textAlign: "left" }}>Organization details</th>
                            <td colSpan={6} style={{ textAlign: "left" }}>
                                <button type="button" onClick={() => this.handleRowAdd("ProfessionalDetail")}>+</button>
                            </td>
                        </tr>
                        {
                            this.props.ProfessionalDetail.organizationDetails.map((organizations, i) => {
                                return (
                                    <tr>
                                        <td> {/* Organization */}
                                            <label>Organizatio n</label>
                                            <Control.text model={`ProfessionalDetail.organizationDetails[${i}].organization`} id={organizations.organization}
                                                validators={{ requiredorganization: (val) => val && val.length && !(Number(val)) }} component={TextField} />
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`ProfessionalDetail.organizationDetails[${i}].organization`}
                                                messages={{
                                                    requiredorganization: 'organization Name Required'
                                                }}
                                            />
                                        </td>
                                        <td> {/* Designation/Role */}
                                            <label>Designation /Role</label>
                                            <Control.text model={`ProfessionalDetail.organizationDetails[${i}].designation`} id={organizations.designation}
                                                validators={{ requireddesignation: (val) => val && val.length && !(Number(val)) }} component={TextField} />
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`ProfessionalDetail.organizationDetails[${i}].designation`}
                                                messages={{
                                                    requireddesignation: 'designation Required'
                                                }}
                                            />
                                        </td>
                                        <td> {/* Start Month */}
                                            <label>Start Month</label>
                                            <Control.text model={`ProfessionalDetail.organizationDetails[${i}].startDate`} id={organizations.startDate} placeholder="MMM-YYYY"
                                                validators={{
                                                    requiredstartDate: (val) => val && val.length,
                                                    isStartMonth: (val) => (/^[a-zA-Z\s]{3}-[0-9\s]{4}$/i.test(val))
                                                }} component={TextField} />
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`ProfessionalDetail.organizationDetails[${i}].startDate`}
                                                messages={{
                                                    requiredstartDate: 'start Month Required',
                                                    isStartMonth: 'Must be MMM-yyyy',
                                                }}
                                            />
                                        </td>
                                        <td> {/* End  Month */}
                                            <label>End  Month</label>
                                            <Control.text model={`ProfessionalDetail.organizationDetails[${i}].endDate`} id={organizations.endDate} placeholder="MMM-YYYY"
                                                validators={{ requiredendDate: (val) => val && val.length,
                                                    isEndMonth: (val) => (/^[a-zA-Z\s]{3}-[0-9\s]{4}$/i.test(val)) }} component={TextField} />
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`ProfessionalDetail.organizationDetails[${i}].endDate`}
                                                messages={{
                                                    requiredendDate: 'End Month Required',
                                                    isEndMonth: 'Must be MMM-yyyy',
                                                }}
                                            />
                                        </td>
                                        <td> {/* Reporting To */}
                                            <label>Reporting To</label>
                                            <Control.text model={`ProfessionalDetail.organizationDetails[${i}].reportingTo`} id={organizations.reportingTo}
                                                validators={{ requiredreportingTo: (val) => val && val.length && !(Number(val)) }} component={TextField} />
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`ProfessionalDetail.organizationDetails[${i}].reportingTo`}
                                                messages={{
                                                    requiredreportingTo: 'reporting To Required'
                                                }}
                                            />
                                        </td>
                                        <td> {/* Reporting Designation */}
                                            <label>Reporting Designation</label>
                                            <Control.text model={`ProfessionalDetail.organizationDetails[${i}].reportingDesignation`} id={organizations.reportingDesignation}
                                                validators={{ requiredreportingDesignation: (val) => val && val.length && !(Number(val)) }} component={TextField} />
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`ProfessionalDetail.organizationDetails[${i}].reportingDesignation`}
                                                messages={{
                                                    requiredreportingDesignation: 'reporting Designation Required'
                                                }}
                                            />
                                        </td>
                                        <td> {/* Total Exp.(Month) */}
                                            <label>Total Exp.(Month)</label>
                                            <Control.text model={`ProfessionalDetail.organizationDetails[${i}].totalExp`} id={organizations.totalExp}
                                                validators={{
                                                    requiredtotalExp: (val) => Number(val) && val.length
                                                }} component={TextField} />
                                            <Errors
                                                className={styles.errors}
                                                show="touched"
                                                model={`ProfessionalDetail.organizationDetails[${i}].totalExp`}
                                                messages={{
                                                    requiredtotalExp: 'total Exp in Month(Number) Required'
                                                }}
                                            />
                                        </td>
                                        <td> {/* Reason For Leaving */}
                                            <label>Reason For Leaving</label>
                                            <Control.select model={`ProfessionalDetail.organizationDetails[${i}].reasonForLeaving`} id={organizations.reasonForLeaving}
                                                validators={{ requiredreasonForLeaving: (val) => val && val != "--Select--" }} style={{ height: "30px", width: "100%" }}>
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
                                        <td> {/* Action */}
                                            <button type="button" onClick={() => this.handleRowRemove("ProfessionalDetail", i)} style={{ marginTop: "40px" }}>-</button>
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
                <div className={`ms-Grid-row  ms-fontColor-white ${styles.row}`}>
                    <span className={styles.errors}> *Please mention mininum 1 Technology / Tools in below section</span>
                    <table>
                        <tr>
                            <th colSpan={2} style={{ textAlign: "left" }}>Technology / Tools Skills</th>
                            <td colSpan={6} style={{ textAlign: "left" }}>
                                <button type="button" onClick={() => this.handleRowAdd("Technology")}>+</button>
                            </td>
                        </tr>
                        {this.props.ProfessionalDetail.technologyDetails.map((technologies, i) => {
                            return (
                                <tr key={i}>
                                    <td> {/* Technology */}
                                        <label>Technology</label>
                                        <Control.select model={`ProfessionalDetail.technologyDetails[${i}].Technology`} id={technologies.Technology}
                                            validators={{ requiredtechnology: (val) => val && val != "--Select--" }} style={{ height: "30px", width: "100%" }}>
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
                                    <td> {/* SinceWhen */}
                                        <label>SinceWhen</label>
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
                                                requiredSincewhen: 'Since When Required'
                                            }} />
                                    </td>
                                    <td> {/* Expertise */}
                                        <label>Expertise</label>
                                        <Control.select model={`ProfessionalDetail.technologyDetails[${i}].Expertise`} id={technologies.Expertise}
                                            validators={{ requiredExpertise: (val) => val && val != "--Select--" }} style={{ height: "30px", width: "100%" }}>
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
                                    <td> {/* Rating */}
                                        <label>Rating</label>
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
                                                requiredRating: 'Rating Required'
                                            }} />
                                    </td>
                                    <td> {/* Action */}
                                        <button type="button" onClick={() => this.handleRowRemove("Technology", i)} style={{ marginTop: "20px" }}>-</button>
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