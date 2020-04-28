import { IBasicDetailState } from "../state/IBasicDetailState";
import IBasicFormService from "./IBasicFormService";
import { ListNames, AppConstats } from "../AppConstants";
import UtilityService from "./UtilityService";
import { ItemAddResult, Web } from "sp-pnp-js";
import { store } from "../store/ConfigureStore";
import Axios from "axios";
export default class BasicFormService implements IBasicFormService {
    //Get Emp Basic Data when Id = 0
    public GetEmpBasicData(): Promise<IBasicDetailState> {
        let basicFormControlsState = {} as IBasicDetailState;
        let utilityServiceObj: UtilityService = new UtilityService();
        return utilityServiceObj.getOptionsFromMaster(ListNames.DESIGNATION, 'Designation').then(desigResp => {
            basicFormControlsState.designationOptions = desigResp.sort();
            return utilityServiceObj.getOptionsFromMaster(ListNames.TECHNOLOGY, 'Title').then(techResp => {
                basicFormControlsState.technologyOptions = techResp.sort();
                return basicFormControlsState;
            });
        });
    }

    //Get Emp Basic Data when Id = 0
    public GetEmpBasicDataById(empListId): Promise<IBasicDetailState> {

        let basicFormControlsState = {} as IBasicDetailState;
        let utilityServiceObj: UtilityService = new UtilityService();
        return utilityServiceObj.getOptionsFromChoiceField(ListNames.EMPLOYEECONTACT, 'Grade').then(gradeResp => {
            basicFormControlsState.gradeOptions = gradeResp.sort(this.sortAlphaNum);
            return utilityServiceObj.getOptionsFromChoiceField(ListNames.EMPLOYEECONTACT, 'RefferalSource').then(RefferalSource => {
                basicFormControlsState.refferalSourceOptions = RefferalSource.sort();
            return utilityServiceObj.getOptionsFromChoiceField(ListNames.EMPLOYEECONTACT, 'Location').then(locationResp => {
                basicFormControlsState.locationOptions = locationResp.sort();
                return utilityServiceObj.getOptionsFromMaster(ListNames.DESIGNATION, 'Designation').then(desigResp => {
                    basicFormControlsState.designationOptions = desigResp.sort();
                    return utilityServiceObj.getOptionsFromChoiceField(ListNames.EMPLOYEECONTACT, 'Department').then(department => {
                        basicFormControlsState.departmentOption = department.sort();
                    return utilityServiceObj.getOptionsFromMaster(ListNames.TECHNOLOGY, 'Title').then(techResp => {
                        basicFormControlsState.technologyOptions = techResp.sort();
                        return utilityServiceObj.GetEmployeeContactListById(empListId).then(mainListResp => {
                            
                            basicFormControlsState.EmployeeCode = mainListResp.EmployeeCode;
                            basicFormControlsState.FirstName = mainListResp.FirstName;
                            basicFormControlsState.LastName = mainListResp.LastName;
                            basicFormControlsState.CompanyEmail = mainListResp.Email;
                            basicFormControlsState.DateofJoining = new Date(mainListResp.DateofJoining);
                            basicFormControlsState.Designation = mainListResp.Designation;//CurrentDesignation
                            basicFormControlsState.Grade=mainListResp.Grade;
                            basicFormControlsState.Department=mainListResp.Deparment;
                            basicFormControlsState.Band=mainListResp.Band;
                            basicFormControlsState.RefferalSource=mainListResp.RefferalSource;
                            basicFormControlsState.RefferedBy=mainListResp.RefferedById;
                            basicFormControlsState.Location=mainListResp.Location;
                            basicFormControlsState.WillingnessToTravelForProjectPurpose=mainListResp.WillingnessToTravelForProjectPur;
                            basicFormControlsState.FlexibleOnWorkHoursOrTiming=mainListResp.FlexibleOnWorkHoursOrTiming;
                            if (mainListResp.Technology != null && mainListResp.Technology != undefined) {
                                var TechnologyDropDown = mainListResp.Technology.split(",");
                                let final = [];
                                TechnologyDropDown.forEach(tech => {
                                    final.push({ 'key': tech, 'name': tech });
                                });
                                basicFormControlsState.Technology = final;
                            }
                            return basicFormControlsState;
                        });
                    });
                });});
            });
        });});
    }
    public getRefferedByEmail(empListID): Promise<any> {
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + ListNames.EMPLOYEECONTACT + "')/items?$select=RefferedBy/EMail&$expand=RefferedBy&$filter=ID eq '" + empListID.EmpListID + "'";
        return Axios.get(url)
            .then(res => {
                if (res.data.value != undefined && res.data.value != null) {
                    return res.data.value[0].RefferedBy.EMail;
                }
            }).catch(error => {
                console.log('error while get RefferedBy Email');
                console.log(error);
            });
    }
    //Get Emp Technology
    public GetEmpTechnology(empListId): Promise<any> {

        let technology: any;
        if (empListId > 0) {
            let utilityServiceObj: UtilityService = new UtilityService();
            return utilityServiceObj.GetEmployeeContactListById(empListId).then(mainListResp => {
                technology = mainListResp.Technology;
                return technology;
            });
        }
    }
    public AddBasicDetail(empData: IBasicDetailState, technologydata,Refferer, AdLoginName): Promise<any> {
        let web = new Web(AppConstats.SITEURL);
        if(Refferer!=0){
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.add({
            FullName: empData.FirstName+" "+empData.LastName,
            Title: empData.FirstName+" "+empData.LastName,
            FirstName: empData.FirstName,
            LastName: empData.LastName,
            Designation: empData.Designation,
            Technology: technologydata,//empData.Technology,
            DateofJoining: empData.DateofJoining,//datetime?
            Email: empData.CompanyEmail,
            ADLoginId: AdLoginName,
            RefferedById:Refferer,
            RefferalSource:empData.RefferalSource,
            Grade:empData.Grade,
            Location:empData.Location,
            Band:empData.Band,
            Department:empData.Department,
            ModifiedSection:"None",
            WillingnessToTravelForProjectPur:empData.WillingnessToTravelForProjectPurpose,
            FlexibleOnWorkHoursOrTiming:empData.FlexibleOnWorkHoursOrTiming,
        }).then((result: ItemAddResult) => {
            let mainListID = result.data.Id;
            return mainListID;
        }).catch(error => {
            console.log("error while adding an basic detail");
            console.log(error);
        });}
        else{       return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.add({
            FullName: empData.FirstName+" "+empData.LastName,
            Title: empData.FirstName+" "+empData.LastName,
            FirstName: empData.FirstName,
            LastName: empData.LastName,
            Designation: empData.Designation,
            Technology: technologydata,//empData.Technology,
            DateofJoining: empData.DateofJoining,//datetime?
            Email: empData.CompanyEmail,
            Department:empData.Department,
            ADLoginId: AdLoginName,
            Grade:empData.Grade,
            Location:empData.Location,
            Band:empData.Band,
            ModifiedSection:"None",
            RefferalSource:empData.RefferalSource,
            WillingnessToTravelForProjectPur:empData.WillingnessToTravelForProjectPurpose,
            FlexibleOnWorkHoursOrTiming:empData.FlexibleOnWorkHoursOrTiming,
        }).then((result: ItemAddResult) => {
            let mainListID = result.data.Id;
            return mainListID;
        }).catch(error => {
            console.log("error while adding an basic detail");
            console.log(error);
        });

        }
    }

    public UpdateBasicDetail(basicData: IBasicDetailState, technologydata,Refferer, empListId, AdLoginName): Promise<any> {
        let web = new Web(AppConstats.SITEURL);
        debugger;
        if(Refferer!=0){
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.getById(empListId.EmpListID).update({
            FullName: basicData.FirstName+" "+basicData.LastName,
            Title: basicData.FirstName+" "+basicData.LastName,
            FirstName: basicData.FirstName,
            LastName: basicData.LastName,
            Designation: basicData.Designation,
            Technology: technologydata,
            DateofJoining: basicData.DateofJoining,//datetime?
            Email: basicData.CompanyEmail,
            Grade:basicData.Grade,
            Department:basicData.Department,
            Location:basicData.Location,
            RefferedById:Refferer,
            ModifiedSection:"None",
            RefferalSource:basicData.RefferalSource,
            Band:basicData.Band,
            WillingnessToTravelForProjectPur:basicData.WillingnessToTravelForProjectPurpose,
            FlexibleOnWorkHoursOrTiming:basicData.FlexibleOnWorkHoursOrTiming

        }).then((result: ItemAddResult) => {
            let mainListID = result.data.Id;
            return mainListID;
        }).catch(error => {
            console.log("error while updating Basic details");
            console.log(error);
        });}
        else{
            return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.getById(empListId.EmpListID).update({
                FullName: basicData.FirstName+" "+basicData.LastName,
                Title: basicData.FirstName+" "+basicData.LastName,
                FirstName: basicData.FirstName,
                LastName: basicData.LastName,
                Designation: basicData.Designation,
                Technology: technologydata,
                Department:basicData.Department,
                RefferalSource:basicData.RefferalSource,
                DateofJoining: basicData.DateofJoining,//datetime?
                Email: basicData.CompanyEmail,
                ModifiedSection:"None",
                Grade:basicData.Grade,
                Location:basicData.Location,
                Band:basicData.Band,
                WillingnessToTravelForProjectPur:basicData.WillingnessToTravelForProjectPurpose,
                FlexibleOnWorkHoursOrTiming:basicData.FlexibleOnWorkHoursOrTiming
    
            }).then((result: ItemAddResult) => {
                let mainListID = result.data.Id;
                return mainListID;
            }).catch(error => {
                console.log("error while updating Basic details");
                console.log(error);
            });
        }
    }
    public UpdateEmployeeCode(employeeCode, empListId): Promise<any> {
        let web = new Web(AppConstats.SITEURL);

        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.getById(empListId).update({
            EmployeeCode: employeeCode
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
    public GetEmploymentStatusByUserEmail(email): Promise<any> {
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + ListNames.EMPLOYEECONTACT + "')/items?$select=EmploymentStatus&$filter=Email eq '" + email + "' ";
        return Axios.get(url)
            .then(res => {
                return res.data.value[0].EmploymentStatus;
            }).catch(error => {
                console.log("Error while GetEmpIdByUserEmail");
                console.log(error);
            });
    }
    public GetEmploymentStatusByQuerryID(empListId): Promise<any> {
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + ListNames.EMPLOYEECONTACT + "')/items?$select=EmploymentStatus&$filter=ID eq '" + empListId + "'";
        return Axios.get(url)
            .then(res => {
                return res.data.value[0].EmploymentStatus;
            }).catch(error => {
                console.log("Error while GetEmpIdByUserEmail");
                console.log(error);
            });
    }
    public GetLargestEmployeeCode(): Promise<any> {
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('EmployeeContact')/items?$Select=EmployeeCode&$orderby=EmployeeCode desc&$filter=EmployeeCode ne 459 and EmployeeCode ne 2001 and EmployeeCode ne 2002 and EmployeeCode ne 2003 and EmployeeCode ne 2005&$Top=1";
        return Axios.get(url)
            .then(res => {
                if (res.data != null && res.data != undefined && res.data.ID != 0) {
                    return res.data.value[0].EmployeeCode;
                }
            }).catch(error => {
                console.log('error while getEmployee Code');
                console.log(error);
            });
    }
    public sortAlphaNum(a, b) {
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        var aA = a.replace(reA, "");
        var bA = b.replace(reA, "");
        if (aA === bA) {
          var aN = parseInt(a.replace(reN, ""), 10);
          var bN = parseInt(b.replace(reN, ""), 10);
          return aN === bN ? 0 : aN > bN ? 1 : -1;
        } else {
          return aA > bA ? 1 : -1;
        }
      }
}


