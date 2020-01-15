import INewEmpRequestService from './INewEmpRequestService';
import { INewFormState } from "../state/INewFormControlsState";
import { IHRState } from "../state/IHRSectionControlsState";
import { IEducationDetailState } from "../state/IEducationDetailState";
import { IProfessionalDetailState } from "../state/IProfessionalDetailControlState";
import axios from 'axios';
import { AppConstats, ListNames } from '../AppConstants';
import pnp from "sp-pnp-js";
import { sp, ItemAddResult, Web } from "sp-pnp-js";
import { IPayrollState } from '../state/IPayrollState';
import { IBasicDetailState } from '../state/IBasicDetailState';

export default class NewEmployeeService implements INewEmpRequestService {


    getusingCallback: (name) => {

    };

    private getOptionsFromMaster(listName, columnName): Promise<any> {
        //Get data from Master lists
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + listName + "')/items?$select=" + columnName;
        return axios.get(url)
            .then(res => {
                if (res.data.value != undefined && res.data.value != null) {
                    return res.data.value.map(r => r[columnName]);
                }
            }).catch(error => {
                console.log('error while getOptionsFromMaster');
                console.log(error)
            });
    }
    getDataFromList(listName, userEmail): Promise<any> {
        //Get data from Master lists

        //var url="http://intranet/_api/web/lists/GetByTitle('" + listName + "')/items?$select=*,ADLogin/Title,Manager/Title&$expand=ADLogin/Id,Manager/Id&$filter=CompanyEMail_x0020_ID eq '" + userEmail + "'";
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + listName + "')/items?$select=*&$filter=CompanyEMail_x0020_ID eq '" + userEmail + "'";

        return axios.get(url)
            .then(res => {
                if (res.data.value != undefined && res.data.value != null) {
                    return res.data.value[0];
                }
            }).catch(error => {
                console.log('error while getOptionsFromMaster');
                console.log(error)
            });
    }




    private getOptionsFromChoiceField(listName, columnName): Promise<any> {
        // return pnp.sp.web.fields.getByTitle("Gender").select("Choices").get().then(response => {
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + listName + "')/fields?$filter=EntityPropertyName eq '" + columnName + "'";
        return axios.get(url)
            .then(res => {
                console.log(res);
                return res.data.value[0].Choices;
            }).catch(error => {
                console.log("Error while getOptionsFromChoiceField");
                console.log(error);
            });
    }


    // Gets the choices to be displayed in the dropdown fields.
    getNewFormControlState(): Promise<any> {
        let newFormControlsState = {} as INewFormState;
        return this.getOptionsFromChoiceField(ListNames.EMPLOYEECONTACT, 'Gender').then(genderResp => {
            newFormControlsState.genderOptions = genderResp;

            return this.getOptionsFromChoiceField(ListNames.EMPLOYEECONTACT, 'MaritalStatus').then(maritalRes => {
                newFormControlsState.maritalStatusOptions = maritalRes;

                return this.getOptionsFromMaster(ListNames.DESIGNATION, 'Designation').then(desigResp => {
                    newFormControlsState.designationOptions = desigResp;

                    return this.getOptionsFromMaster(ListNames.TECHNOLOGY, 'Title').then(techResp => {
                        newFormControlsState.technologyOptions = techResp;

                        return newFormControlsState;
                    });
                });
            });
        });
    }

    // Creates a new employee request. The request is created in two list. One where the main data is stored and one
    // where the purchase items are stored with a reference of the ID of main request.
    AddNewEmpRequest(empData: INewFormState): Promise<any> {
        let web = new Web(AppConstats.SITEURL);
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.add({
            // FirstName: empData.FirstName,
            // LastName: empData.LastName,
            // Designation: empData.Designation,
            // Gender: empData.Gender,
            // Technology: empData.Technology,
            MotherName: empData.MotherName,
            Mobile: empData.Mobile
        }).then((result: ItemAddResult) => {
            let mainListID = result.data.Id;
            console.log("Employee request created : " + mainListID);
            if (empData.childDetailItems != null && empData.childDetailItems.length > 0) {

                // Creates the multiple purchase items in batch.
                let web = new Web(AppConstats.SITEURL);
                let batch = web.createBatch();
            }

        }).catch(error => {
            console.log("error while adding an employee");
        });
    }

    //Start HR Section

    //Get Data for HR  FORM
    getHRFormControlState(): Promise<any> {
        let hrControlsState = {} as IHRState;
        return this.getOptionsFromMaster(ListNames.REASONFORLEAVING, 'Title').then(statusResp => {
            hrControlsState.reasonOfLeavingOptions = statusResp;

            return this.getDataFromList(ListNames.EMPLOYEECONTACT, 'hitaxi.kachhadiya@synoverge.com').then(Resp => {
                hrControlsState.UserAlies = Resp.UserAlies;
                hrControlsState.UserID = Resp.Id;
                hrControlsState.ADLogin = Resp.ADLoginId;//'Hitaxi Kachhadiya';//Resp.ADLogin;
                hrControlsState.Manager = Resp.ManagerId;//'Krishna Soni';//Resp.Manager;
                hrControlsState.employementStatus = Resp.employementStatus;
                hrControlsState.DateOfLeaving = Resp.DateOfLeaving;
                if (Resp.reasonForLeaving == null)
                    hrControlsState.reasonForLeaving = '--Select--';//Resp.reasonForLeaving;
                else
                    hrControlsState.reasonForLeaving = Resp.reasonForLeaving;
                hrControlsState.ResigntionDate = Resp.ResigntionDate;
                hrControlsState.EligibleforRehire = Resp.EligibleforRehire;

                return hrControlsState;
            });
        });
    }
    //Save HR FORM Data
    HrAddNewEmployee(empReqData: IHRState): Promise<any> {

        let web = new Web(AppConstats.SITEURL);

        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.getById(empReqData.UserID).update({
        // return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.add({

       // return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.add({
            userAlias: empReqData.UserAlies,
            ADLogin: empReqData.ADLogin,
            Manager: empReqData.Manager,
            employementStatus: empReqData.employementStatus,
            DateOfLeaving: empReqData.DateOfLeaving,
            //reasonForLeaving: empReqData.reasonForLeaving,
            ResigntionDate: empReqData.ResigntionDate,
            EligibleforRehire: empReqData.EligibleforRehire,
        }).then((result: ItemAddResult) => {
            let mainListID = result.data.Id;
            console.log("Employee request created : " + mainListID);

        }).catch(error => {
            console.log("error while adding an employee");
        });

    }

    //End HR Section
    //Start EducationDetail Section
    getEduDataFromList(listName, EmpListID): Promise<any> {
        //Get data from Master lists
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + listName + "')/items?$select=*&$filter=empTableID/ID eq '" + EmpListID + "'";
        return axios.get(url)
            .then(res => {
                if (res.data.value != undefined && res.data.value != null) {
                    return res.data.value;
                }
            }).catch(error => {
                console.log('error while getOptionsFromMaster');
                console.log(error)
            });
    }
   
    async saveEduDataInList(eduData: IEducationDetailState, empListId) {
       await this.saveEducationDetails(eduData.educationDetails,empListId)
       await this.saveCertificationDetails(eduData.certificationDetails,empListId)
            }
    saveEducationDetails(educationDetails,empListId) {
        let web = new Web(AppConstats.SITEURL);
        let batch = web.createBatch()
            var url = AppConstats.SITEURL + "_api/web/lists/GetByTitle('" + ListNames.EducationDetail + "')/items?$select=ID&$filter=empTableID/ID eq " + empListId.EmpListID;
            return axios.get(url)
                .then(res => { debugger;
                    if (res.data.value.length>0) {
                        let idData = res.data.value;
                        idData.forEach(e => {
                            
                            web.lists.getByTitle(ListNames.EducationDetail).items.getById(e["ID"]).inBatch(batch).delete()
                            .then(r => {
                                console.log("deleted");
                              });
                        });
                        batch.execute().then(() => {console.log("All deleted")
                        educationDetails.forEach(detailRow=>{
                            web.lists.getByTitle(ListNames.EducationDetail).items.inBatch(batch).add({
                                qualification:detailRow.DiplomaDegree,
                                grade:detailRow.Grade,
                                startYear:detailRow.Grade,
                                yearOfCompletion:detailRow.EndYear,
                                board:detailRow.Board,
                                school:detailRow.SchoolCollege,
                                degree:detailRow.DegreeName,
                                empTableIDId:empListId.EmpListID
                            });
                        });
                        batch.execute().then(()=>console.log("all added"))});
                    }
                    else{educationDetails.forEach(detailRow=>{
                        web.lists.getByTitle(ListNames.EducationDetail).items.inBatch(batch).add({
                            qualification:detailRow.DiplomaDegree,
                            grade:detailRow.Grade,
                            startYear:detailRow.Grade,
                            yearOfCompletion:detailRow.EndYear,
                            board:detailRow.Board,
                            school:detailRow.SchoolCollege,
                            degree:detailRow.DegreeName,
                            empTableIDId:empListId.EmpListID
                        });
                    });
                    batch.execute().then(()=>console.log("all added"))
                        
                    }
                }).catch(error => {
                    console.log('error while getOptionsFromMaster');
                    console.log(error)
                });
     }
    saveCertificationDetails(certificationDetails,empListId) {
        let web = new Web(AppConstats.SITEURL);
        let certibatch = web.createBatch()       
            var urlCerti = AppConstats.SITEURL + "_api/web/lists/GetByTitle('" + ListNames.CertificationDetail + "')/items?$select=ID&$filter=empTableID/ID eq " + empListId.EmpListID;
                return axios.get(urlCerti)
                .then(res => { debugger;
                    if (res.data.value.length>0) {
                        let idData = res.data.value;
                        idData.forEach(e => {
                            
                            web.lists.getByTitle(ListNames.CertificationDetail).items.getById(e["ID"]).inBatch(certibatch).delete()
                            .then(r => {
                                console.log("deleted");

                              });
                        });
                        certibatch.execute().then(() => {console.log("All deleted")
                        certificationDetails.forEach(detailRow=>{
                            web.lists.getByTitle(ListNames.CertificationDetail).items.inBatch(certibatch).add({
                                certification:detailRow.Certification,
                                startYear:detailRow.StartYear,
                                yearOfCompletion:detailRow.YearOfCompletion,
                                institution:detailRow.InstituteName,
                                GradeOrPercent:detailRow.GradePercentage,
                                empTableIDId:empListId.EmpListID
                            });
                        });
                        certibatch.execute().then(()=>console.log("all added"))});
                    }
                    else{
                        certificationDetails.forEach(detailRow=>{
                            web.lists.getByTitle(ListNames.CertificationDetail).items.inBatch(certibatch).add({
                                certification:detailRow.Certification,
                                startYear:detailRow.StartYear,
                                yearOfCompletion:detailRow.YearOfCompletion,
                                institution:detailRow.InstituteName,
                                GradeOrPercent:detailRow.GradePercentage,
                                empTableIDId:empListId.EmpListID
                            });
                        });
                        certibatch.execute().then(()=>console.log("all added"));
                    }
                });
     }



    //End EducationDetail Section
    //Start Professional Detail Section
    getPDFormControlState(): Promise<any> {
        let pdControlsState = {} as IProfessionalDetailState;
        return this.getOptionsFromMaster(ListNames.REASONFORLEAVING, 'Title').then(statusResp => {
            pdControlsState.reasonOfLeavingOptions = statusResp;
            return pdControlsState;
        });
    }

    //End Professional Detail Section

    //Get Payroll
    getPayrollControlState(): Promise<any> {
        let payrollControlsState = {} as IPayrollState;
        return this.getDataFromList(ListNames.EMPLOYEECONTACT, 'hirvita.rajyaguru@synoverge.com').then(statusResp => {
            //payrollControlsState = statusResp;
            payrollControlsState.UserID = statusResp.UserID;
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
    PayrollAddEmployee(empReqData: IPayrollState): Promise<any> {
        let web = new Web(AppConstats.SITEURL);
        // return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.getById(empReqData.UserID).update({
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.add({
            //ESIApplicable:empReqData.ESIApplicable,
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
            console.log("Employee request created : " + mainListID);

        }).catch(error => {
            console.log("error while adding an employee");
        });
    }



}