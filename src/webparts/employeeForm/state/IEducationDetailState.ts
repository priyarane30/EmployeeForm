
export interface IEducationDetailState {
  educationDetails: Array<
    { educationId:number;
      DiplomaDegree: string;
      Grade: string;
      StartYear: string;
      EndYear: string;
      Board: string;
      SchoolCollege: string;
      DegreeName: string;
    }
  >
  certificationDetails: Array<
  {   certificationId:number;
      Certification: string;
      StartYear: string;
      YearOfCompletion: string;
      InstituteName: string;
      GradePercentage: string;
    }>
  }
