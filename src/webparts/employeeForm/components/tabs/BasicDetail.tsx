import * as React from 'react';
import { Form, Control } from 'react-redux-form';
import { connect } from "react-redux";
import { GetEmpBasicData, SetTabName, GetEmpListIdByUserEmail, SetEmpIdInStore } from "../../actions/BasicEmpDetailAction";
import { ICommonState, IEmpListIdState } from '../../state/ICommonState';
import { IBasicDetailState } from '../../state/IBasicDetailState';
import BasicService from '../../services/BasicFormService'
import { ActionTypes } from '../../AppConstants';
import { store } from '../../store/ConfigureStore';
interface IBasicFormConnectedDispatch {
    //Get Employee Id using Current User Email

    setEmpId: (empId) => void;
    setTabName: (tabName: ICommonState) => void;
    // Gets the options for dropdown fields
    getBasicDatail: (empListId) => void;
    //save data
    addBasicDetails: (empData: IBasicDetailState) => void;
}


class BasicDetail extends React.Component<any>{
    constructor(props) {
        super(props);
    }

    handleSubmit(formValues) {
        let newEmpReqServiceObj: BasicService = new BasicService();
        // let idState = {
        //     EmpListID: store.getState().EmpListId
        // } as IEmpListIdState;

        const idState = store.getState().EmpListId;
        if (idState != null && idState != undefined) {
            newEmpReqServiceObj.UpdateBasicDetail(formValues, idState).then(resp => {
                //debugger

            }).catch(() => {
                alert("Sorry. Error while adding employee...");
            });
        }
        else {
            newEmpReqServiceObj.AddBasicDetail(formValues).then(resp => {
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
    }

    async componentDidMount() {
        console.log("Basic Details");
        var eId = await GetEmpListIdByUserEmail(this.props.empEmail)
        if (eId != null && eId != undefined) {
            //set empId in store
            this.props.setEmpId(eId);
            this.props.getBasicDatail(eId);
        }
        const CommonState: ICommonState = { CurrentForm: "Employee" };
        this.props.setTabName(CommonState);
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
   // console.log(state)
    return state;
}

// Maps dispatch to props
const mapDispatchToProps = (dispatch): IBasicFormConnectedDispatch => {
    return {
        setEmpId: (empId) => {
            return dispatch(SetEmpIdInStore(empId));
        },
        setTabName: (tabData: ICommonState) => {
            return dispatch(SetTabName(tabData));
        },
        getBasicDatail: (empListId) => {
            return dispatch(GetEmpBasicData(empListId));
        },
        addBasicDetails: (empData: IBasicDetailState) => {
            // return dispatch(AddNewEmployee(empData));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicDetail);
