import { httpApi } from '@app/api/http.api';
// import './mocks/auth.api.mock';
import { UserModel } from '@app/domain/UserModel';
import { CertformData, ChatGPTPostData, SearchData } from "@app/interfaces/interfaces";
import axios from "axios";
import { CoronaData } from "@app/api/covid.api";
import {BlinderAPIBasePath} from "@app/constants/global";

export interface AuthData {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface SecurityCodePayload {
  code: string;
}

export interface NewPasswordData {
  newPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserModel;
}

export interface ChatGPTResponseChoicesFormat {
  message?: {
    content?: string;
  }
}

export interface ChatGPTResponseFormat {
  choices?: ChatGPTResponseChoicesFormat[];
  error?: {message: string};
}
export interface ChatGPTResponse {
  recordID: string;
  certID: string;
  aiResponse: ChatGPTResponseFormat;
}

export interface CertificationData {
  pKey: string,
  certID: string,
  userID: string,
  author: string,
  chatGPT: string,
  creationDate: string,
  dataType: string,
  digitalContent: string,
  extraAgreement: string,
  intendedUse: string,
  natureOfWork: string,
  ownershipDetails: string,
  priorVersions: string,
  publicationStatus: string,
  registrationObjectives: string,
  thirdPartyContent: string,
  workDescription: string,
  createdAt: string,
}
export interface CertificationList {
  Count: number,
  Items: CertificationData[],
}

export interface CertificationResponse {
  status: number;
  message?: string;
  certifications?: CertificationList;
}

export interface IRequestGetDerivatives {
  itemID?: string;
  certID?: string;
  userID?: string;
  type?: string;
}

export interface DerivativeData {
  pKey: string,
  itemID: string,
  certID: string,
  userID: string,
  mType: string,
  metaData: string,
  s3Path: string,
  createdAt: string,
}

export interface DerivativeList {
  Count: number,
  Items: DerivativeData[],
}

export interface IResponseGetDerivatives {
  status: number;
  message?: string;
  list?: DerivativeList;
}


export const getChatGptConnector = (postData: ChatGPTPostData): Promise<ChatGPTResponse> => {
  return httpApi.post<ChatGPTResponse>('/Prod/v1/ChatGPT', { ...postData }).then(({ data }) => data);
};

export const getCertification = async (data:SearchData): Promise<CertificationResponse | undefined> => {
  try {
    const response = await axios.get<CertificationResponse>(BlinderAPIBasePath + '/Prod/v1/Certifications', { params: data });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e);
  }
};

export const getDerivatives = async (data:IRequestGetDerivatives): Promise<IResponseGetDerivatives | undefined> => {
  try {
    const response = await axios.get<IResponseGetDerivatives>(BlinderAPIBasePath + '/Prod/v1/VoiceProtect', { params: data });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e);
  }
};
