import INewEmpRequestService from './INewEmpRequestService';
import { INewFormState } from "../state/INewFormControlsState";
// import pnp from "sp-pnp-js";
// import { ItemAddResult, Web } from "sp-pnp-js";
import axios from 'axios';
import { AppConstats, ListNames } from '../AppConstants';

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
    async AddNewEmpRequest(empData: INewFormState): Promise<any> {
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle(" + ListNames.EMPLOYEECONTACT + ")/items";
       
        var headers = {
            "accept": "application/json;odata=verbose", //It defines the Data format   
            "content-type": "application/json;odata=verbose", //It defines the content type as JSON  
            //"X-RequestDigest": $("#__REQUESTDIGEST").val()
        }
        debugger

        var data = JSON.stringify({
            '__metadata': {
                'type': 'SP.Data.EmployeeContactItem' // it defines the ListEnitityTypeName  
            },
            //Pass the parameters
            FirstName: empData.firstName,
            LastName: empData.lastName
        });
        return axios.post(url, data, { headers: headers }).then((result) => {
            debugger
            let mainListID = result.data.value.ID;
        }).catch(error => {
            console.log(error)
        });
    }
}