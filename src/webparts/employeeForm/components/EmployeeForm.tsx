import * as React from 'react';
import styles from './EmployeeForm.module.scss';
import { IEmployeeFormProps } from './IEmployeeFormProps';
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import BasicDetail from '../components/tabs/BasicDetail';
import EmployeeDetail from '../components/tabs/EmployeeDetail';
import EducationDetail from './tabs/EducationDetail';
import ProfessionalDetail from '../components/tabs/ProfessionalDetail';
import HRDetail from '../components/tabs/HRDetail';
import PayrollDetail from '../components/tabs/PayrollDetail';
import { Provider } from 'react-redux';
import { store } from "../store/ConfigureStore";

export default class EmployeeForm extends React.Component<IEmployeeFormProps, any>{

  constructor(props) {
    super(props);
    this.state = {
      isEmpIdExists: false
    };
    this.showTabs = this.showTabs.bind(this);
  }

  public async showTabs(empId) {
    if (empId != null && empId != undefined && empId.EmpListID > 0)
      await this.setState({ isEmpIdExists: true });
  }

  public render(): React.ReactElement<IEmployeeFormProps> {
console.log(this.props.context)
    return (
      <Provider store={store}>
        <div className={styles.employeeForm}>
          <div className={styles.container}>
            <div>
              <BasicDetail empEmail={this.props.userEmail} showTabs={this.showTabs} />
            </div>
            {this.IsEmpIdExists()}
          </div>
        </div>
      </Provider>
    );
  }

  private IsEmpIdExists() {
    if (this.state.isEmpIdExists)
      return (
        <Pivot aria-label="Employee Form">
          <PivotItem headerText="Employee Details">
            <EmployeeDetail />
          </PivotItem>
          <PivotItem headerText="Education Details">
            <EducationDetail />
          </PivotItem>
          <PivotItem headerText="Professional Detail">
            <ProfessionalDetail />
          </PivotItem>
          <PivotItem headerText="HR Detail">
            <HRDetail context={this.props.context}/>
          </PivotItem>
          <PivotItem headerText="Payroll Detail">
            <PayrollDetail />
          </PivotItem>
        </Pivot>
      );

  }
}
