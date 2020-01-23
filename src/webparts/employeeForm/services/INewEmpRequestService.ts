import { INewFormState } from '../state/INewFormControlsState';
import { IHRState } from '../state/IHRSectionControlsState';
// Represents the service to interact with SharePoint to work with employee detail request.
export default interface INewEmpRequestService {
    
    //Start Employee Detail Form
    getNewFormControlState(EmpListId): Promise<any>;
    AddEmpFormData(empData: INewFormState,EmpListId): Promise<any>;

    /**Start HR Section*/
    //get value from List where id =EmpListID
    getHRFormControlState(EmpListID): Promise<any>;
    HrAddNewEmployee(empReqData: IHRState,managerdata, EmpListID): Promise<any>; //Save value in EmpListID


    /**Start PayRoll Details Section*/
    getProfessionalDetailsFromList(listName, EmpListID): Promise<any>;
    getTechnicalDetailsFromList(listName, EmpListID): Promise<any>;
    /**End PayRoll Details Section*/
}
