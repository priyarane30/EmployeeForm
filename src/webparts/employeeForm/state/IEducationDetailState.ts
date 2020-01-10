
export interface IEducationDetailState {
  educationDetails: Array<
    {
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
  {
      Certification: string;
      StartYear: string;
      YearOfCompletion: string;
      InstituteName: string;
      GradePercentage: string;
    }>
  }
