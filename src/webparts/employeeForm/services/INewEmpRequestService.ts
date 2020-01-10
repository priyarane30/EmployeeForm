import { INewFormState } from '../state/INewFormControlsState';
import { IHRState } from '../state/IHRSectionControlsState';
// Represents the service to interact with SharePoint to work with employee detail request.
export default interface INewEmpRequestService {
    //Start Employee Detail Form
    getNewFormControlState(): Promise<any>;

    AddNewEmpRequest(empData: INewFormState): Promise<any>;
    //End  Employee Detail Form
    //public myCallback: (name: type) => returntype;
    getusingCallback: (name: string) => object;

    //Start HR Section
    getHRFormControlState(): Promise<any>;

    HrAddNewEmployee(empReqData: IHRState): Promise<any>;
    getHRFormlistControlState(): Promise<any>;
    //End HR Section

    /**End HR Section*/
    getPDFormControlState(): Promise<any>;
    /**End HR Section*/
    /**
     class CallbackTest
        {
            public myCallback: () => void;

            public doWork(): void
            {
                //doing some work...
                this.myCallback(); //calling callback
            }
        }
     */
}
