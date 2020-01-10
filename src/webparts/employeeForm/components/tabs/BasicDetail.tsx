import * as React from 'react';
import { Form, Control } from 'react-redux-form';
import { connect } from "react-redux";
import { GetEmpBasicData, SetTabName, GetEmpListIdUsingUserEmail } from "../../actions/BasicEmpDetailAction";
import { ICommonState, IEmpListIdState } from '../../state/ICommonState';
import { IBasicDetailState } from '../../state/IBasicDetailState';
import BasicService from '../../services/BasicFormService'
import { ActionTypes } from '../../AppConstants';

interface IBasicFormConnectedDispatch {
    //Get Employee Id using Current User Email
    getEmpId: (currUserEmail) => void;
    setTabName: (tabName: ICommonState) => void;
    // Gets the options for dropdown fields
    getBasicDatail: () => void;
    //save data
    addBasicDetails: (empData: IBasicDetailState) => void;
}

class BasicDetail extends React.Component<any>{
    constructor(props) {
        super(props);
    }

    handleSubmit(formValues) {
        let newEmpReqServiceObj: BasicService = new BasicService();
        newEmpReqServiceObj.AddBasicDetail(formValues).then(resp => {
            debugger
            let empIdState = { EmpListID: resp } as IEmpListIdState;
            dispatch => {
                dispatch({
                    type: ActionTypes.GetEmpID,
                    payload: empIdState
                });
            }
        }).catch(() => {
            alert("Sorry. Error while adding employee...");
        });
    }

    componentDidMount() {
        console.log("Basic Details");
        this.props.getBasicDatail();

        const CommonState: ICommonState = { CurrentForm: "Employee" };
        this.props.setTabName(CommonState);

        // console.log(this.props.empEmail);
        this.props.getEmpId(this.props.empEmail);
    }

    public render() {
        let desigOpt, techOpts;

        if (this.props.Basic != null || this.props.Basic != undefined) {
            if (this.props.Basic.designationOptions != null || this.props.Basic.designationOptions != undefined) {
                desigOpt = this.props.Basic.designationOptions.map(desig => { return <option key={desig} value={desig}>{desig}</option> });
            }
            if (this.props.Basic.technologyOptions != null || this.props.Basic.technologyOptions != undefined) {
                techOpts = this.props.Basic.technologyOptions.map(tech => { return <option key={tech} value={tech}>{tech}</option> });
            }
        }
        return (
            <div>
                <Form model="Basic" onSubmit={(val) => this.handleSubmit(val)}>
                    <div className='col'>
                        <label>First Name:</label>
                        <Control.text model='.FirstName' id='.FirstName' />
                    </div>
                    <div className='col'>
                        <label>Last Name:</label>
                        <Control.text model='.LastName' id='.LastName' />
                    </div>
                    <div className='col'>
                        <label>Date Of Joining:</label>
                        <Control.text model='.DateofJoining' id='.DateofJoining' />
                    </div>
                    <div className='col'>
                        <label>Designation:</label>
                        <Control.select model=".Designation" id=".Designation">
                            <option>--Select--</option>
                            {/* {
                                designations.map(desig => { return <option key={desig} value={desig}>{desig}</option> })
                            } */}
                            {desigOpt}
                        </Control.select>
                    </div>
                    <div className='col'>
                        <label>Technology:</label>
                        <Control.select model=".Technology" id=".Technology">
                            <option>--Select--</option>
                            {/* {technologies.map(tech => { return <option key={tech} value={tech}>{tech}</option> })} */}

                            {techOpts}
                        </Control.select>
                    </div>
                    <div className='col'>
                        <label>Company Email:</label>
                        <Control.text model='.CompanyEmail' id='.CompanyEmail' />
                    </div>
                    <button type="submit">Submit</button>
                </Form>
            </div>);

    }
}

const mapStateToProps = function (state) {
    console.log(state)
    return state;
}

// Maps dispatch to props
const mapDispatchToProps = (dispatch): IBasicFormConnectedDispatch => {
    return {
        getEmpId: (currUserEmail) => {
            return dispatch(GetEmpListIdUsingUserEmail(currUserEmail));
        },
        setTabName: (tabData: ICommonState) => {
            return dispatch(SetTabName(tabData));
        },
        getBasicDatail: () => {
            return dispatch(GetEmpBasicData());
        },
        addBasicDetails: (empData: IBasicDetailState) => {
            // return dispatch(AddNewEmployee(empData));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicDetail);
