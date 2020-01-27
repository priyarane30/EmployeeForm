import { IBasicDetailState } from "../state/IBasicDetailState";
import IBasicFormService from "./IBasicFormService";
import { ListNames, AppConstats } from "../AppConstants";
import UtilityService from "./UtilityService";
import { ItemAddResult, Web } from "sp-pnp-js";
import { store } from "../store/ConfigureStore";
export default class BasicFormService implements IBasicFormService {
    //Get Emp Basic Data when Id = 0
    public GetEmpBasicData(): Promise<IBasicDetailState> {
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
    public GetEmpBasicDataById(empListId): Promise<IBasicDetailState> {
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
                    basicFormControlsState.Designation = mainListResp.Designation;//CurrentDesignation
                    basicFormControlsState.Technology = mainListResp.Technology;
                    return basicFormControlsState;
                });
            });
        });
    }

    //Get Emp Technology
    public GetEmpTechnology(empListId): Promise<any> {
        let technology: any;
        let utilityServiceObj: UtilityService = new UtilityService();
        return utilityServiceObj.GetEmployeeContactListById(empListId).then(mainListResp => {
            technology = mainListResp.Technology;
            return technology;
        });
    }
    public AddBasicDetail(empData: IBasicDetailState, technologydata, AdLoginName): Promise<any> {
        let web = new Web(AppConstats.SITEURL);
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.add({
            FirstName: empData.FirstName,
            LastName: empData.LastName,
            Designation: empData.Designation,
            Technology: technologydata,//empData.Technology,
            DateofJoining: empData.DateofJoining,//datetime?
            Email: empData.CompanyEmail,
            ADLoginId: AdLoginName
        }).then((result: ItemAddResult) => {
            let mainListID = result.data.Id;
            return mainListID;
        }).catch(error => {
            console.log("error while adding an basic detail");
            console.log(error);
        });
    }

    public UpdateBasicDetail(basicData: IBasicDetailState, technologydata, empListId,AdLoginName): Promise<any> {
        let web = new Web(AppConstats.SITEURL);
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.getById(empListId.EmpListID).update({
            FirstName: basicData.FirstName,
            LastName: basicData.LastName,
            Designation: basicData.Designation,
            Technology: technologydata,
            DateofJoining: basicData.DateofJoining,//datetime?
            Email: basicData.CompanyEmail,
            ADLoginId: AdLoginName
        }).then((result: ItemAddResult) => {
            let mainListID = result.data.Id;
            return mainListID;
        }).catch(error => {
            console.log("error while updating Basic details");
            console.log(error);
        });
    }

    public GetCurrentUserGroups(email): Promise<any> {
        let web = new Web(AppConstats.SITEURL);
        let groupList = [];
        return web.siteUsers.getByEmail(email).groups.get().then(grps => {
            grps.forEach(grp => {
                groupList.push(grp.Title);
            });
            return groupList;
        }).catch(error => {
            console.log('error while get user groups');
            console.log(error);
        });
    }
}


