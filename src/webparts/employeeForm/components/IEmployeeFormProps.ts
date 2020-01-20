import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
export interface IEmployeeFormProps {
  description: string;
  siteUrl:string;
  spHttpClient: SPHttpClient;
  userEmail:string;
  context: WebPartContext;
}
