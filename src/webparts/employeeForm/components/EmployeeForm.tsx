import * as React from 'react';
import styles from './EmployeeForm.module.scss';
import { IEmployeeFormProps } from './IEmployeeFormProps';
import { Pivot, PivotItem, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
import BasicDetail from '../components/tabs/BasicDetail';
import EmployeeDetail from '../components/tabs/EmployeeDetail';
import EducationDetail from './tabs/EducationDetail';
import ProfessionalDetail from '../components/tabs/ProfessionalDetail';
import HRDetail from '../components/tabs/HRDetail';
import PayrollDetail from '../components/tabs/PayrollDetail';
import { Provider } from 'react-redux';
import { store } from "../store/ConfigureStore";
import { SpinnerComponent } from '../components/Fabric Components/Spinner';

export default class EmployeeForm extends React.Component<IEmployeeFormProps, any>{
  constructor(props) {
    super(props);
    this.state = {
      isEmpIdExists: false,
      selectedKey: 0,
      isSpinnerHidden: true,
      isUserHR: false
    };
    this.showTabs = this.showTabs.bind(this);
    this._handleTabClick = this._handleTabClick.bind(this);
    this._TabClick = this._TabClick.bind(this);
    this._handleSpinner = this._handleSpinner.bind(this);
  }

  _handleSpinner(flagShow): void {
    this.setState({ isSpinnerHidden: flagShow });
  }

  public async showTabs(empId, isExistsInHR) {
    if (empId != null && empId != undefined && empId.EmpListID > 0)
      await this.setState({ isEmpIdExists: true });
    if (isExistsInHR)
      await this.setState({ isUserHR: true });
  }

  public render(): React.ReactElement<IEmployeeFormProps> {
    return (
      <Provider store={store}>
        <div className={styles.employeeForm}>
          <div className={styles.container} >
            {!this.state.isSpinnerHidden ? <SpinnerComponent /> : ""}
            <div>
              <BasicDetail handleSpinner={this._handleSpinner} empEmail={this.props.userEmail} showTabs={this.showTabs} context={this.props.context} />
            </div>
            {this.IsEmpIdExists()}
          </div>
        </div>
      </Provider>
    );
  }

  public _handleTabClick(): void {
    this.setState({ selectedKey: (Number(this.state.selectedKey) + 1) % 5 });
  }

  private _TabClick = (item: PivotItem): void => {
    this.setState({
      selectedKey: item.props.itemKey
    });
  }

  private ShowHRTab() {
    if (this.state.isUserHR) {
      return (
        <PivotItem headerText="HR Detail" itemKey="3">
          <HRDetail context={this.props.context} handleTabClick={this._handleTabClick} handleSpinner={this._handleSpinner} />
        </PivotItem>
      );
    }
  }

  private ShowPayrollTab() {
    if (this.state.isUserHR) {
      return (
        <PivotItem headerText="Payroll Detail" itemKey="4">
          <PayrollDetail handleTabClick={this._handleTabClick} handleSpinner={this._handleSpinner} />
        </PivotItem>
      );
    }
  }

  private IsEmpIdExists() {
    if (this.state.isEmpIdExists)
      return (
        <Pivot aria-label="Employee Form" linkFormat={PivotLinkFormat.tabs} selectedKey={`${this.state.selectedKey}`} onLinkClick={this._TabClick} >
          <PivotItem headerText="Employee Details" itemKey="0"  >
            <EmployeeDetail handleTabClick={this._handleTabClick} handleSpinner={this._handleSpinner} />
          </PivotItem>
          <PivotItem headerText="Education Details" itemKey="1">
            <EducationDetail handleTabClick={this._handleTabClick} handleSpinner={this._handleSpinner} />
          </PivotItem>
          <PivotItem headerText="Professional Detail" itemKey="2">
            <ProfessionalDetail handleTabClick={this._handleTabClick} handleSpinner={this._handleSpinner} />
          </PivotItem>
          {this.ShowHRTab()}
          {this.ShowPayrollTab()}
        </Pivot>
      );
  }
}

