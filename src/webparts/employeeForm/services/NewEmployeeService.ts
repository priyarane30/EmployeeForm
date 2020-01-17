import INewEmpRequestService from './INewEmpRequestService';
import { INewFormState } from "../state/INewFormControlsState";
import { IHRState } from "../state/IHRSectionControlsState";
import { IEducationDetailState } from "../state/IEducationDetailState";
import axios from 'axios';
import { AppConstats, ListNames } from '../AppConstants';
import pnp from "sp-pnp-js";
import { sp, ItemAddResult, Web } from "sp-pnp-js";
import { IPayrollState } from '../state/IPayrollState';
import { IBasicDetailState } from '../state/IBasicDetailState';
import { ICommonState, IEmpListIdState } from '../state/ICommonState';
import { IProfessionalDetailState } from '../state/IProfessionalDetailControlState';
import { professionalDetailState } from '../reducers/ProfessionalDetailSectionReducer';
export default class NewEmployeeService implements INewEmpRequestService {


    getusingCallback: (name) => {

    };

    public getOptionsFromMaster(listName, columnName): Promise<any> {
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
    public getDataFromList(listName, EmpListID): Promise<any> {
        //Get data from Master lists

        //var url="http://intranet/_api/web/lists/GetByTitle('" + listName + "')/items?$select=*,ADLogin/Title,Manager/Title&$expand=ADLogin/Id,Manager/Id&$filter=CompanyEMail_x0020_ID eq '" + userEmail + "'";
        // var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + listName + "')/items?$select=*&$filter=CompanyEMail_x0020_ID eq '" + userEmail + "'";
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + listName + "')/items?$select=*&$filter=ID eq '" + EmpListID + "'";
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
    public getProfessionalDetails(listName, EmpListID): Promise<any> {
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + listName + "')/items?$select=*&$filter=empTableID eq '" + EmpListID + "'";
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
    public getOptionsFromChoiceField(listName, columnName): Promise<any> {
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
    public getHRFormControlState(EmpListID): Promise<any> {
        let hrControlsState = {} as IHRState;
        return this.getOptionsFromMaster(ListNames.REASONFORLEAVING, 'Title').then(statusResp => {
            hrControlsState.reasonOfLeavingOptions = statusResp;
            //'hitaxi.kachhadiya@synoverge.com'
            return this.getDataFromList(ListNames.EMPLOYEECONTACT, EmpListID).then(Resp => {
                hrControlsState.UserAlies = Resp.UserAlies;
                hrControlsState.ADLogin = Resp.ADLoginId;//'Hitaxi Kachhadiya';//Resp.ADLogin;
                hrControlsState.Manager = Resp.ManagerId;//'Krishna Soni';//Resp.Manager;
                hrControlsState.employementStatus = Resp.EmploymentStatus;
                hrControlsState.DateOfLeaving = Resp.DateOfLeaving;
                if (Resp.reasonForLeaving == null)
                    hrControlsState.reasonForLeaving = '--Select--';//Resp.reasonForLeaving;
                else
                    hrControlsState.reasonForLeaving = Resp.reasonForLeaving;
                hrControlsState.ResigntionDate = Resp.ResigntionDate;
                hrControlsState.EligibleforRehire = Resp.EligibleforRehire;//Resp.EligibleforRehire;


                return hrControlsState;
            });
        });
    }
    //Save HR FORM Data
    public HrAddNewEmployee(empReqData: IHRState, EmpListID): Promise<any> {
        let web = new Web(AppConstats.SITEURL);
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.getById(EmpListID).update({
            // return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.add({

            // return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.add({
            // userAlias: empReqData.UserAlies,
            // ADLogin: empReqData.ADLogin,
            // Manager: empReqData.Manager,
            EmploymentStatus: empReqData.employementStatus,
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
        await this.saveEducationDetails(eduData.educationDetails, empListId)
        await this.saveCertificationDetails(eduData.certificationDetails, empListId)
    }
    saveEducationDetails(educationDetails, empListId) {
        let web = new Web(AppConstats.SITEURL);
        let batch = web.createBatch()
        var url = AppConstats.SITEURL + "_api/web/lists/GetByTitle('" + ListNames.EducationDetail + "')/items?$select=ID&$filter=empTableID/ID eq " + empListId.EmpListID;
        return axios.get(url)
            .then(res => {
                if (res.data.value.length > 0) {
                    let idData = res.data.value;
                    idData.forEach(e => {

                        web.lists.getByTitle(ListNames.EducationDetail).items.getById(e["ID"]).inBatch(batch).delete()
                            .then(r => {
                                console.log("deleted");
                            });
                    });
                    batch.execute().then(() => {
                        console.log("All deleted")
                        educationDetails.forEach(detailRow => {
                            web.lists.getByTitle(ListNames.EducationDetail).items.inBatch(batch).add({
                                qualification: detailRow.DiplomaDegree,
                                grade: detailRow.Grade,
                                startYear: detailRow.Grade,
                                yearOfCompletion: detailRow.EndYear,
                                board: detailRow.Board,
                                school: detailRow.SchoolCollege,
                                degree: detailRow.DegreeName,
                                empTableIDId: empListId.EmpListID
                            });
                        });
                        batch.execute().then(() => console.log("all added"))
                    });
                }
                else {
                    educationDetails.forEach(detailRow => {
                        web.lists.getByTitle(ListNames.EducationDetail).items.inBatch(batch).add({
                            qualification: detailRow.DiplomaDegree,
                            grade: detailRow.Grade,
                            startYear: detailRow.Grade,
                            yearOfCompletion: detailRow.EndYear,
                            board: detailRow.Board,
                            school: detailRow.SchoolCollege,
                            degree: detailRow.DegreeName,
                            empTableIDId: empListId.EmpListID
                        });
                    });
                    batch.execute().then(() => console.log("all added"))

                }
            }).catch(error => {
                console.log('error while getOptionsFromMaster');
                console.log(error)
            });
    }
    saveCertificationDetails(certificationDetails, empListId) {
        let web = new Web(AppConstats.SITEURL);
        let certibatch = web.createBatch()
        var urlCerti = AppConstats.SITEURL + "_api/web/lists/GetByTitle('" + ListNames.CertificationDetail + "')/items?$select=ID&$filter=empTableID/ID eq " + empListId.EmpListID;
        return axios.get(urlCerti)
            .then(res => {
                if (res.data.value.length > 0) {
                    let idData = res.data.value;
                    idData.forEach(e => {

                        web.lists.getByTitle(ListNames.CertificationDetail).items.getById(e["ID"]).inBatch(certibatch).delete()
                            .then(r => {
                                console.log("deleted");

                            });
                    });
                    certibatch.execute().then(() => {
                        console.log("All deleted")
                        certificationDetails.forEach(detailRow => {
                            web.lists.getByTitle(ListNames.CertificationDetail).items.inBatch(certibatch).add({
                                certification: detailRow.Certification,
                                startYear: detailRow.StartYear,
                                yearOfCompletion: detailRow.YearOfCompletion,
                                institution: detailRow.InstituteName,
                                GradeOrPercent: detailRow.GradePercentage,
                                empTableIDId: empListId.EmpListID
                            });
                        });
                        certibatch.execute().then(() => console.log("all added"))
                    });
                }
                else {
                    certificationDetails.forEach(detailRow => {
                        web.lists.getByTitle(ListNames.CertificationDetail).items.inBatch(certibatch).add({
                            certification: detailRow.Certification,
                            startYear: detailRow.StartYear,
                            yearOfCompletion: detailRow.YearOfCompletion,
                            institution: detailRow.InstituteName,
                            GradeOrPercent: detailRow.GradePercentage,
                            empTableIDId: empListId.EmpListID
                        });
                    });
                    certibatch.execute().then(() => console.log("all added"));
                }
            });
    }
    //End EducationDetail Section

    //Start Professional Detail Section
    public getIsFreshers(EmpListID): Promise<any> {
        let freshervalue = {} as IProfessionalDetailState
        debugger
        return this.getDataFromList(ListNames.EMPLOYEECONTACT, EmpListID).then(Resp => {
            freshervalue.IsFresher = Resp.Fresher
            debugger
            return freshervalue;
        })
    }

    public getProfessionalDetailsFromList(listName, EmpListID): Promise<any> {
        let payLoadArrayOrganizationDetails = [];
        return this.getProfessionalDetails(listName, EmpListID)
            .then((resp) => {
                return this.getOptionsFromMaster(ListNames.REASONFORLEAVING, 'Title')
                    .then((reasonResp) => {
                        resp.forEach(element => {
                            payLoadArrayOrganizationDetails.push({
                                organization: element.organization,
                                designation: element.designation,
                                startDate: element.startDate,
                                endDate: element.endDate,
                                reportingTo: element.reportingTo,
                                reportingDesignation: element.reportingDesignation,
                                totalExp: element.totalExp,
                                reasonForLeaving: element.reasonForLeaving,
                                reasonOfLeavingOptions: reasonResp
                            })
                        });
                        console.log("service Professional Details" + payLoadArrayOrganizationDetails)
                        return payLoadArrayOrganizationDetails
                    });
            });
    }

    public getTechnicalDetailsFromList(listName, EmpListID): Promise<any> {
        let payLoadArrayTechnologyDetails = [];
        return this.getProfessionalDetails(listName, EmpListID)
            .then((resp) => {
                return this.getOptionsFromMaster(ListNames.TECHNOLOGY, 'Title')
                    .then((techResp) => {
                        resp.forEach(element => {
                            payLoadArrayTechnologyDetails.push({
                                Technology: element.Technology,
                                SinceWhen: element.SinceWhen,
                                Expertise: element.Expertise,
                                InstituteName: element.institution,
                                Rating: element.Rating,
                                technologyOptions: techResp
                            })
                        });
                        return payLoadArrayTechnologyDetails
                    });
            });
    }

    //Save Professional Details
    async saveProfessionalDetailInList(professionalDetailData: IProfessionalDetailState, EmpListID) {
        await this.saveIsFresher(professionalDetailData, EmpListID)
        if (professionalDetailData.IsFresher == true) {
            this.saveTechnologyDetail(professionalDetailData.technologyDetails, EmpListID);
        } else {
            this.saveOrgenizationDetail(professionalDetailData.organizationDetails, EmpListID);
        }
    }
    public saveIsFresher(professionalDetailData: IProfessionalDetailState, empListID) {
        let web = new Web(AppConstats.SITEURL);
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.getById(empListID.EmpListID).update({
            Fresher: professionalDetailData.IsFresher
        }).then((result: ItemAddResult) => {
            let mainListID = result.data.Id;
            console.log("Employee request created : " + mainListID);

        }).catch(error => {
            console.log("error while adding an employee");
        });
    }

    public saveOrgenizationDetail(organizationDetails, empListID) {
        let web = new Web(AppConstats.SITEURL);
        // var url = AppConstats.SITEURL + "_api/web/lists/GetByTitle('" + ListNames.PROFESSIONALHISTORY + "')/items?$select=ID&$filter=empTableID/ID eq " + empListID.EmpListID;
        // return axios.get(url)
        //     .then(res => {
        //         if (res.data.value.length > 0) {
        //             let idData = res.data.value;
        //         }
        //         else {
        organizationDetails.forEach(detailRow => {
            web.lists.getByTitle(ListNames.PROFESSIONALHISTORY).items.add({
                organization: detailRow.organization,
                designation: detailRow.designation,
                startDate: detailRow.startDate,
                endDate: detailRow.endDate,
                reportingTo: detailRow.reportingTo,
                reportingDesignation: detailRow.reportingDesignation,
                totalExp: detailRow.totalExp,
                reasonForLeaving: detailRow.reasonForLeaving,
                empTableID: empListID.EmpListID
            }).then((result: ItemAddResult) => {
                let mainListID = result.data.Id;
                console.log("Employee request created : " + mainListID);

            }).catch(error => {
                console.log("error while adding an employee");
            });
        });
        //     }
        // })
    }

    public saveTechnologyDetail(technologyDetails, empListID) {
        debugger
        let web = new Web(AppConstats.SITEURL);
        // var url = AppConstats.SITEURL + "_api/web/lists/GetByTitle('" + ListNames.PROFESSIONALHISTORY + "')/items?$select=ID&$filter=empTableID/ID eq " + empListID.EmpListID;
        // return axios.get(url)
        //     .then(res => {
        //         if (res.data.value.length > 0) {
        //             let idData = res.data.value;
        //         }
        //         else {
        debugger
        technologyDetails.forEach(detailRow => {
            debugger
            web.lists.getByTitle(ListNames.EMPLOYEETECHNICALSKILL).items.add({
                Technology: detailRow.Technology,
                SinceWhen: detailRow.SinceWhen,
                Expertise: detailRow.Expertise,
                Rating: detailRow.Rating,
                empTableID: empListID.EmpListID
            }).then((result: ItemAddResult) => {
                let mainListID = result.data.Id;
                console.log("Employee request created : " + mainListID);

            }).catch(error => {
                console.log("error while adding an employee");
            });
        });
        //     }
        // })

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