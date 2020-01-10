import { IBasicDetailState } from "../state/IBasicDetailState";

export default interface IBasicFormService {
    GetEmpBasicData(): Promise<IBasicDetailState>;
}