import { string } from "prop-types";

export interface IEducationDetailState {
  educationDetails: IEducationDetails[];
  certificationDetails: ICertificationDetails[];
}
export interface IEducationDetails {
  DiplomaDegree: string;
  Grade: string;
  StartYear: string;
  EndYear: string;
  Board: string;
  SchoolCollege: string;
  DegreeName: string;
}
export interface ICertificationDetails {
  Certification: string;
  StartYear: string;
  YearOfCompletion: string;
  InstituteName: string;
  GradePercentage: string;
}
