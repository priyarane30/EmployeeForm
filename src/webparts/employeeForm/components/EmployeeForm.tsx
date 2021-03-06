import * as React from 'react';
import styles from './EmployeeForm.module.scss';
import { IEmployeeFormProps } from './IEmployeeFormProps';
import { Pivot, PivotItem, PivotLinkFormat ,PivotLinkSize} from 'office-ui-fabric-react/lib/Pivot';
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
      isUserHR: false,
      isDisableToUser:false
    };
    this.showTabs = this.showTabs.bind(this);
    this._handleTabClick = this._handleTabClick.bind(this);
    this._TabClick = this._TabClick.bind(this);
    this._handleSpinner = this._handleSpinner.bind(this);
    this.AssignedToHR = this.AssignedToHR.bind(this);
  }

  public _handleSpinner(flagShow): void {
    this.setState({ isSpinnerHidden: flagShow });
  }
  public AssignedToHR(employmentStatus){
    if(employmentStatus=="Inactive"){
    this.setState({isDisableToUser:true})}
  }

  public async showTabs(empId, isExistsInHR) {
    
    if (empId != null && empId != undefined && empId.EmpListID > 0)
      await this.setState({ isEmpIdExists: true });
    if (isExistsInHR)
      await this.setState({ isUserHR: true });
  }

  public render(): React.ReactElement<IEmployeeFormProps> {
    return (
      
      <Provider store={store} >
        <div className={styles.employeeForm}>
          <div className={styles.container} >
            {!this.state.isSpinnerHidden ? <SpinnerComponent /> : ""}
            <div >
              <Pivot aria-label="Employee Form" linkFormat={PivotLinkFormat.tabs} linkSize={PivotLinkSize.large}  selectedKey={`${this.state.selectedKey}`} onLinkClick={this._TabClick} style={{width:'16px !important;' }}  >
                <PivotItem headerText="Basic Details" itemKey="0" >
                  <BasicDetail  isDisabledToUser={this.state.isDisableToUser} handleTabClick={this._handleTabClick} handleSpinner={this._handleSpinner} empEmail={this.props.userEmail} showTabs={this.showTabs} context={this.props.context} forceRenderTabPanel={true} assignedToHR={this.AssignedToHR}/>
                </PivotItem>
                <PivotItem headerText="Employee Details" itemKey="1"  >
                  <EmployeeDetail handleTabClick={this._handleTabClick} isDisabledToUser={this.state.isDisableToUser} handleSpinner={this._handleSpinner} isUserHR={this.state.isUserHR} />
                </PivotItem>
                <PivotItem headerText="Education Details" itemKey="2">
                  <EducationDetail handleTabClick={this._handleTabClick} isDisabledToUser={this.state.isDisableToUser} handleSpinner={this._handleSpinner} isUserHR={this.state.isUserHR} />
                </PivotItem>
                <PivotItem headerText="Professional Detail" itemKey="3">
                  <ProfessionalDetail handleTabClick={this._handleTabClick} isDisabledToUser={this.state.isDisableToUser} handleSpinner={this._handleSpinner} isUserHR={this.state.isUserHR} />
                </PivotItem>
                {this.ShowHRTab()}
                {this.ShowPayrollTab()}
              </Pivot>
            </div>
            {/* {this.IsEmpIdExists()} */}
          </div>
        </div>
      </Provider>
    );
  }

  public _handleTabClick(): void {
    this.setState({ selectedKey: (Number(this.state.selectedKey) + 1) % 6 });
  }

  private _TabClick = (item: PivotItem): void => {
    this.setState({
      selectedKey: item.props.itemKey
    });
  }

  private ShowHRTab() {
    if (this.state.isUserHR) {
      return (
        <PivotItem headerText="HR Detail" itemKey="4">
          <HRDetail context={this.props.context} handleTabClick={this._handleTabClick} handleSpinner={this._handleSpinner} />
        </PivotItem>
      );
    }
  }
  private ShowPayrollTab() {
    if (this.state.isUserHR) {
      return (
        <PivotItem headerText="Payroll Detail" itemKey="5">
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

