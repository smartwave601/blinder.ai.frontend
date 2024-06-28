import { NumericLiteral } from 'typescript';
import moment, { Moment } from 'moment';

export type Dimension = number | string;

export type ChartData = number[];

export type xData = number[] | string[];

export type LanguageType = 'de' | 'en';

export type ThemeType = 'light' | 'dark';

export interface ChartSeries {
  seriesName: string;
  value: number;
  data: {
    day: number;
    value: NumericLiteral;
  };
  name: string;
}

export type ChartSeriesData = ChartSeries[];

export type Severity = 'success' | 'error' | 'info' | 'warning';

export type TwoFactorAuthOption = 'email' | 'phone';

export type ActivityStatusType = 'sold' | 'booked' | 'added';

export enum CurrencyTypeEnum {
  USD = 'USD',
  ETH = 'ETH',
  BTC = 'BTC',
}

export interface PaymentCard {
  cvc: string;
  expiry: string;
  name: string;
  number: string;
  // eslint-disable-next-line
  focused: any;
  background: string;
  isEdit: boolean;
}

export interface SearchData {
  keyword: string;
  type: string;    // "search" or "fetch"
  userID?: string;
}

export interface CertformData {
  dataType?: string;
  natureOfWork?: string;
  workDescription?: string;
  creationDate?: string;
  author?: string;
  ownershipDetails?: string;
  publicationStatus?: string;
  priorVersions?: string;
  thirdPartyContent?: string;
  intendedUse?: string;
  registrationObjectives?: string;
  digitalContent?: string;
  externalAgreement?: string;
}


export interface ChatGPTPostData {
  cert?: CertformData;
  prevID?: string;
  prompt?: string;
  userID?: string;
}


