import INewEmpRequestService from './INewEmpRequestService';
import { INewFormState } from "../state/INewFormControlsState";
import { IHRState } from "../state/IHRSectionControlsState";
import { IEducationDetailState } from "../state/IEducationDetailState";
import axios from 'axios';
import { AppConstats, ListNames } from '../AppConstants';
import { ItemUpdateResult } from "sp-pnp-js";
import { ItemAddResult, Web } from "sp-pnp-js";
import { IProfessionalDetailState } from '../state/IProfessionalDetailControlState';
import UtilityService from '../services/UtilityService';
import { IPayrollState } from '../state/IPayrollState';
export default class NewEmployeeService implements INewEmpRequestService {
    public getDataFromListUsingParentID(listName, EmpListID): Promise<any> {
        //Get data from Master lists
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + listName + "')/items?$select=*&$filter=empTableID/ID eq '" + EmpListID + "'";
        return axios.get(url)
            .then(res => {
                if (res.data.value != undefined && res.data.value != null) {
                    return res.data.value[0];
                }
            }).catch(error => {
                console.log('error while getOptionsFromMaster');
                console.log(error);
            });
    }

    public getDataFromListUsingID(listName, EmpListID): Promise<any> {
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + listName + "')/items?$select=*&$filter=ID eq '" + EmpListID + "'";
        return axios.get(url)
            .then(res => {
                if (res.data.value != undefined && res.data.value != null) {
                    return res.data.value[0];
                }
            }).catch(error => {
                console.log('error while getOptionsFromMaster');
                console.log(error);
            });
    }

    public deleteDataFromListUsingID(id, listName) {
        let web = new Web(AppConstats.SITEURL);
        web.lists.getByTitle(listName).items.getById(id).delete().then(r => {
            console.log("deleted");
        });
    }

    public getMultipleDataFromListUsingParentID(listName, EmpListID): Promise<any> {
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + listName + "')/items?$select=*&$filter=empTableID/ID eq '" + EmpListID + "'";
        return axios.get(url)
            .then(res => {
                if (res.data.value != undefined && res.data.value != null) {
                    return res.data.value;
                }
            }).catch(error => {
                console.log('error while getOptionsFromMaster');
                console.log(error);
            });
    }

    // Gets the choices to be displayed in the dropdown fields.
    public getNewFormControlState(EmpListID): Promise<any> {
        let newFormControlsState = {} as INewFormState;
        let utilityServiceObj: UtilityService = new UtilityService();
        return utilityServiceObj.getOptionsFromChoiceField(ListNames.EMPLOYEECONTACT, 'Gender').then(genderResp => {
            newFormControlsState.genderOptions = genderResp;

            return utilityServiceObj.getOptionsFromChoiceField(ListNames.EMPLOYEECONTACT, 'MaritalStatus').then(maritalRes => {
                newFormControlsState.maritalStatusOptions = maritalRes;

                return utilityServiceObj.getOptionsFromMaster(ListNames.DESIGNATION, 'Designation').then(desigResp => {
                    newFormControlsState.designationOptions = desigResp;

                    return utilityServiceObj.getOptionsFromMaster(ListNames.TECHNOLOGY, 'Title').then(techResp => {
                        newFormControlsState.technologyOptions = techResp;
                        return this.getDataFromListUsingID(ListNames.EMPLOYEECONTACT, EmpListID).then(res => {
                            newFormControlsState.AadharNo = res.AadhaarCardNo;
                            newFormControlsState.PersonalEmail = res.Email;
                            newFormControlsState.Mobile = res.Mobile;
                            newFormControlsState.DateOfBirth = new Date(res.DateOfBirth);
                            newFormControlsState.Age = res.Age;
                            newFormControlsState.BloodGroup = res.BloodGroup;
                            newFormControlsState.FatherName = res.FatherName;
                            newFormControlsState.MotherName = res.MotherName;
                            newFormControlsState.MaritalStatus = res.MaritalStatus;
                            newFormControlsState.SpouceDOB = new Date(res.SpouseDOB);
                            newFormControlsState.SpouceName = res.SpouseName;
                            newFormControlsState.SpouseOccupation = res.SpouseOccupation;
                            newFormControlsState.EmergencyNo = res.EmergencyContactNo;
                            newFormControlsState.RelationWithEmergencyNo = res.RelationWithEmergencyNo;
                            newFormControlsState.CurrentAddress = res.CurrentAddress;
                            newFormControlsState.IsSameAsCurrAddress = (res.IsSameAsCurrAddress == null || res.IsSameAsCurrAddress == false) ? false : true;
                            newFormControlsState.PermanentAddress = res.PermanentAddress;
                            newFormControlsState.PanNo = res.PanNo;
                            newFormControlsState.IsPassAvail = (res.Passport == "Yes") ? true : false;
                            newFormControlsState.PassportValidity = new Date(res.PassportValidity);
                            newFormControlsState.PassportNo = res.PassportNo;
                            newFormControlsState.Gender = res.Gender;
                            return this.getMultipleDataFromListUsingParentID(ListNames.CHILDDETAILS, EmpListID).then((childres) => {
                                var childItemArray = [];
                                childres.forEach(element => {
                                    childItemArray.push({
                                        childDetailId: element.Id,
                                        ChildName: element.ChildName,
                                        DateOfBirth: new Date(element.ChildDOB)
                                    });
                                });
                                newFormControlsState.childDetailItems = childItemArray;
                                return this.getMultipleDataFromListUsingParentID(ListNames.VISADETAILS, EmpListID).then((visares) => {
                                    var visaItemArray = [];
                                    visares.forEach(element => {
                                        visaItemArray.push({
                                            visaDetailId: element.Id,
                                            ValidVisa: element.ValidVisa,
                                            VisaOfCountry: element.VisaOfCountry,
                                            VisaNo: element.VisaNo,
                                            Entry: element.Entry,
                                            IsTravelled: element.IsTravelled,
                                            VisaValidity: new Date(element.VisaValidity)
                                        });
                                    });
                                    newFormControlsState.visaDetailItems = visaItemArray;
                                    return newFormControlsState;
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    // Creates a new employee request. The request is created in two list. One where the main data is stored and one
    // where the purchase items are stored with a reference of the ID of main request.
    public AddEmpFormData(empData: INewFormState, empListId): Promise<any> {
        let web = new Web(AppConstats.SITEURL);
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.getById(empListId.EmpListID).update({
            Gender: empData.Gender,
            DateOfBirth: empData.DateOfBirth,
            Age: this.getAge(empData.DateOfBirth),
            BloodGroup: empData.BloodGroup,
            FatherName: empData.FatherName,
            MotherName: empData.MotherName,
            Mobile: empData.Mobile,
            Email: empData.PersonalEmail,
            MaritalStatus: empData.MaritalStatus,
            SpouseName: empData.SpouceName,
            SpouseDOB: empData.SpouceDOB,
            SpouseOccupation: empData.SpouseOccupation,
            EmergencyContactNo: empData.EmergencyNo,
            RelationWithEmergencyNo: empData.RelationWithEmergencyNo,
            CurrentAddress: empData.CurrentAddress,
            IsSameAsCurrAddress: empData.IsSameAsCurrAddress,
            PermanentAddress: (empData.IsSameAsCurrAddress == true) ? empData.CurrentAddress : empData.PermanentAddress,
            PanNo: empData.PanNo,
            AadhaarCardNo: empData.AadharNo,
            Passport: (empData.IsPassAvail == true) ? "Yes" : "No",
            PassportNo: empData.PassportNo,
            PassportValidity: empData.PassportValidity
        }).then((result: ItemUpdateResult) => {
            // let web = new Web(AppConstats.SITEURL);
            if (empData.MaritalStatus == "Married") {
                // Creates the multiple purchase items in batch.
                let batch = web.createBatch();
                empData.childDetailItems.forEach(detailRow => {
                    if (detailRow.childDetailId == 0) {
                        web.lists.getByTitle(ListNames.CHILDDETAILS).items.inBatch(batch).add({
                            ChildName: detailRow.ChildName,
                            ChildDOB: detailRow.DateOfBirth,
                            empTableIDId: empListId.EmpListID,
                            Title: detailRow.ChildName
                        });
                    }
                    else if (detailRow.childDetailId > 0) {
                        web.lists.getByTitle(ListNames.CHILDDETAILS).items.getById(detailRow.childDetailId).inBatch(batch).update({
                            ChildName: detailRow.ChildName,
                            ChildDOB: detailRow.DateOfBirth,
                            empTableIDId: empListId.EmpListID,
                            Title: detailRow.ChildName
                        });
                    }
                });
                batch.execute().then(() => { }).catch(() => alert("Oops! Error occured in saving Children Details"));
            }
            if (empData.IsPassAvail) {
                let web = new Web(AppConstats.SITEURL);
                let batch = web.createBatch();
                empData.visaDetailItems.forEach(detailRow => {
                    if (detailRow.visaDetailId == 0) {
                        web.lists.getByTitle(ListNames.VISADETAILS).items.inBatch(batch).add({
                            ValidVisa: detailRow.ValidVisa,
                            VisaNo: detailRow.VisaNo,
                            VisaOfCountry: detailRow.VisaOfCountry,
                            Entry: detailRow.Entry,
                            empTableIDId: empListId.EmpListID,
                            IsTravelled: detailRow.IsTravelled ? "Yes" : "No"
                        });
                    }
                    else if (detailRow.visaDetailId > 0) {
                        web.lists.getByTitle(ListNames.VISADETAILS).items.getById(detailRow.visaDetailId).inBatch(batch).update({
                            ValidVisa: detailRow.ValidVisa,
                            VisaNo: detailRow.VisaNo,
                            VisaOfCountry: detailRow.VisaOfCountry,
                            Entry: detailRow.Entry,
                            empTableIDId: empListId.EmpListID,
                            IsTravelled: detailRow.IsTravelled ? "Yes" : "No"
                        });
                    }
                });
                batch.execute().then(() => { }).catch(() => alert("Oops! Error occured in saving Visa Details"));
            }
            alert("Employee details saved successfully");
        }).catch(error => {
            alert("Oops! Error while saving Employee details");
            console.log(error);
        });
    }

    /**Calculate current age based on Date of Birth */
    private getAge(DOB) {
        var today = new Date();
        var birthDate = new Date(DOB);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age = age - 1;
        }
        return age;
    }

    //#region HR Section

    //Get Data for HR  FORM
    public getHRFormControlState(EmpListID): Promise<any> {
        let hrControlsState = {} as IHRState;
        let utilityServiceObj: UtilityService = new UtilityService();
        return utilityServiceObj.getOptionsFromMaster(ListNames.REASONFORLEAVING, 'Title').then(statusResp => {
            hrControlsState.reasonOfLeavingOptions = statusResp;
            return this.getADLoginName(EmpListID).then(AdloginName => {
                hrControlsState.ADLogin = AdloginName;
                return this.getDataFromListUsingID(ListNames.EMPLOYEECONTACT, EmpListID).then(Resp => {
                    hrControlsState.UserAlies = Resp.UserAlies;
                    hrControlsState.Manager = Resp.ManagerId;
                    hrControlsState.employementStatus = Resp.EmploymentStatus;
                    hrControlsState.DateofLeft = new Date(Resp.DateofLeft);
                    if (Resp.ReasonForLeaving == null)
                        hrControlsState.reasonForLeaving = '--Select--';
                    else
                        hrControlsState.reasonForLeaving = Resp.ReasonForLeaving;
                    hrControlsState.ResigntionDate = new Date(Resp.ResigntionDate);
                    hrControlsState.EligibleforRehire = Resp.EligibleforRehire;
                    return hrControlsState;
                });
            });
        });
    }

    public getADLoginName(empListID): Promise<any> {
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + ListNames.EMPLOYEECONTACT + "')/items?$select=ADLogin/Title&$expand=ADLogin&$filter=ID eq '" + empListID + "'";
        return axios.get(url)
            .then(res => {
                if (res.data.value != undefined && res.data.value != null) {
                    return res.data.value[0].ADLogin.Title;
                }
            }).catch(error => {
                console.log('error while get AD Login Name');
                console.log(error);
            });
    }
    //get Manager Email 
    public getManagerEmail(empListID): Promise<any> {
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + ListNames.EMPLOYEECONTACT + "')/items?$select=Manager/EMail&$expand=Manager&$filter=ID eq '" + empListID.EmpListID + "'";
        return axios.get(url)
            .then(res => {
                if (res.data.value != undefined && res.data.value != null) {
                    return res.data.value[0].Manager.EMail;
                }
            }).catch(error => {
                console.log('error while get Manager Email');
                console.log(error);
            });
    }
    //Save HR FORM Data
    public HrAddNewEmployee(empReqData: IHRState, managerdata, empListID): Promise<any> {
        let web = new Web(AppConstats.SITEURL);
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.getById(empListID.EmpListID).update({
            ManagerId: managerdata,
            EmploymentStatus: empReqData.employementStatus,
            DateofLeft: empReqData.DateofLeft,
            ReasonForLeaving: empReqData.reasonForLeaving,
            ResigntionDate: empReqData.ResigntionDate,
            EligibleforRehire: empReqData.EligibleforRehire,
        }).then((result: ItemAddResult) => {
            alert("HR details saved successfully");

        }).catch(error => {
            console.log("error while adding an employee");
            alert("Opps! Something went wrong while saving HR Details");
        });

    }

    //#endregion HR Section

    //#region EducationDetail Section

    //Get data from Master lists using getMultipleDataFromListUsingParentId
    public async saveEduDataInList(eduData: IEducationDetailState, empListId) {
        await this.saveEducationDetails(eduData.educationDetails, empListId);
        await this.saveCertificationDetails(eduData.certificationDetails, empListId);
    }
    public saveEducationDetails(educationDetails, empListId) {
        let web = new Web(AppConstats.SITEURL);
        let eduBatch = web.createBatch();
        educationDetails.forEach(detailRow => {
            if (detailRow.educationId == 0) {
                web.lists.getByTitle(ListNames.EducationDetail).items.inBatch(eduBatch).add({
                    qualification: detailRow.DiplomaDegree,
                    grade: detailRow.Grade,
                    startYear: detailRow.StartYear,
                    yearOfCompletion: detailRow.EndYear,
                    board: detailRow.Board,
                    school: detailRow.SchoolCollege,
                    degree: detailRow.DegreeName,
                    empTableIDId: empListId.EmpListID
                });
            }
            else if (detailRow.educationId > 0) {
                web.lists.getByTitle(ListNames.EducationDetail).items.getById(detailRow.educationId).inBatch(eduBatch).update({
                    qualification: detailRow.DiplomaDegree,
                    grade: detailRow.Grade,
                    startYear: detailRow.StartYear,
                    yearOfCompletion: detailRow.EndYear,
                    board: detailRow.Board,
                    school: detailRow.SchoolCollege,
                    degree: detailRow.DegreeName,
                    empTableIDId: empListId.EmpListID
                });
            }
        });
        eduBatch.execute().then(() => { "edu updated" }).catch(() => alert("Oops! Error occured in saving Education Details"));
    }

    public saveCertificationDetails(certificationDetails, empListId) {
        let web = new Web(AppConstats.SITEURL);
        let certibatch = web.createBatch();

        certificationDetails.forEach(detailRow => {
            if (detailRow.certificationId == 0) {
                web.lists.getByTitle(ListNames.CertificationDetail).items.inBatch(certibatch).add({
                    certification: detailRow.Certification,
                    startYear: detailRow.StartYear,
                    yearOfCompletion: detailRow.YearOfCompletion,
                    institution: detailRow.InstituteName,
                    GradeOrPercent: detailRow.GradePercentage,
                    empTableIDId: empListId.EmpListID
                });
            }
            else if (detailRow.certificationId > 0) {
                web.lists.getByTitle(ListNames.CertificationDetail).items.getById(detailRow.certificationId).inBatch(certibatch).update({
                    certification: detailRow.Certification,
                    startYear: detailRow.StartYear,
                    yearOfCompletion: detailRow.YearOfCompletion,
                    institution: detailRow.InstituteName,
                    GradeOrPercent: detailRow.GradePercentage,
                    empTableIDId: empListId.EmpListID
                });
            }
        });
        certibatch.execute().then(() => { "certi updated" }).catch(() => alert("Oops! Error occured in saving Education Details"));
    }
    //#endregion EducationDetail Section

    //#region Professional Detail Section

    //get Professional Detail
    public getIsFreshers(EmpListID): Promise<any> {
        let freshervalue = {} as IProfessionalDetailState;
        return this.getDataFromListUsingID(ListNames.EMPLOYEECONTACT, EmpListID).then(Resp => {
            freshervalue.IsFresher = Resp.Fresher;
            return freshervalue;
        });
    }

    public getProfessionalDetailsFromList(listName, EmpListID): Promise<any> {
        let payLoadArrayOrganizationDetails = [];
        return this.getMultipleDataFromListUsingParentID(listName, EmpListID)
            .then((resp) => {
                let utilityServiceObj: UtilityService = new UtilityService();
                return utilityServiceObj.getOptionsFromMaster(ListNames.REASONFORLEAVING, 'Title')
                    .then((reasonResp) => {
                        resp.forEach(element => {
                            payLoadArrayOrganizationDetails.push({
                                organizationId: element.ID,
                                organization: element.organization,
                                designation: element.designation,
                                startDate: element.startDate,
                                endDate: element.endDate,
                                reportingTo: element.reportingTo,
                                reportingDesignation: element.reportingDesignation,
                                totalExp: element.totalExp,
                                reasonForLeaving: element.reasonForLeaving,
                                reasonOfLeavingOptions: reasonResp
                            });
                        });
                        return payLoadArrayOrganizationDetails;
                    });
            });
    }

    public getTechnicalDetailsFromList(listName, EmpListID): Promise<any> {
        let payLoadArrayTechnologyDetails = [];
        return this.getMultipleDataFromListUsingParentID(listName, EmpListID)
            .then((resp) => {
                let utilityServiceObj: UtilityService = new UtilityService();
                return utilityServiceObj.getOptionsFromMaster(ListNames.TECHNOLOGY, 'Title')
                    .then((techResp) => {
                        resp.forEach(element => {
                            payLoadArrayTechnologyDetails.push({
                                technologyId: element.ID,
                                Technology: element.Technology,
                                SinceWhen: element.SinceWhen,
                                Expertise: element.Expertise,
                                InstituteName: element.institution,
                                Rating: element.Rating,
                                technologyOptions: techResp
                            });
                        });
                        return payLoadArrayTechnologyDetails;
                    });
            });
    }
    // End get Professional Detail
    //Save Professional Details
    public async saveProfessionalDetailInList(professionalDetailData: IProfessionalDetailState, EmpListID) {
        await this.saveIsFresher(professionalDetailData, EmpListID);
        if (professionalDetailData.IsFresher == false)
            await this.saveOrgenizationDetail(professionalDetailData.organizationDetails, EmpListID);
        await this.saveTechnologyDetail(professionalDetailData.technologyDetails, EmpListID);

    }
    public saveIsFresher(professionalDetailData: IProfessionalDetailState, empListID) {
        let web = new Web(AppConstats.SITEURL);
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.getById(empListID.EmpListID).update({
            Fresher: professionalDetailData.IsFresher,
            EmploymentStatus: "Assigned to HR"
        }).then((result: ItemAddResult) => {
            let mainListID = result.data.Id;
        }).catch(error => {
            console.log("error while saveIsFresher");
        });
    }

    //save Orgenization Detail in EmpList Id
    public saveOrgenizationDetail(organizationDetails, empListID) {
        let web = new Web(AppConstats.SITEURL);
        let batch = web.createBatch();
        organizationDetails.forEach(detailRow => {
            if (detailRow.organizationId == 0) {
                web.lists.getByTitle(ListNames.PROFESSIONALHISTORY).items.inBatch(batch).add({
                    organization: detailRow.organization,
                    designation: detailRow.designation,
                    startDate: detailRow.startDate,
                    endDate: detailRow.endDate,
                    reportingTo: detailRow.reportingTo,
                    reportingDesignation: detailRow.reportingDesignation,
                    totalExp: detailRow.totalExp,
                    reasonForLeaving: detailRow.reasonForLeaving,
                    empTableIDId: empListID.EmpListID
                });
            }
            else if (detailRow.organizationId > 0) {
                web.lists.getByTitle(ListNames.PROFESSIONALHISTORY).items.getById(detailRow.organizationId).inBatch(batch).update({
                    organization: detailRow.organization,
                    designation: detailRow.designation,
                    startDate: detailRow.startDate,
                    endDate: detailRow.endDate,
                    reportingTo: detailRow.reportingTo,
                    reportingDesignation: detailRow.reportingDesignation,
                    totalExp: detailRow.totalExp,
                    reasonForLeaving: detailRow.reasonForLeaving,
                    empTableIDId: empListID.EmpListID
                });
            }
        });
        batch.execute().then(() => { }).catch(() => alert("Oops! Error occured in saving Technical Details"));
    }

    //Save Technology Detail in EmpList Id
    public saveTechnologyDetail(technologyDetails, empListID) {
        let web = new Web(AppConstats.SITEURL);
        let batch = web.createBatch();
        technologyDetails.forEach(detailRow => {
            if (detailRow.technologyId == 0) {
                web.lists.getByTitle(ListNames.EMPLOYEETECHNICALSKILL).items.inBatch(batch).add({
                    Technology: detailRow.Technology,
                    SinceWhen: detailRow.SinceWhen,
                    Expertise: detailRow.Expertise,
                    Rating: detailRow.Rating,
                    empTableIDId: empListID.EmpListID
                });
            }
            else if (detailRow.technologyId > 0) {
                web.lists.getByTitle(ListNames.EMPLOYEETECHNICALSKILL).items.getById(detailRow.organizationId).inBatch(batch).update({
                    Technology: detailRow.Technology,
                    SinceWhen: detailRow.SinceWhen,
                    Expertise: detailRow.Expertise,
                    Rating: detailRow.Rating,
                    empTableIDId: empListID.EmpListID
                });
            }
        });
        batch.execute().then(() => alert("Professional Detail Save Successfully"))
            .catch(() => alert("Oops! Error occured in saving Technical Details"));
    }
    //#endregion Professional Detail Section

    //#region Payroll 
    //Get Payroll
    public getPayrollControlState(EmpListID): Promise<any> {
        let payrollControlsState = {} as IPayrollState;
        return this.getDataFromListUsingID(ListNames.EMPLOYEECONTACT, EmpListID).then(statusResp => {
            payrollControlsState.UserID = statusResp.UserID;
            payrollControlsState.ESIApplicable = statusResp.ESIApplicable;
            payrollControlsState.ESINo = statusResp.ESINo;
            payrollControlsState.ESIDispensary = statusResp.ESIDispensary;
            payrollControlsState.PFNo = statusResp.PFNo;
            payrollControlsState.PFNoforDeptFile = statusResp.PFNoforDeptFile;
            payrollControlsState.RestrictPF = statusResp.RestrictPF;
            payrollControlsState.ZeroPension = statusResp.ZeroPension;
            payrollControlsState.ZeroPT = statusResp.ZeroPT;
            payrollControlsState.Ward_x002f_Circle = statusResp.Ward_x002f_Circle;
            payrollControlsState.Director = statusResp.Director;
            return payrollControlsState;
        });
    }

    //Save Payroll
    public PayrollAddEmployee(empReqData: IPayrollState, empListId): Promise<any> {
        let web = new Web(AppConstats.SITEURL);
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.getById(empListId.EmpListID).update({
            // return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.add({
            ESIApplicable: empReqData.ESIApplicable,
            ESINo: empReqData.ESINo,
            ESIDispensary: empReqData.ESIDispensary,
            PFNo: empReqData.PFNo,
            PFNoforDeptFile: empReqData.PFNoforDeptFile,
            RestrictPF: empReqData.RestrictPF,
            ZeroPension: empReqData.ZeroPension,
            ZeroPT: empReqData.ZeroPT,
            Ward_x002f_Circle: empReqData.Ward_x002f_Circle,
            Director: empReqData.Director
        }).then((result: ItemAddResult) => {
            let mainListID = result.data.Id;
            alert("Payroll details saved successfully");

        }).catch(error => {
            console.log("error while adding an employee");
            alert("Opps! Something went wrong while saving Payroll details");
        });
    }
    //#endregion
}