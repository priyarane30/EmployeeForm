export const AppConstats = {
    SITEURL: 'https://synoverge.sharepoint.com/', //sites/leadership-connection/

};

export const ListNames = {
    EMPLOYEECONTACT: 'EmployeeContact',
    DESIGNATION: 'Designation',
    TECHNOLOGY: 'TechnologyList',
    CHILDDETAILS: 'ChildDetails',
    VISADETAILS: 'VisaDetails',
    REASONFORLEAVING: 'ReasonForLeaving',
    EducationDetail: 'EducationalDetails',
    CertificationDetail: 'Certificationdetails',
    PROFESSIONALHISTORY: 'ProfessionalHistory',
    EMPLOYEETECHNICALSKILL: 'EmployeeTechnicalSkill'
};

export const ActionTypes = {
    GetDefaultFormControls: 'GET_DEFAULT_FORM_CONTROLS',
    GetBasicFormControls: 'GET_BASIC_FORM_CONTROLS',
    //HR Details Start
    GetHRFormControls: 'GET_HR_FORM_CONTROLS',
    AddValueFromHR: 'ADD_VALUE_FROM_HR',
    //HR Details End
    SetInitialFormState: 'SET_INITIAL_FORM_STATE',
    AddNewEmployee: 'ADD_NEW_EMPLOYEE',
    SetTabName: 'SET_TAB',
    GetEmpID: 'GET_EMP_ID',
    SetEmpID: 'SET_EMP_ID',
    RemoveChildDetailRow: 'REMOVE_CHILD_DETAIL_ROW',
    AddChildDetailRow: 'ADD_CHILD_DETAIL_ROW',
    //education details form
    SetInitialEduDetailFormState: 'SET_INITIAL_EDUDETAIL_FORM_STATE',
    SetInitialCertiDetailFormState: 'SET_INITIAL_CERTIDETAIL_FORM_STATE',
    RemoveEducationDetailRow: 'REMOVE_EDUCATIONDETAIL_ROW',
    AddEducationDetailRow: 'ADD_NEW_EDUCATION_ROW',
    AddCertiDetailRow: 'ADD_NEW_CERTIDETAIL_ROW',
    RemoveCertiDetailRow: 'REMOVE_CERTIDETAIL_ROW',
    GetPdFromControls: 'GET_PD_FORM_CONTROLS',
    GetPayrollFormControls: 'GET_PAYROLL_FORM_CONTROLS',
    PayrollAddNewEmployee: 'ADD_PAYROLL_DATA',
    //PROFESSIONAL DETAIL FORM 
    GetProfessionalDetailForm: 'GET_PROFESSIONALDETAIL_FORM_CONTROLS',
    AddProfessionalDetailValue: 'ADD_PROFESSIONALDETAILS_VALUE',
    SetInitialProfessionalDetailFormState: 'SET_INITIAL_PROFESSIONALDETAIL_FORM_STATE',
    AddProfessionalDetailRow: 'ADD_NEW_PROFESSIONAL_DETAIL_ROW',
    RemoveProfessionalDetailRow: 'REMOVE_PROFESSIONALDETAIL_ROW',
    SetInitialTechnologyFromState: 'SET_INITIAL_TECHNOLOGY_FORM_STATE',
    AddTechnologyDetailRow: 'ADD_NEW_TECHNOLOGY_ROW',
    RemoveTechnologyRow: 'REMOVE_TECHNOLOGY_ROW',
    AddValueFromPayroll: 'ADD_PAYROLL_DATA',
    AddVisaDetailRow: 'ADD_VISA_DETAIL_ROW',
    RemoveVisaDetailRow: 'REMOVE_VISA_DETAIL_ROW'
};