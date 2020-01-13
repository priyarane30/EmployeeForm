import { IBasicDetailState } from "../state/IBasicDetailState";
import IBasicFormService from "./IBasicFormService";
import { ListNames, AppConstats, ActionTypes } from "../AppConstants";
import UtilityService from "./UtilityService";
import { sp, ItemAddResult, Web } from "sp-pnp-js";

export default class BasicFormService implements IBasicFormService {
    //Get Emp Basic Data when Id = 0
    GetEmpBasicData(): Promise<IBasicDetailState> {
        let basicFormControlsState = {} as IBasicDetailState;
        let utilityServiceObj: UtilityService = new UtilityService();
        return utilityServiceObj.getOptionsFromMaster(ListNames.DESIGNATION, 'Designation').then(desigResp => {
            basicFormControlsState.designationOptions = desigResp;
            return utilityServiceObj.getOptionsFromMaster(ListNames.TECHNOLOGY, 'Title').then(techResp => {
                basicFormControlsState.technologyOptions = techResp;
                return basicFormControlsState;
            });
        });
    }

    //Get Emp Basic Data when Id = 0
    GetEmpBasicDataById(empListId): Promise<IBasicDetailState> {
        let basicFormControlsState = {} as IBasicDetailState;
        let utilityServiceObj: UtilityService = new UtilityService();
        return utilityServiceObj.getOptionsFromMaster(ListNames.DESIGNATION, 'Designation').then(desigResp => {
            basicFormControlsState.designationOptions = desigResp;

            return utilityServiceObj.getOptionsFromMaster(ListNames.TECHNOLOGY, 'Title').then(techResp => {
                basicFormControlsState.technologyOptions = techResp;

                return utilityServiceObj.GetEmployeeContactListById(empListId).then(mainListResp => {
                    debugger
                    basicFormControlsState.FirstName = mainListResp.FirstName;
                    basicFormControlsState.LastName = mainListResp.LastName;
                    basicFormControlsState.CompanyEmail = mainListResp.CompanyEmail;
                    basicFormControlsState.DateofJoining = "";
                    basicFormControlsState.Designation = "";
                    basicFormControlsState.Technology = "";
                    return basicFormControlsState;
                });
            });
        });
    }

    AddBasicDetail(empData: IBasicDetailState): Promise<any> {
        let web = new Web(AppConstats.SITEURL);
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.add({
            FirstName: empData.FirstName,
            LastName: empData.LastName,
            Designation: empData.Designation,
            Technology: empData.Technology,
            DateofJoining: empData.DateofJoining,//datetime?
            CompanyEmail: empData.CompanyEmail
        }).then((result: ItemAddResult) => {
            let mainListID = result.data.Id;
            console.log("Basic Details has been saved");
            return mainListID;

        }).catch(error => {
            console.log("error while adding an employee");
        });
    }
}


