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
      isEmpIdExists: false,
    };
    this.showTabs = this.showTabs.bind(this);

    this.state = {
      selectedKey: 0
    };
    this._handleTabClick = this._handleTabClick.bind(this);
    this._TabClick = this._TabClick.bind(this);
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

  _handleTabClick(): void {
    this.setState({ selectedKey: (this.state.selectedKey + 1) % 5 });
  }

  private _TabClick = (item: PivotItem): void => {
    this.setState({
      selectedKey: item.props.itemKey
    });
  };


  private IsEmpIdExists() {
    if (this.state.isEmpIdExists)
      return (
        <Pivot aria-label="Employee Form" selectedKey={`${this.state.selectedKey}`} onLinkClick={this._TabClick} >
          <PivotItem headerText="Employee Details" itemKey="0"  >
            <EmployeeDetail handleTabClick={this._handleTabClick} />
          </PivotItem>
          <PivotItem headerText="Education Details" itemKey="1">
            <EducationDetail handleTabClick={this._handleTabClick} />
          </PivotItem>
          <PivotItem headerText="Professional Detail" itemKey="2">
            <ProfessionalDetail handleTabClick={this._handleTabClick} />
          </PivotItem>
          <PivotItem headerText="HR Detail" itemKey="3">
            <HRDetail context={this.props.context} handleTabClick={this._handleTabClick} />
          </PivotItem>
          <PivotItem headerText="Payroll Detail" itemKey="4">
            <PayrollDetail handleTabClick={this._handleTabClick} />
          </PivotItem>
        </Pivot>
      );
  }
}
