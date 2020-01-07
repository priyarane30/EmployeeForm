import { SPHttpClient } from '@microsoft/sp-http';
export interface IEmployeeFormProps {
  description: string;
  siteUrl:string;
  spHttpClient: SPHttpClient;
}
