import { IBasicDetailState } from "../state/IBasicDetailState";
import IBasicFormService from "./IBasicFormService";
import { ListNames, AppConstats } from "../AppConstants";
import UtilityService from "./UtilityService";
import { ItemAddResult, Web } from "sp-pnp-js";

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
                    basicFormControlsState.FirstName = mainListResp.FirstName;
                    basicFormControlsState.LastName = mainListResp.LastName;
                    basicFormControlsState.CompanyEmail = mainListResp.Email;
                    basicFormControlsState.DateofJoining = new Date(mainListResp.DateofJoining);
                    basicFormControlsState.Designation = mainListResp.CurrentDesignation;
                    basicFormControlsState.Technology = mainListResp.Technology;
                    return basicFormControlsState;
                });
            });
        });
    }

    //Get Emp Technology
    GetEmpTechnology(empListId): Promise<any> {
        let technology: any;
        let utilityServiceObj: UtilityService = new UtilityService();
        return utilityServiceObj.GetEmployeeContactListById(empListId).then(mainListResp => {
            technology = mainListResp.Technology;
            return technology;
        });
    }

    AddBasicDetail(empData: IBasicDetailState, technologydata): Promise<any> {
        let web = new Web(AppConstats.SITEURL);
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.add({
            FirstName: empData.FirstName,
            LastName: empData.LastName,
            CurrentDesignation: empData.Designation,
            Technology: technologydata,//empData.Technology,
            DateofJoining: empData.DateofJoining,//datetime?
            Email: empData.CompanyEmail
        }).then((result: ItemAddResult) => {
            let mainListID = result.data.Id;
            return mainListID;
        }).catch(error => {
            console.log("error while adding an basic detail");
            console.log(error);
        });
    }

    UpdateBasicDetail(basicData: IBasicDetailState, technologydata, empListId): Promise<any> {
        let web = new Web(AppConstats.SITEURL);
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.getById(empListId.EmpListID).update({
            FirstName: basicData.FirstName,
            LastName: basicData.LastName,
            CurrentDesignation: basicData.Designation,
            Technology: technologydata,
            DateofJoining: basicData.DateofJoining,//datetime?
            Email: basicData.CompanyEmail
        }).then((result: ItemAddResult) => {
            let mainListID = result.data.Id;
            return mainListID;
        }).catch(error => {
            console.log("error while updating Basic details");
            console.log(error);
        });
    }
}


