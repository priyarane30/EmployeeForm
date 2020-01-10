import INewEmpRequestService from './INewEmpRequestService';
import { INewFormState } from "../state/INewFormControlsState";
import { IHRState } from "../state/IHRSectionControlsState";
import { IEducationDetailState } from "../state/IEducationDetailState";
import { IProfessionalDetailState } from "../state/IProfessionalDetailControlState";
import axios from 'axios';
import { AppConstats, ListNames } from '../AppConstants';
import pnp from "sp-pnp-js";
import { sp, ItemAddResult, Web } from "sp-pnp-js";

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
     getDataFromList(listName,userEmail): Promise<any> {
        //Get data from Master lists
        var url =AppConstats.SITEURL + "_api/web/lists/GetByTitle('" + listName + "')/items?$select=*&$filter=CompanyEMail_x0020_ID eq '"+userEmail+"'" ;
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

                // empData.childDetailItems.forEach(child => {
                //     web.lists.getByTitle("PurchaseRequestItems").items.inBatch(batch).add({
                //         ProductCode: child.ChildName,
                //         Quantity: child.DateOfBirth,
                //         RequestID: mainListID
                //     });
                // });

                // batch.execute().then(() => {
                //     console.log("children details added to the list....");
                // });
            }
            // else {
            //     alert('Select atleast one purchase item.');
            // }
        }).catch(error => {
            console.log("error while adding an employee");
        });
    }

    //Start HR Section

    //Get HR
    getHRFormControlState(): Promise<any> {
        let hrControlsState = {} as IHRState;
        return this.getOptionsFromMaster(ListNames.REASONFORLEAVING, 'Title').then(statusResp => {
            hrControlsState.reasonOfLeavingOptions = statusResp;
            return hrControlsState;
        });
    }
    //Save HR
    HrAddNewEmployee(empReqData: IHRState): Promise<any> {
        debugger
        let web = new Web(AppConstats.SITEURL);
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.add({
            userAlias:empReqData.userAlias,
            ADLogin:empReqData.ADLogin,
            Manager: empReqData.Manager,
            employementStatus: empReqData.employementStatus,
            DateOfLeaving: empReqData.DateOfLeaving,
            reasonForLeaving: empReqData.reasonForLeaving,
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
    getEduDataFromList(listName,userEmail): Promise<any> {
        //Get data from Master lists
        debugger;
        var url =AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + listName + "')/items?$select=*&$filter=empTableID/CompanyEMail_x0020_ID eq '"+userEmail+"'" ;
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

    saveEduDataInList(educationData: IEducationDetailState,userEmail): Promise<any> {
       debugger;
      
       let web = new Web(AppConstats.SITEURL);
       let batch= web.createBatch()
        return web.lists.getByTitle(ListNames.EMPLOYEECONTACT).items.select("ID","CompanyEMail_x0020_ID").getAll().then((items: any[])=>{
            //gets the main list id for acessing child list
            let mainListID = items.filter(element=>(element.CompanyEMail_x0020_ID==userEmail))[0].ID
           
           
                var url =AppConstats.SITEURL + "_api/web/lists/GetByTitle('" + ListNames.EducationDetail + "')/items?$select=ID&$filter=empTableID/ID eq " +mainListID ;
                return axios.get(url)
                    .then(res => {
                        if (res.data.value != undefined && res.data.value != null) {
                            let idData=  res.data.value;
                            idData.forEach(e => {e["ID"]
                                
                            });
                        }
                    }).catch(error => {
                        console.log('error while getOptionsFromMaster');
                        console.log(error)
                    });
                
               
            })
            
    }
    saveEducationDetails(mainListID){}
    saveCertificationDetails(mainListID){}



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
}