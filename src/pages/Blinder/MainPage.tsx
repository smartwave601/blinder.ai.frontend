import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Radio, Select, Upload, Checkbox, Progress, Space, Divider } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import type { CheckboxProps } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useNavigate } from "react-router-dom";
import moment, { Moment } from 'moment';

import { useTranslation } from 'react-i18next';

import { convertToMP3V2 } from '@app/utils/jsutils';
import * as S from './Blinder.styles';
import {BlinderAPIBasePath, ElevenLabsAPI, ElevenLabsToken} from "@app/constants/global";

import { BaseRow } from '../../components/common/BaseRow/BaseRow';
import { BaseCol } from '../../components/common/BaseCol/BaseCol';
import { BaseButton, DefaultButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseInput } from "@app/components/common/inputs/BaseInput/BaseInput";
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { ChatboxWrapper, TextCenter, VirtBar } from "./Blinder.styles";
import { BaseModal } from "@app/components/common/BaseModal/BaseModal";

import { PageTitle } from "@app/components/common/PageTitle/PageTitle";
import { useAppDispatch, useAppSelector } from "@app/hooks/reduxHooks";
import { notificationController } from "@app/controllers/notificationController";
import { CertformData } from "@app/interfaces/interfaces"
import { getChatGptConnector } from "@app/api/blinder.api";
import { BaseTypography } from "@app/components/common/BaseTypography/BaseTypography";

import { CertificationForm } from './forms/CertificationForm';
import { AddDerivativeModal } from './components/AddDerivativeModal';

const { confirm } = Modal;
const { TextArea } = Input;

interface CertGov {
  value: string;
  label: string;
  link: string;
}
interface ElevenlapSpeaker {
  value: string;
  label: string;
}
interface typeEleven11Voice {
  voice_id: string;
  name: string;
}


const MainPage: React.FC = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const jurisdictions: CertGov[] = [
    { value: 'us', label: t('blinder.jurisdictions.usCopyright'), link: 'https://eservice.eco.loc.gov/eService_enu?SWECmd=Start' },
    { value: 'uk', label: t('blinder.jurisdictions.ukCopyright'), link: 'https://www.gov.uk/copyright' },
    { value: 'eu', label: t('blinder.jurisdictions.euCopyright'), link: 'https://euipo.europa.eu/ohimportal/en/web/observatory/faqs-on-copyright' },
    { value: 'ca', label: t('blinder.jurisdictions.canadaCopyright'), link: 'https://www.ic.gc.ca/eic/site/cipointernet-internetopic.nsf/eng/h_wr00003.html' },
    { value: 'au', label: t('blinder.jurisdictions.australiaCopyright'), link: 'https://www.ipaustralia.gov.au/tools-resources/ip-toolkit/copyright' },
    { value: 'jp', label: t('blinder.jurisdictions.japanCopyright'), link: 'https://www.bunka.go.jp/english/policy/copyright/' },
    { value: 'cn', label: t('blinder.jurisdictions.chinaCopyright'), link: 'http://en.ncac.gov.cn/copyright/contents/10359/329083.shtml' },
    { value: 'de', label: t('blinder.jurisdictions.germanCopyright'), link: 'https://www.dpma.de/english/copyright/index.html' },
    { value: 'fr', label: t('blinder.jurisdictions.inpiCopyright'), link: 'https://www.inpi.fr/en/protecting-your-creations/copyright' },
    { value: 'in', label: t('blinder.jurisdictions.indiaCopyright'), link: 'https://copyright.gov.in/' },
    { value: 'br', label: t('blinder.jurisdictions.brazilCopyright'), link: 'https://www.gov.br/cultura/pt-br/acesso-a-informacao/inscricoes-abertas/registro-de-obras-intelectuais' },
    { value: 'kr', label: t('blinder.jurisdictions.koreaCopyright'), link: 'https://www.copyright.or.kr/eng/main.do' },
    { value: 'mx', label: t('blinder.jurisdictions.mexicoCopyright'), link: 'https://www.indautor.gob.mx/' },
    { value: 'ru', label: t('blinder.jurisdictions.russiaCopyright'), link: 'https://rospatent.gov.ru/en/copyright' },
    { value: 'es', label: t('blinder.jurisdictions.spanishCopyright'), link: 'https://www.oepm.es/en/propiedad_intelectual/propiedad_intelectual/' },
    { value: 'it', label: t('blinder.jurisdictions.italianCopyright'), link: 'https://www.siae.it/en/about-us/copyright-protection' },
    { value: 'nl', label: t('blinder.jurisdictions.boipCopyright'), link: 'https://www.boip.int/en/entrepreneurs/copyright' },
    { value: 'ch', label: t('blinder.jurisdictions.swissCopyright'), link: 'https://www.ige.ch/en/protecting-your-ip/copyright.html' },
    { value: 'ar', label: t('blinder.jurisdictions.argentinaCopyright'), link: 'https://www.argentina.gob.ar/cultura/derechoautor' },
    { value: 'pl', label: t('blinder.jurisdictions.polandCopyright'), link: 'https://www.gov.pl/web/kultura/prawo-autorskie' },
    { value: 'tr', label: t('blinder.jurisdictions.turkeyCopyright'), link: 'https://www.telifhaklari.gov.tr/' },
    { value: 'se', label: t('blinder.jurisdictions.swedishCopyright'), link: 'https://www.prv.se/en/copyright/' },
    { value: 'za', label: t('blinder.jurisdictions.safCopyright'), link: 'https://www.cipc.co.za/index.php/trade-marks-patents-designs-copyright/copyright/' },
    { value: 'il', label: t('blinder.jurisdictions.israelCopyright'), link: 'https://www.justice.gov.il/En/Units/ILPO/Pages/default.aspx' },
    { value: 'sg', label: t('blinder.jurisdictions.singaporeCopyright'), link: 'https://www.ipos.gov.sg/understanding-innovation-ip/copyright' },
    { value: 'dk', label: t('blinder.jurisdictions.danishCopyright'), link: 'https://www.dkpto.org/copyright/' },
    { value: 'no', label: t('blinder.jurisdictions.norwegianCopyright'), link: 'https://www.patentstyret.no/en/copyright/' },
    { value: 'fi', label: t('blinder.jurisdictions.finnishCopyright'), link: 'https://www.prh.fi/en/copyright.html' },
    { value: 'be', label: t('blinder.jurisdictions.belgianCopyright'), link: 'https://economie.fgov.be/en/themes/intellectual-property/copyright-and-related-rights' },
  ]
  const user = useAppSelector((state) => state.user.user);

  // Modal status
  const [isCertificationModalOpen, setIsCertificationModalOpen] = useState<boolean>(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isProtectModalOpen, setIsProtectModalOpen] = useState<boolean>(false);

  // main form variables
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
  const [chatboxContent, setChatboxContent] = useState<string>('');
  const [isMainChatboxVisible, setIsMainChatboxVisible] = useState<boolean>(false);

  // ChatGPT Modal
  const [certFormValues, setCertFormValues] = useState<CertformData>();
  const [certDataSaving, setCertDataSaving] = useState(false);
  const [chatGPTResponse, setChatGPTResponse] = useState('');
  const [prevCertRecordID, setPrevCertRecordID] = useState('');

  // Upload Modal
  const [imageSrc, setImageSrc] = useState('');
  const [sourceMediaType, setSourceMediaType] = useState('');
  const [sourceBlob, setSourceBlob] = useState<Blob|null>(null);
  const [isSourceUploading, setIsSourceUploading] = useState(false);
  const [sourceUploadProgress, setSourceUploadProgress] = useState(0);
  const [sourceFileName, setSourceFileName] = useState<string>('');

  const [isSourceUploaded, setIsSourceUploaded] = useState(false);
  const [isProtectVoiceUploaded, setIsProtectVoiceUploaded] = useState(false);
  const [isAISpeechUploaded, setIsAISpeechUploaded] = useState(false);

 /************** Main Panel Actions *************/
  const onExportButtonClicked = () => {
    const blob = new Blob([chatboxContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chat_content.txt';
    link.click();

    const subject = encodeURIComponent('Chat Content Export');
    const body = encodeURIComponent(chatboxContent);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }
  const onResetButtonClicked = () => {
    window.location.reload();
  }
  const onLeftFileCopyrightButtonClicked = () => {
    const foundGov = jurisdictions.find(org => org.value === selectedJurisdiction);
    if (!foundGov) {
      const usGov = jurisdictions[0];
      window.open( usGov.link, '_blank');
    } else {
      window.open(foundGov.link, '_blank');
    }
  }
  const onRightCopyrightButtonClicked = () => {
    onLeftFileCopyrightButtonClicked();
  }
  const onShareButtonClicked = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out Blinder AI',
        text: 'I found this great tool for protecting the copyright of multimodal data submitted to AI systems. Check it out at https://blinderai.com',
        url: 'https://blinderai.com'
      }).then(() => {
        BaseModal.success({
          content: 'Thanks for sharing!',
        });
      }).catch((e)=>{
        BaseModal.warning({
          title: t('blinder.text.warning'),
          content: e.message,
        });
      });
    } else {
      BaseModal.warning({
        title: t('blinder.text.warning'),
        content: 'Share not supported on this browser. Please use the share options in your browser.',
      });
    }
  }
  /****************************************/


  /************** Open Modals *************/
  // Central top "Upload" Button is clicked
  const props: UploadProps = {
    beforeUpload: file => {
      const fType = file.type.split('/')[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if(!reader.result) {
          notificationController.error({"message": "Sorry, we could not read your file contents."});
          setImageSrc('');
          setSourceBlob(null);
          return;
        }
        setSourceMediaType(fType);
        debugger;
        const byteArray = new Uint8Array(reader.result as ArrayBuffer);
        const blobData = new Blob([byteArray], { type: file.type })
        setSourceBlob(blobData);
        const base64String = URL.createObjectURL(blobData);
        setImageSrc(base64String)
        setSourceFileName(file.name)
        // if (fileType === 'image') {
        //   reader.result ? setImageSrc(reader.result.toString().trim()) : setImageSrc('');
        // } else if (fType === 'video') {
        //   reader.result ? setImageSrc(reader.result.toString().trim()) : setImageSrc('');
        // } else if (fType === 'audio') {
        //   reader.result ? setImageSrc(reader.result.toString().trim()) : setImageSrc('');
        // }
        setIsUploadModalOpen(true);
      };
      // reader.readAsDataURL(file);
      reader.readAsArrayBuffer(file);
      return false;
    },
  };
  // Central bottom "Submit" Button is clicked

  const showSourceLinkSubmitSuccess = () => {
    notificationController.error({ message: 'Thank you for your submit.' });
  }
  const showSourceLinkSubmitError = () => {
    notificationController.error({ message: 'Sorry, we could not upload your media due to a network error. Please try again.' });
  }
  /************
  // const onMainSubmitButtonClicked = () => {
  //   if (prevCertRecordID == '') {
  //     notificationController.error({ message: 'You should submit your certifications first before upload your work.' });
  //     return;
  //   }
  //   if (chatboxContent.trim() == '') {
  //     notificationController.error({ message: 'Please input a link.' });
  //     return;
  //   }
  //   if (!user) {
  //     notificationController.error({ message: 'Login required.' });
  //     return;
  //   }
  //   setIsSourceUploading(true);
  //
  //   try {
  //     const xhr = new XMLHttpRequest();
  //     const fd = new FormData()
  //
  //     fd.append('certId', prevCertRecordID);
  //     fd.append('userID', user.email);
  //     fd.append('mType', 'other');
  //     fd.append('sType', 'external');
  //     fd.append('externalLink', chatboxContent);
  //
  //     xhr.addEventListener("loadend", (evt) => {
  //       if (xhr.readyState === 4 && xhr.status === 200) {
  //         showSourceLinkSubmitSuccess();
  //       } else {
  //         showSourceLinkSubmitError();
  //       }
  //     });
  //     xhr.open("POST", `${BlinderAPIBasePath}/Prod/v1/Source`, true);
  //     xhr.send(fd);
  //   } catch (e) {
  //     console.error(e);
  //     showSourceUploadError();
  //   }
  // }
    *********************/
  const onMainSubmitButtonClicked = () => {
    if (chatboxContent != '') {
      setIsMainChatboxVisible(true);
    } else {
      BaseModal.warning({
        title: t('blinder.text.warning'),
        content: 'Please insert the link first.',
      });
    }
  }
  // Central middle "Voice Protect" Button is clicked
  const onOpenVoiceProtectModal = () => {
    setIsProtectModalOpen(true);
  }
  /****************************************/

  /********** Upload Modal Actions **********/
  // On Upload Modal "Export" button is clicked
  const onUploadModalExportButtonClicked = () => {
      const blob = new Blob([chatGPTResponse], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'ai_content.txt';
      link.click();

      const subject = encodeURIComponent('AI Content Export');
      const body = encodeURIComponent(chatGPTResponse);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  // On Upload Modal "Save" button is clicked
  const onUploadModalSaveButtonClicked = () => {
    if (prevCertRecordID == '') {
      notificationController.error({ message: 'You should submit your certifications first before upload your work.' });
      return;
    }
    if (sourceBlob == null) {
      notificationController.error({ message: 'Source is not loaded.' });
      return;
    }
    if (!user) {
      notificationController.error({ message: 'Login required.' });
      return;
    }
    setIsSourceUploading(true);
    setSourceUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();
      const fd = new FormData()

      fd.append('file', sourceBlob, sourceFileName);
      fd.append('certId', prevCertRecordID);
      fd.append('userID', user.email);
      fd.append('mType', sourceMediaType);
      fd.append('sType', 'internal');
      fd.append('oFileName', sourceFileName);

      xhr.upload.addEventListener("progress", (event) => {
        setSourceUploadProgress(((event.loaded / event.total) * 100))
      });

      xhr.addEventListener("loadend", (evt) => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          showSourceUploadSuccess();
          setIsSourceUploaded(true);
        } else {
          showSourceUploadError();
        }
      });
      xhr.open("POST", `${BlinderAPIBasePath}/Prod/v1/Source`, true);
      xhr.send(fd);
    } catch (e) {
      console.error(e);
      showSourceUploadError();
    }
  }
  // On Upload Modal "File Copyright" button is clicked
  const onUploadModalCopyrightButtonClicked = () => {
    onLeftFileCopyrightButtonClicked();
  }

  const showSourceUploadError = () => {
    notificationController.error({ message: 'Sorry, we could not upload your media due to a network error. Please try again.' });
    setIsSourceUploading(false);
    setSourceUploadProgress(0);
  }
  const showSourceUploadSuccess = () => {
    setIsSourceUploading(false);
    notificationController.success({ message: "Congratulation, You've uploaded your media successfully." });
  }
  const confirmCloseSourcetModal = () => {
    if (isSourceUploading) {
      notificationController.warning({"message": "You cannot close this DialogBox while you are uploading your media file."});
      return;
    }
    setIsUploadModalOpen(false);
  }
  /*************************************************/


  /********** Certification Modal Actions **********/
    // On Certification Modal "Submit" button is clicked
  const onCreateCertification = (values: CertformData) => {
    const creationDate:Moment = (values.creationDate as unknown) as Moment;
    if (user == null) {
      confirm({
        title: 'Auth Required',
        content: 'You should login to post your certification. Will you go to login page?',
        onOk() {
          navigate("/auth/login");
        }
      });
      return;
    }

    setCertFormValues(values);
    setCertDataSaving(true);

    const inputData = `
      Data Type: ${values.dataType}
      Nature of Work: ${values.natureOfWork}
      Work Description: ${values.workDescription}
      Creation Date: ${creationDate.format('ll')}
      Author: ${values.author}
      Ownership Details: ${values.ownershipDetails}
      Publication Status: ${values.publicationStatus}
      Prior Versions: ${values.priorVersions}
      Third-Party Content: ${values.thirdPartyContent}
      Intended Use: ${values.intendedUse}
      Registration Objectives: ${values.registrationObjectives}
      Digital Content: ${values.digitalContent}
      External Agreement: ${values.externalAgreement}
  `;
    const prompt = `
      Generate a document titled "Certificate of AI Derivative Works" and use these inputs to create a document that will serve as a copyright registration filing.
      ${inputData}
  `;
    getChatGptConnector({
      cert: values,
      prevID: prevCertRecordID,
      prompt: prompt,
      userID: user.email,
    })
      .then((res) => {
        setCertDataSaving(false);
        if (res.aiResponse.choices && res.aiResponse.choices.length > 0 && res.aiResponse.choices[0].message && res.aiResponse.choices[0].message.content) {
          setChatGPTResponse(res.aiResponse.choices[0].message.content);
          setPrevCertRecordID(res.certID);
          notificationController.success({ message: `Certification is Created. ID is [${res.certID}]` });
          setIsCertificationModalOpen(false);
        } else if (res.aiResponse.error && res.aiResponse.error.message) {
          notificationController.error({ message: `ChatGPT Error: ${res.aiResponse.error.message}` });
        } else {
          notificationController.error({ message: "No valid response received or unrecognized format." });
        }
      })
      .catch((e) => {
        setCertDataSaving(false);
        notificationController.error({ message: e.message })
      });
  };
  /*************************************************/

  const setVoiceProtectStatus = () => {
    setIsProtectVoiceUploaded(true);
  }
  const setSpeechGenerationStatus = () => {
    setIsAISpeechUploaded(true);
  }
  /*************************************************/

  return (
    <>
      <PageTitle>Blinder Home</PageTitle>
      <BaseRow style={{height: '100%'}}>
        <BaseCol xl={4}>
          <S.LeftSideWrapper>
            <S.StyledRow align="center">
              <DefaultButton type="primary" onClick={onExportButtonClicked}>{t('blinder.buttons.export')}</DefaultButton>
            </S.StyledRow>
            <S.StyledRow align="center">
              <Upload {...props} showUploadList={false}>
                <DefaultButton type="primary">{t('blinder.buttons.upload')}</DefaultButton>
              </Upload>
            </S.StyledRow>
            <S.StyledRow align="center">
              <DefaultButton type="primary" onClick={onResetButtonClicked}>{t('blinder.buttons.reset')}</DefaultButton>
            </S.StyledRow>
            <S.StyledRow align="center">
              <DefaultButton type="primary" onClick={onLeftFileCopyrightButtonClicked}>{t('blinder.buttons.fileCopyright')}</DefaultButton>
            </S.StyledRow>
          </S.LeftSideWrapper>
          <BaseRow>
            <Space direction="vertical" style={{"width": "100%"}}>
              <BaseRow align="middle" wrap={true}>
                {prevCertRecordID!=''?(
                  <CheckCircleTwoTone twoToneColor="#52c41a"/>
                ):(
                  <CloseCircleTwoTone twoToneColor="#eb2f96"/>
                )}
                &nbsp;Cert ID: {prevCertRecordID}
              </BaseRow>
              <BaseRow align="middle" wrap={true}>
                {isSourceUploaded?(
                  <CheckCircleTwoTone twoToneColor="#52c41a"/>
                ):(
                  <CloseCircleTwoTone twoToneColor="#eb2f96"/>
                )}
                &nbsp;Source
              </BaseRow>
              <BaseRow align="middle" wrap={true}>
                {isProtectVoiceUploaded?(
                  <CheckCircleTwoTone twoToneColor="#52c41a"/>
                ):(
                  <CloseCircleTwoTone twoToneColor="#eb2f96"/>
                )}
                &nbsp;Voice Record
              </BaseRow>
              <BaseRow align="middle" wrap={true}>
                {isAISpeechUploaded?(
                  <CheckCircleTwoTone twoToneColor="#52c41a"/>
                ):(
                  <CloseCircleTwoTone twoToneColor="#eb2f96"/>
                )}
                &nbsp;AI Audio
              </BaseRow>
            </Space>
          </BaseRow>
        </BaseCol>
        <BaseCol xl={16}>
          {isMainChatboxVisible?(
          <S.ChatboxWrapper >
            <BaseCol xl={24}>
              <BaseRow justify="center">
              <S.Bubble>{chatboxContent}</S.Bubble>
              </BaseRow>
              <Divider dashed />
              <BaseRow justify="center">
                <S.Bubble style={{maxHeight: "50vh", overflowY: "auto"}}>
                  <BaseTypography.Paragraph ellipsis={{ rows: 5, expandable: true}} style={{"color": "white"}}>
                    {chatGPTResponse}
                  </BaseTypography.Paragraph>
                </S.Bubble>
              </BaseRow>
            </BaseCol>
          </S.ChatboxWrapper>
          ):(
          <S.BlinderWrapper className="layout-center-middle">
            <S.StyledRow align="center">
              <Upload {...props} showUploadList={false}>
                <DefaultButton type="primary">{t('blinder.buttons.upload')}</DefaultButton>
              </Upload>
            </S.StyledRow>
            <S.StyledRow align="center">
              <DefaultButton type="primary" onClick={onOpenVoiceProtectModal}>{t('blinder.buttons.createProtectButton')}</DefaultButton>
            </S.StyledRow>
            <S.StyledRow align="center">
              <S.Text>{t('blinder.text.insertLink')}</S.Text>
            </S.StyledRow>
            <S.StyledRow align="center">
              <BaseInput placeholder="Enter link here" value={chatboxContent} onChange={(e) => setChatboxContent(e.target.value)} />
              <BaseButton type="primary" onClick={onMainSubmitButtonClicked}>{t('blinder.buttons.submit')}</BaseButton>
            </S.StyledRow>
          </S.BlinderWrapper>
          )}
        </BaseCol>
        <BaseCol xl={4}>
          <S.RightSideWrapper>
            <S.StyledRow align="center">
              <Select
                showSearch
                placeholder={t('blinder.jurisdictions.selectJurisdiction')}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={jurisdictions}
                placement='bottomRight'
                style={{ width: '200px' }}
                dropdownMatchSelectWidth={false}
                onChange={(val) => setSelectedJurisdiction(val)}
              />
            </S.StyledRow>
            <S.StyledRow align="center">
              <DefaultButton type="primary" onClick={onRightCopyrightButtonClicked}>{t('blinder.buttons.fileCopyright')}</DefaultButton>
            </S.StyledRow>
            <S.StyledRow align="center">
              <DefaultButton type="primary" onClick={onShareButtonClicked}>{t('blinder.buttons.share')}</DefaultButton>
            </S.StyledRow>
          </S.RightSideWrapper>
        </BaseCol>
      </BaseRow>
      <S.TextCenter>
        <S.StyledRow align="center">
          <S.Link href="https://clerkbridge.com/privacy-policy/" target="_blank">{t('blinder.text.privacyPolicy')}</S.Link>
          <S.VirtBar />
          <S.Link href="https://clerkbridge.com/tos" target="_blank">{t('blinder.text.termsOfService')}</S.Link>
        </S.StyledRow>
        <S.StyledRow align="center">
          <S.Text>{t('blinder.text.copyright')}</S.Text>
        </S.StyledRow>
      </S.TextCenter>
      <BaseModal
        centered
        open={isUploadModalOpen}
        width={"1000px"}
        onCancel={() => confirmCloseSourcetModal()}
        bodyStyle={{ maxHeight: '80vh', minHeight: '50vh', overflowY: 'auto' }}
        footer={
          <S.StyledRow align="space-around" style={{marginLeft: "200px", marginRight: "200px"}}>
            <BaseButton type="primary" onClick={onUploadModalExportButtonClicked}>{t('blinder.buttons.export')}</BaseButton>
            <BaseButton type="primary" onClick={onUploadModalSaveButtonClicked} loading={isSourceUploading}>{t('blinder.buttons.save')}</BaseButton>
            <BaseButton type="primary" onClick={onUploadModalCopyrightButtonClicked}>{t('blinder.buttons.fileCopyright')}</BaseButton>
          </S.StyledRow>
        }
      >
        <S.StyledRow align="space-around" style={{marginLeft: "200px", marginRight: "200px"}}>
          <BaseButton type="primary" onClick={onUploadModalExportButtonClicked}>{t('blinder.buttons.export')}</BaseButton>
          <BaseButton type="primary" onClick={onUploadModalSaveButtonClicked} loading={isSourceUploading}>{t('blinder.buttons.save')}</BaseButton>
          <BaseButton type="primary" onClick={onUploadModalCopyrightButtonClicked}>{t('blinder.buttons.fileCopyright')}</BaseButton>
        </S.StyledRow>
        <S.StyledRow align="center">
        {
          sourceMediaType=='image'? (<img src={imageSrc} style={{maxWidth: "100%"}}></img>) : (sourceMediaType=='video' ? (
            <video width="100%" controls>
              <source src={imageSrc} type="video/mp4" />
            </video>
          ) : (
            <audio src={imageSrc} style={{"width": "100%"}} controls></audio>
          ))
        }
        </S.StyledRow>
        <BaseRow>
          <Progress percent={sourceUploadProgress} showInfo={false} />
        </BaseRow>
        <S.StyledRow align="center">
          <S.Bubble>
            <BaseTypography.Paragraph ellipsis={{ rows: 5, expandable: true}} style={{"color": "white"}}>
              {chatGPTResponse}
            </BaseTypography.Paragraph>
          </S.Bubble>
        </S.StyledRow>
      </BaseModal>
      <AddDerivativeModal
        isProtectModalOpen={isProtectModalOpen}
        onClose={()=>setIsProtectModalOpen(false)}
        onSubmitVoice={setVoiceProtectStatus}
        onSubmitGeneratedSpeech={setSpeechGenerationStatus}
        onOpenCertificationModal={() => setIsCertificationModalOpen(true)}
        prevCertRecordID={prevCertRecordID}
        chatGPTData={chatGPTResponse}
        showCertificateInfo={true}
      ></AddDerivativeModal>
      {/*<BaseModal*/}
      {/*  centered*/}
      {/*  open={isProtectModalOpen}*/}
      {/*  width={"1000px"}*/}
      {/*  onCancel={() => confirmCloseProtectModal()}*/}
      {/*  footer={[*/}
      {/*    <Button key="back" onClick={() => setIsProtectModalOpen(false)}>*/}
      {/*      Close*/}
      {/*    </Button>*/}
      {/*  ]}*/}
      {/*>*/}
      {/*  <BaseTypography.Title level={4} >Record yourself:</BaseTypography.Title>*/}
      {/*  <BaseTypography.Text >Record yourself saying the following script and singing the following lyrics. Blinder will generate a unique voice ID and pattern for you that you can use to protect your voice likeness:</BaseTypography.Text>*/}
      {/*  <BaseTypography.Paragraph>*/}
      {/*    <BaseTypography.Text >Say: How now brown cow?</BaseTypography.Text><br/>*/}
      {/*    <BaseTypography.Text >Sing: Twinkle Twinkle Little Star</BaseTypography.Text>*/}
      {/*  </BaseTypography.Paragraph>*/}
      {/*  <Checkbox checked={isRecordingAutoUpload} onChange={OnIsRecordingAutoUploadChange}>Upload my voice automatically</Checkbox>*/}
      {/*  { isRecording?(*/}
      {/*    <DefaultButton onClick={onStopRecordingClicked}>Stop Recording</DefaultButton>*/}
      {/*  ):(*/}
      {/*    <DefaultButton onClick={onStartRecordingClicked}>Start Recording</DefaultButton>*/}
      {/*  )}*/}
      {/*  <DefaultButton onClick={onVoiceSavingClicked} loading={isRecUploading}>Save</DefaultButton>*/}
      {/*  <BaseRow>*/}
      {/*    <BaseTypography.Text>Recording*/}
      {/*      Time:</BaseTypography.Text><BaseTypography.Text>{voiceRecTime}</BaseTypography.Text>*/}
      {/*    <audio src={recordedAudio} style={{ "width": "100%" }} controls></audio>*/}
      {/*  </BaseRow>*/}
      {/*  <Progress percent={voiceUploadProgress} showInfo={false} />*/}
      {/*  <BaseTypography.Title level={4}>Transform your text into speech with<Select*/}
      {/*    placeholder={t('blinder.jurisdictions.selectJurisdiction')}*/}
      {/*    options={text2speechSpeakers}*/}
      {/*    style={{ width: '120px' }}*/}
      {/*    dropdownMatchSelectWidth={false}*/}
      {/*    onChange={(val) => setSelectedSpeaker(val)}*/}
      {/*  /></BaseTypography.Title>*/}
      {/*  <TextArea*/}
      {/*    placeholder="Feel free to type your words to have them voiced by AI."*/}
      {/*    autoSize={{ minRows: 2, maxRows: 6 }}*/}
      {/*    maxLength={100}*/}
      {/*    value={text2speechContent} onChange={(e) => setText2speechContent(e.target.value)}*/}
      {/*  />*/}
      {/*  <S.StyledRow>*/}
      {/*    <DefaultButton onClick={onGenerateSpeechClicked} loading={t2sButtonLoading}>Generate</DefaultButton>*/}
      {/*    <S.ExpandingDiv>*/}
      {/*      <audio src={text2speechAudio} style={{"width": "100%"}} controls></audio>*/}
      {/*    </S.ExpandingDiv>*/}
      {/*  </S.StyledRow>*/}
      {/*  <Progress percent={voiceUploadProgress} showInfo={false} />*/}
      {/*  <BaseTypography.Title level={4} >Your Certificate</BaseTypography.Title>*/}
      {/*  <DefaultButton>Update your certificate</DefaultButton>*/}
      {/*  <S.StyledRow align="center">*/}
      {/*    <BaseTypography.Paragraph*/}
      {/*      ellipsis={{*/}
      {/*        rows: 10,*/}
      {/*        expandable: true,*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      {chatGPTResponse}*/}
      {/*    </BaseTypography.Paragraph>*/}
      {/*  </S.StyledRow>*/}
      {/*</BaseModal>*/}
      <BaseModal
        title=""
        centered
        open={isCertificationModalOpen}
        width={'1000px'}
        okText="Create"
        cancelText="Cancel"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setIsCertificationModalOpen(false)}
        // onOk={handleOk}
        confirmLoading={certDataSaving}
        bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            initialValues={{ }}
            onFinish={(values) => onCreateCertification(values)}
          >
            {dom}
          </Form>
        )}
      >
        <CertificationForm/>
      </BaseModal>
    </>
  );
};

export default MainPage;
