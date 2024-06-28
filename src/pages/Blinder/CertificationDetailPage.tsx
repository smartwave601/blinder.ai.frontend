import React, { useEffect, useState } from "react";
import { Input, Spin, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DownloadOutlined } from '@ant-design/icons';



import * as S from './Blinder.styles';
import { DefaultButton, BaseButton } from "@app/components/common/BaseButton/BaseButton";
import { useAppSelector } from "@app/hooks/reduxHooks";
import { SearchData } from '@app/interfaces/interfaces';
import {
  ICertificationData,
  getCertification,
  DerivativeData,
  getDerivatives,
} from "@app/api/blinder.api";
import { notificationController } from "@app/controllers/notificationController";
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseTypography } from "@app/components/common/BaseTypography/BaseTypography";
import { BaseTable } from "@app/components/common/BaseTable/BaseTable";
import { AddDerivativeModal } from "@app/pages/Blinder/components/AddDerivativeModal";
import { Dates } from "@app/constants/Dates";

const { Search } = Input;
const certificationDefault = {
  pKey: '',
  certID: '',
  UUID: '',
  userID: '',
  author: '',
  chatGPT: '{"choices":[{"message":{"content":""}}]}',
  creationDate: '',
  dataType: '',
  digitalContent: '',
  extraAgreement: '',
  intendedUse: '',
  natureOfWork: '',
  ownershipDetails: '',
  priorVersions: '',
  publicationStatus: '',
  registrationObjectives: '',
  thirdPartyContent: '',
  workDescription: '',
  createdAt: '',
}
const SearchResultPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isCertDataLoading, setIsCertDataLoading] = useState(false);
  const [isDerivativesLoading, setIsDerivativesLoading] = useState(false);
  const [certification, setCertification] = useState<ICertificationData>(certificationDefault);
  const [derivatives, setDerivatives] = useState<DerivativeData[]>([]);
  const [certID, setCertID] = useState<string>('');
  const [chatGPTResponse, setChatGPTResponse] = useState<string>('');

  const [isProtectModalOpen, setIsProtectModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const certID = searchParams.get("cert_id");
    if (certID) {
      doSearch(certID);
      doDerivativeSearch(certID);
    } else {
      notificationController.error({ message: `Certification ID is not detected.` });
      navigate(-1);
    }
  }, [searchParams]);

  const doSearch = (certID:string) => {
    // setIsSearching(true);
    setIsCertDataLoading(true);
    getCertification(certID).then((responseData) => {
      setIsCertDataLoading(false);
      if (!responseData) {
        notificationController.error({ message: `Server connection failed.` });
        return;
      }
      if (responseData.status == 0) {
        notificationController.warning({ message: `Could not find certification.` });
        return;
      }
      if (responseData?.certification) {
        setCertification(responseData.certification);
        setCertID(responseData.certification.certID);
      }
    }).catch((e) => {
      setIsCertDataLoading(false);
      notificationController.error({ message: e.message });
    });
  }
  const doDerivativeSearch = (certID:string) => {
    setIsDerivativesLoading(true);
    getDerivatives({certID: certID}).then((derivativeData)=> {
      setIsDerivativesLoading(false);
      if (!derivativeData) {
        notificationController.error({ message: `Server connection failed` });
        return;
      }
      if (derivativeData?.status == 0) {
        notificationController.warning({ message: `Could not find certInfo` });
        return;
      }
      if (derivativeData?.list && derivativeData.list.Count > 0) {
        setDerivatives(derivativeData.list.Items);
      }
    }).catch((e) => {
      setIsDerivativesLoading(false);
      notificationController.error({ message: e.message });
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'itemID',
      key: 'itemID',
    },
    {
      title: 'Type',
      dataIndex: 'mType',
      key: 'mType',
    },
    {
      title: 'Path',
      dataIndex: 's3Path',
      key: 's3Path',
    },
    {
      title: 'Meta',
      dataIndex: 'metaData',
      key: 'metaData',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_:string, record:ICertificationData) => (
        <>{Dates.format(record.createdAt, 'D MMMM YYYY HH:mm')}</>
      )
    },
  ];
  const setVoiceProtectStatus = () => {
    if (certID) {
      doDerivativeSearch(certID);
    }
  }
  const setSpeechGenerationStatus = () => {
    if (certID) {
      doDerivativeSearch(certID);
    }
  }
  const downloadSourceFile = () => {
    if (!certification.source || certification.source.itemID == '') {
      return;
    }
    window.URL = window.URL || window.webkitURL;

    const xhr = new XMLHttpRequest();

    xhr.open('GET', certification.source.sourcePath, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (!certification.source || certification.source.itemID == '') {
        return;
      }
      const file = new Blob([xhr.response], { type : 'application/octet-stream' });

      const  a = document.createElement('a');
      a.href = window.URL.createObjectURL(file);
      a.download = certification.source.originalName;  // Set to whatever file name you want
      // Now just click the link you created
      // Note that you may have to append the a element to the body somewhere
      // for this to work in Firefox
      a.click();
    };
    xhr.send();
  }
  const setCustomFileStatus = () => {
    if (certID) {
      doDerivativeSearch(certID);
    }
  }

  return (
    <S.RightSideWrapper>
      <BaseRow>
        <BaseCol md={12}>
          <Spin spinning={isCertDataLoading} delay={500}>
            <BaseRow gutter={10}>
              <BaseCol md={16}>
                <BaseRow gutter={10}>
                  <BaseCol span={12} style={{"textAlign": "right"}}>
                    <BaseTypography.Title level={5}>Certification ID:</BaseTypography.Title>
                  </BaseCol>
                  <BaseCol span={12}>
                    <BaseTypography.Title level={5}>{certification.certID}</BaseTypography.Title>
                  </BaseCol>
                </BaseRow>
                <BaseRow gutter={10}>
                  <BaseCol span={12} style={{"textAlign": "right"}}>
                    <BaseTypography.Title level={5}>Created At:</BaseTypography.Title>
                  </BaseCol>
                  <BaseCol span={12}>
                    <BaseTypography.Title level={5}>{Dates.format(certification.createdAt, 'D MMMM YYYY HH:mm')}</BaseTypography.Title>
                  </BaseCol>
                </BaseRow>
              </BaseCol>
              <BaseCol md={8}>
                <BaseButton type="primary"
                            icon={<DownloadOutlined />}
                            disabled={!certification.source||certification.source.itemID==''}
                            onClick={downloadSourceFile}
                >
                  Download Source File
                </BaseButton>
              </BaseCol>
            </BaseRow>

            <BaseRow justify="center">
              <S.Bubble>
                <BaseTypography.Paragraph ellipsis={{ rows: 3, expandable: true}} style={{"color": "white"}}>
                  {JSON.parse(certification.chatGPT)?.choices[0].message.content}
                </BaseTypography.Paragraph>
              </S.Bubble>
            </BaseRow>
          </Spin>
        </BaseCol>
        <BaseCol md={12}>
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <BaseRow>
              <BaseCol flex="1 1 200px"><BaseTypography.Title level={3}>Derivatives</BaseTypography.Title></BaseCol>
              <BaseCol flex="0 1 300px">
                <BaseRow justify="end">
                  <DefaultButton type="primary" onClick={()=>setIsProtectModalOpen(true)}>Append</DefaultButton>
                </BaseRow>
              </BaseCol>
            </BaseRow>
            <BaseTable
              rowKey="itemID"
              columns={columns}
              dataSource={derivatives}
              // pagination={tableData.pagination}
              // loading={tableData.loading}
              // onChange={handleTableChange}
              scroll={{ x: 800 }}
              loading={isDerivativesLoading}
              bordered
            />
          </Space>
        </BaseCol>
      </BaseRow>
      <AddDerivativeModal
        isProtectModalOpen={isProtectModalOpen}
        onClose={()=>setIsProtectModalOpen(false)}
        onSubmitVoice={setVoiceProtectStatus}
        onSubmitGeneratedSpeech={setSpeechGenerationStatus}
        onSubmitCustomFile={setCustomFileStatus}
        prevCertRecordID={certID}
        chatGPTData={chatGPTResponse}
        showCertificateInfo={false}
      ></AddDerivativeModal>
    </S.RightSideWrapper>
  );
};
export default SearchResultPage;