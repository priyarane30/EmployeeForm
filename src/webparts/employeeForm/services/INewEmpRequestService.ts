import { INewFormState } from '../state/INewFormControlsState';

// Represents the service to interact with SharePoint to work with employee detail request.
export default interface INewEmpRequestService {
    getNewFormControlState(): Promise<any>;

    AddNewEmpRequest(empData: INewFormState): Promise<any>;

    //public myCallback: (name: type) => returntype;
    getusingCallback: (name: string) => object;

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
