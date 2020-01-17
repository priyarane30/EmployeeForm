import { IProfessionalDetailState } from '../state/IProfessionalDetailControlState';
import { ICommonState } from '../state/ICommonState';
import NewEmployeeService from '../services/NewEmployeeService';
import { ActionTypes, AppConstats, ListNames } from '../AppConstants';
import NewEmpService from '../services/NewEmployeeService';
import { actions } from 'react-redux-form';

export function GetInitialControlValuesAction(EmpListID) {
    let formcontrol = {} as IProfessionalDetailState
    return dispatch => {
        let newEmpServiceObj: NewEmpService = new NewEmpService();
        debugger;
        newEmpServiceObj.getIsFreshers(EmpListID)
            .then((resp) => {
                formcontrol.IsFresher = resp.IsFresher

                if (formcontrol.IsFresher == false) {
                    let payLoadArrayOrganizationDetails = [];
                    //gets already set ProfessionalDetails for user
                    newEmpServiceObj.getProfessionalDetailsFromList(ListNames.PROFESSIONALHISTORY, 616)
                        .then((resp) => {
                            payLoadArrayOrganizationDetails = resp;
                            formcontrol.organizationDetails = payLoadArrayOrganizationDetails;
                            dispatch({
                                type: ActionTypes.SetInitialProfessionalDetailFormState,
                                payload: formcontrol
                            });
                        });
                }
                else if (formcontrol.IsFresher == true) {
                    //get already existing ProfessionalDetails for user
                    let payLoadArrayTechnologyDetails = [];
                    newEmpServiceObj.getTechnicalDetailsFromList(ListNames.EMPLOYEETECHNICALSKILL, EmpListID)
                        .then((resp) => {
                            payLoadArrayTechnologyDetails = resp
                            formcontrol.technologyDetails = payLoadArrayTechnologyDetails;
                            dispatch({
                                type: ActionTypes.SetInitialTechnologyFromState,
                                payload: formcontrol
                            })

                        });
                    // });
                }
                dispatch({
                    type: ActionTypes.GetProfessionalDetailForm,
                    payload: formcontrol
                });
            })
    };
}
export function SetTabName(tabData: ICommonState) {
    return ({
        type: "SET_TAB",
        payload: tabData
    })
}
//add rows in detail grids
export function addProfessionalDetailRow(section) {


    if (section == "ProfessionalDetail") {
        //     //add row in education detail grid
        return dispatch => {
            let newEmpServiceObj: NewEmpService = new NewEmpService();
            newEmpServiceObj.getOptionsFromMaster(ListNames.REASONFORLEAVING, 'Title')
                .then((ReasonResp) => {
                    let initialOrganizationDetailsGrid =
                    {
                        organization: '',
                        designation: '',
                        startDate: '',//dateTime?
                        endDate: '', //dateTime?
                        reportingTo: '',
                        reportingDesignation: '',
                        totalExp: '',
                        reasonForLeaving: '',
                        // Represent the choices to be displayed in dropdown when the form loads.
                        reasonOfLeavingOptions: ReasonResp,
                    }

                    dispatch({
                        type: ActionTypes.AddProfessionalDetailRow,
                        payload: initialOrganizationDetailsGrid
                    })
                });
        }
    }
    // //add row in certification detail grid

    else {
        return dispatch => {
            let newEmpServiceObj: NewEmpService = new NewEmpService();
            newEmpServiceObj.getOptionsFromMaster(ListNames.TECHNOLOGY, 'Title')
                .then((techResp) => {
                    let initialTechnologyDetailGrid = {
                        Technology: '',
                        SinceWhen: '',
                        Expertise: '',
                        Rating: '',
                        technologyOptions: techResp
                    }
                    dispatch({
                        type: ActionTypes.AddTechnologyDetailRow,
                        payload: initialTechnologyDetailGrid
                    })
                });
        }
    }
    // return actionObj;
}

export function removeProfessionalDetailRow(section, index) {
    return dispatch => {
        if (section == "ProfessionalDetail")
            dispatch({
                type: ActionTypes.RemoveProfessionalDetailRow,
                payload: index
            });
        //remove row from Technology detail rows
        else {
            dispatch({
                type: ActionTypes.RemoveTechnologyRow,
                payload: index
            })
        }
    }
}