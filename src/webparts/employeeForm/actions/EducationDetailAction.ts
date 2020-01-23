import { ICommonState } from '../state/ICommonState';
import { ActionTypes, ListNames } from '../AppConstants';
import NewEmpService from '../services/NewEmployeeService';

//gets initial value for all controls in the form
export  function GetInitialControlValuesAction(EmpListID) {
    return dispatch => {
        let newEmpServiceObj: NewEmpService = new NewEmpService();
        let payLoadArrayEducationDetail=[];
        let payLoadArrayCertificationDetail=[];
       
       //gets already set education details for user
        newEmpServiceObj.getMultipleDataFromListUsingParentID(ListNames.EducationDetail, EmpListID)
        .then((resp) => {
            resp.forEach(element => {
                payLoadArrayEducationDetail.push({
                educationId:element.ID,
                DiplomaDegree:element.qualification,
                Grade:element.grade,
                StartYear:element.startYear,
                EndYear:element.yearOfCompletion,
                Board:element.board,
                SchoolCollege:element.school,
                DegreeName:element.degree});     
            });
            dispatch({
                type:ActionTypes.SetInitialEduDetailFormState,
                payload:payLoadArrayEducationDetail
            });
        });


        //get already existing certification details for user
        newEmpServiceObj.getMultipleDataFromListUsingParentID(ListNames.CertificationDetail,EmpListID)
        .then((resp)=>{
            resp.forEach(element=>{
                payLoadArrayCertificationDetail.push({
                    certificationId:element.ID,
                    Certification: element.certification,
                    StartYear: element.startYear,
                    YearOfCompletion: element.yearOfCompletion,
                    InstituteName: element.institution,
                    GradePercentage: element.GradeOrPercent
                });
                dispatch({
                    type:ActionTypes.SetInitialCertiDetailFormState,
                    payload:payLoadArrayCertificationDetail
                });
            });

        });
    }; 
}

export function SetTabName(tabData: ICommonState) {
    return ({
        type: "SET_TAB",
        payload: tabData
    });
}

//add rows in detail grids
export function addEducationDetailRow(section){
    var actionObj;
        if(section=="educationDetails")
        {
        //add row in education detail grid
        let initialEducationDetailGrid=
        {   educationId:0,
            DiplomaDegree: "",
            Grade: "",
            StartYear: "",
            EndYear: "",
            Board: "",
            SchoolCollege:"",
            DegreeName:"" 
         };

         actionObj = {
              type:ActionTypes.AddEducationDetailRow,
              payload:initialEducationDetailGrid
          };
          
        }
        //add row in certification detail grid
        else{
            let initialCertificationDetailGrid={
                certificationId:0,
                Certification: '',
                StartYear: '',
                YearOfCompletion: '',
                InstituteName: '',
                GradePercentage: ''
            };
            actionObj = {
                type:ActionTypes.AddCertiDetailRow,
                payload:initialCertificationDetailGrid
            };
        }

        return actionObj;
    }

//remove rows from detail grids
export function removeEducationDetailRow(removeditem,section,index){
    return dispatch=>{
        let newEmpServiceObj: NewEmpService = new NewEmpService(); 
       if(section=="educationDetails"){
        newEmpServiceObj.deleteDataFromListUsingID(removeditem.educationId,ListNames.EducationDetail); 
        dispatch({
              type:ActionTypes.RemoveEducationDetailRow,
              payload:index
          });}
        //remove row from certification detail rows
        else{
            newEmpServiceObj.deleteDataFromListUsingID(removeditem.certificationId,ListNames.CertificationDetail);
            dispatch({
                type:ActionTypes.RemoveCertiDetailRow,
                payload:index
            });
        }
    };
}
