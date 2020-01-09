import * as React from 'react';
import styles from './EmployeeForm.module.scss';
import { IEmployeeFormProps } from './IEmployeeFormProps';
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import EmployeeDetail from '../components/tabs/EmployeeDetail';
import EducationDetail from '../components/tabs/EducationDetail';
import ProfessionalDetail from '../components/tabs/ProfessionalDetail';
import HRDetail from '../components/tabs/HRDetail';
import PayrollDetail from '../components/tabs/PayrollDetail';
import { Provider } from 'react-redux';
import { store } from "../store/ConfigureStore";

export default class EmployeeForm extends React.Component<IEmployeeFormProps, {}> {
  public render(): React.ReactElement<IEmployeeFormProps> {
    return (
      <Provider store={store}>
        <div className={styles.employeeForm}>
          <div className={styles.container}>
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
                <HRDetail />
              </PivotItem>
              <PivotItem headerText="Payroll Detail">
                <PayrollDetail />
              </PivotItem>
            </Pivot>
          </div>
        </div>
      </Provider>
    );
  }
}
