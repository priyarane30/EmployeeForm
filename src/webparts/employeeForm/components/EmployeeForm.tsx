import * as React from 'react';
import styles from './EmployeeForm.module.scss';
import { IEmployeeFormProps } from './IEmployeeFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import EmployeeDetail from '../components/tabs/EmployeeDetail';
import EducationDetail from '../components/tabs/EducationDetail';
import ProfessionalDetail from '../components/tabs/ProfessionalDetail';
import HRDetail from '../components/tabs/HRDetail';
import PayrollDetail from '../components/tabs/PayrollDetail';
import { Provider, connect } from 'react-redux';
import { store } from "../store/ConfigureStore";
import { SetTabName, GetInitialControlValuesAction, AddNewEmployee } from "./../actions/NewFormControlsValuesAction";
import { ICommonState } from './../state/ICommonState';
interface INewFormConnectedDispatch {
  setTabName: (tabName: ICommonState) => void;

  // Gets the options for dropdown fields
  getDefaultControlsData: () => void;

  //save data
  // addNewEmployee: (empData: INewFormState) => void;
}
class EmployeeForm extends React.Component<IEmployeeFormProps, {}> {

  componentDidMount() {
    //this.props.getDefaultControlsData();
  }

  public render(): React.ReactElement<IEmployeeFormProps> {
    console.log(store.getState())
    return (
      <Provider store={store}>
        <div className={styles.employeeForm}>
          <div className={styles.container}>
            {/* <div>{store.getState().} </div> */}
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
const mapStateToProps = function (state) {
  console.log(state)
  return state;
}

// Maps dispatch to props
const mapDispatchToProps = (dispatch): INewFormConnectedDispatch => {
  return {
    setTabName: (tabData: ICommonState) => {
      return dispatch(SetTabName(tabData))
    },
    getDefaultControlsData: () => {
      return dispatch(GetInitialControlValuesAction());
    },
    // addNewEmployee: (empData: INewFormState) => {
    //     return dispatch(AddNewEmployee(empData));
    // }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeForm);
