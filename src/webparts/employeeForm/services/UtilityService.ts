import { AppConstats, ListNames } from "../AppConstants";
import Axios from "axios";

export default class BasicFormService {
    public GetEmpIdByUserEmail(email): Promise<any> {
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + ListNames.EMPLOYEECONTACT + "')/items?$select=ID&$filter=Email eq '" + email + "'";
        return Axios.get(url)
            .then(res => {
                return res.data.value[0].ID;
            }).catch(error => {
                console.log("Error while GetEmpIdByUserEmail");
                console.log(error);
            });
    }

    public getOptionsFromChoiceField(listName, columnName): Promise<any> {
        // return pnp.sp.web.fields.getByTitle("Gender").select("Choices").get().then(response => {
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + listName + "')/fields?$filter=EntityPropertyName eq '" + columnName + "'";
        return Axios.get(url)
            .then(res => {
                return res.data.value[0].Choices;
            }).catch(error => {
                console.log("Error while getOptionsFromChoiceField");
                console.log(error);
            });
    }

    public getOptionsFromMaster(listName, columnName): Promise<any> {
        //Get data from Master lists
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('" + listName + "')/items?$select=" + columnName;
        return Axios.get(url)
            .then(res => {
                if (res.data.value != undefined && res.data.value != null) {
                    return res.data.value.map(r => r[columnName]);
                }
            }).catch(error => {
                console.log('error while getOptionsFromMaster');
                console.log(error);
            });
    }

    public GetEmployeeContactListById(itemId): Promise<any> {
        //Get data from Master lists
        var url = AppConstats.SITEURL + "/_api/web/lists/GetByTitle('EmployeeContact')/items(" + itemId + ")";
        return Axios.get(url)
            .then(res => {
                if (res.data != null && res.data != undefined && res.data.ID != 0) {
                    return res.data;
                }
            }).catch(error => {
                console.log('error while getOptionsFromMaster');
                console.log(error);
            });
    }
}