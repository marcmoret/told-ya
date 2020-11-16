export interface Argument {
  id?: string;
  numbers: Array<string>;
  personA: string;
  personB: string;
  argumentA: string;
  argumentB: string;
  votesA: number;
  votesB: number;
  voter0?: boolean;
  topic: string;
  message: string;
  createdDate: Date;
}
