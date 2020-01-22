import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'EmployeeFormWebPartStrings';
import EmployeeForm from './components/EmployeeForm';
import { IEmployeeFormProps } from './components/IEmployeeFormProps';

export interface IEmployeeFormWebPartProps {
  description: string;
}

export default class EmployeeFormWebPart extends BaseClientSideWebPart<IEmployeeFormWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IEmployeeFormProps> = React.createElement(
      
      EmployeeForm,
      {
        description: this.properties.description,
        siteUrl:this.context.pageContext.web.absoluteUrl,
        spHttpClient:this.context.spHttpClient,
        userEmail:this.context.pageContext.user.loginName,
        context: this.context,
        userPermissions : this.context.pageContext.web.permissions

      }
    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }


}
