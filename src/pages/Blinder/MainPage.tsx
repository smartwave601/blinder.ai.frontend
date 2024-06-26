import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Radio, Select, Upload, Checkbox, Progress } from "antd";
import type { CheckboxProps } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useNavigate } from "react-router-dom";

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

import { LeftSide } from './LeftSide';
import { RightSide } from './RightSide';
import { CertificationForm } from './forms/CertificationForm';
import { PageTitle } from "@app/components/common/PageTitle/PageTitle";
import { BaseImage } from "@app/components/common/BaseImage/BaseImage";
import { useAppDispatch, useAppSelector } from "@app/hooks/reduxHooks";
import { notificationController } from "@app/controllers/notificationController";
import { CertformData } from "@app/interfaces/interfaces"
import { getChatGptConnector } from "@app/api/blinder.api";
import { BaseTypography } from "@app/components/common/BaseTypography/BaseTypography";

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
  const [isMainChaboxVisible, setIsMainChatboxVisible] = useState<boolean>(false);

  // ChatGPT Modal
  const [certFormValues, setCertFormValues] = useState<CertformData>();
  const [certDataSaving, setCertDataSaving] = useState(false);
  const [chatGPTResponse, setChatGPTResponse] = useState('');
  const [prevCertRecordID, setPrevCertRecordID] = useState('');

  // Upload Modal
  const [imageSrc, setImageSrc] = useState('');
  const [fileType, setFileType] = useState('');

  // Voice Protect Modal

  const [IS_ELEVENLABS_INITIALIZED, SET_IS_ELEVENLABS_INITIALIZED] = useState(false);

  const [isRecordingAutoUpload, setIsRecordingAutoUpload] = useState(false);
  const [voiceRecTime, setVoiceRecTime] = useState('0:00');
  const [isRecording, setIsRecording] = useState(false);
  const [text2speechSpeakers, setText2speechSpeakers] = useState<ElevenlapSpeaker[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('');
  const [text2speechContent, setText2speechContent] = useState('');
  const [text2speechAudio, setText2speechAudio] = useState('');
  const [t2sButtonLoading, setT2sButtonLoading] = useState(false);


  const [recordedAudio, setRecordedAudio] = useState('');
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob|null>(null);
  const [isRecUploading, setIsRecUploading] = useState(false);
  const [voiceUploadProgress, setVoiceUploadProgress] = useState(0);


  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder|null>(null);

  /************** Main Panel Actions *************/
  const onExportButonClicked = () => {
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
      const fileType = file.type.split('/')[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        setFileType(fileType);
        if (fileType === 'image') {
          reader.result ? setImageSrc(reader.result.toString().trim()) : setImageSrc('');
        } else if (fileType === 'video') {
          reader.result ? setImageSrc(reader.result.toString().trim()) : setImageSrc('');
        } else if (fileType === 'audio') {
          reader.result ? setImageSrc(reader.result.toString().trim()) : setImageSrc('');
        }
        setIsUploadModalOpen(true);
      };
      reader.readAsDataURL(file);
      return false;
    },
  };
  // Central bottom "Submit" Button is clicked
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
    const options = {method: 'GET', headers: {'xi-api-key': ElevenLabsToken}};
    debugger;
    if (!IS_ELEVENLABS_INITIALIZED) {
      fetch(`${ElevenLabsAPI}/v1/voices`, options)
        .then(response => response.json())
        .then(response => {
          SET_IS_ELEVENLABS_INITIALIZED(true);
          const speakers:ElevenlapSpeaker[] = [];
          response.voices.forEach((element: typeEleven11Voice) => {
            speakers.push({
              value: element.voice_id,
              label: element.name,
            });
          });
          setText2speechSpeakers(speakers);
        })
        .catch(err => {
          console.error(err)
        });
    }
  }
  /****************************************/

  /********** Upload Modal Actions **********/
  // On Upload Modal "Export" button is clicked
  const onUploadModalExportButtonClicked = () => {
      onUploadModalSaveButtonClicked();
      const subject = encodeURIComponent('AI Content Export');
      const body = encodeURIComponent(chatGPTResponse);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  // On Upload Modal "Save" button is clicked
  const onUploadModalSaveButtonClicked = () => {
    const blob = new Blob([chatGPTResponse], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ai_content.txt';
    link.click();
  }
  // On Upload Modal "File Copyright" button is clicked
  const onUploadModalCopyrightButtonClicked = () => {
    onLeftFileCopyrightButtonClicked();
  }
  /*************************************************/

  /********** Certification Modal Actions **********/
    // On Certification Modal "Submit" button is clicked
  const onCreateCertification = (values: CertformData) => {
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
        Creation Date: ${values.creationDate}
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


  /********** Voice Protect Modal Actions **********/
  const OnIsRecordingAutoUploadChange: CheckboxProps['onChange'] = (e) => {
    setIsRecordingAutoUpload(e.target.checked);
  };
  const onStartRecordingClicked = () => {
    let recordInterval: NodeJS.Timer;
    let nRecSec: number;
    let nSec: number, nMin: number;
    function startRecordingCounter() {
      nRecSec = 0;
      setIsRecording(true);
      setVoiceRecTime('0:00');
      recordInterval = setInterval(() => {
        nRecSec += 1;
        nMin = Math.floor(nRecSec / 60);
        nSec = nRecSec % 60;
        setVoiceRecTime(nMin + ":" + (nSec < 10?'0'+nSec:nSec));
      }, 1000);
    }
    function stopRecordingCounter() {
      setIsRecording(false);
      clearInterval(recordInterval);
    }

    try {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
          startRecordingCounter();
          const recordedChunks: Blob[] = [];
          const mr = new MediaRecorder(stream);
          mr.ondataavailable = function(event) {
            if (event.data.size > 0) {
              recordedChunks.push(event.data);
            }
          };
          mr.onstop = function() {
            stopRecordingCounter();

            const blob: Blob = new Blob(recordedChunks, { type: 'audio/webm' });
            debugger;
            convertToMP3V2(blob, function(mp3Data: Blob) {
              setRecordedAudioBlob(mp3Data);
              const audioURL = URL.createObjectURL(mp3Data);
              setRecordedAudio(audioURL);

              if (isRecordingAutoUpload) {
                uploadVoice();
              }
            });
          };
          mr.start();
          setMediaRecorder(mr);
          setIsRecording(true);
        });
    } catch (err) {
      alert("This web browser does not allow to access your media device.");
      console.log(err);
    }
  }
  const onStopRecordingClicked = () => {
    if (mediaRecorder != null) {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    // recorder
    //   .stop()
    //   .getAudio()
    //   .then(([buffer, blob]) => {
    //     // do what ever you want with buffer and blob
    //     // Example: Create a mp3 file and play
    //     const file = new File(buffer, 'me-at-thevoice.mp3', {
    //       type: blob.type,
    //       lastModified: Date.now()
    //     });
    //
    //     const player = new Audio(URL.createObjectURL(file));
    //     player.play();
    //
    //   }).catch((e) => {
    //   alert('We could not retrieve your message');
    //   console.log(e);
    // });
  }

  const showUploadError = () => {
    notificationController.error({ message: 'Saving is failed.' });
    setIsRecUploading(false);
    setVoiceUploadProgress(0);
  }
  const showUploadSuccess = () => {
    setIsRecUploading(false);
    notificationController.success({ message: 'Upload Success.' });
  }
  const onVoiceSavingClicked = () => {
    if (prevCertRecordID == '') {
      notificationController.error({ message: 'You should submit your certifications first before upload your voice.' });
      return;
    }
    if (recordedAudioBlob == null) {
      notificationController.error({ message: 'Rack of recorded audio data.' });
      return;
    }
    if (!user) {
      notificationController.error({ message: 'Login required.' });
      return;
    }
    setIsRecUploading(true);
    setVoiceUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();
      const fd = new FormData()

      fd.append('file', recordedAudioBlob, 'record.mp3');
      fd.append('cert_id', prevCertRecordID);
      fd.append('user_id', user.email);

      xhr.upload.addEventListener("progress", (event) => {
        setVoiceUploadProgress(((event.loaded / event.total) * 100))
      });

      xhr.addEventListener("loadend", (evt) => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          // const data = JSON.parse(xhr.response);
          showUploadSuccess();
          // showVoiceGenerator();
        } else {
          showUploadError();
        }
      });
      xhr.open("POST", `${BlinderAPIBasePath}/Prod/v1/VoiceProtect`, true);
      xhr.send(fd);
    } catch (e) {
      console.error(e);
      showUploadError();
    }
  }

  const onGenerateSpeechClicked = () => {
    if (text2speechContent.length == 0) {
      BaseModal.warning({
        title: t('blinder.text.warning'),
        content: "Please type your text to convert into speech.",
      });
      return;
    }
    if (text2speechContent.length >= 300) {
      BaseModal.warning({
        title: t('blinder.text.warning'),
        content: "The length of the text should not exceed 300.",
      });
      return;
    }
    if (selectedSpeaker == null) {
      BaseModal.warning({
        title: t('blinder.text.warning'),
        content: "Please type your text to convert into speech.",
      });
      return;
    }
    setT2sButtonLoading(true);

    const payload = {
      "text": text2speechContent,
      "model_id": 'eleven_monolingual_v1',
      "voice_settings":{
        "stability": 0,
        "similarity_boost": 1,
        "style": 0,
        "use_speaker_boost": true,
      },
      // "seed":14,
    };

    const options = {
      method: 'POST',
      headers: {'xi-api-key': ElevenLabsToken, 'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    };
    function streamToBlob (stream: ReadableStream) {
      if (Object.prototype.toString.call(stream) != "[object ReadableStream]") {
        return new Promise((resolve, reject) => {
          reject("The response from elevenlabs is incorrect.");
        })
      }
      const reader = stream.getReader();
      return new Promise((resolve) => {
        const chunks: Uint8Array[] = [];

        function pump() {
          reader.read().then(({ value, done }) => {
            if (done) {
              if (value) {
                chunks.push(value);
              }
              let length = 0;
              chunks.forEach(item => {
                length += item.length;
              });

              // Create a new array with total length and merge all source arrays.
              const mergedArray = new Uint8Array(length);
              let offset = 0;
              chunks.forEach(item => {
                mergedArray.set(item, offset);
                offset += item.length;
              });
              const blob = new Blob([mergedArray], { type: 'audio/mp3' });
              resolve(blob);
              return;
            }
            chunks.push(value);
            pump();
          });
        }

        pump();
      });
    }
    debugger;
    fetch(`${ElevenLabsAPI}/v1/text-to-speech/${selectedSpeaker}?output_format=mp3_22050_32&optimize_streaming_latency=0&enable_logging=true`, options)
      .then(response => {
        streamToBlob(response.body as ReadableStream).then( blob => {
          const audioURL = URL.createObjectURL(blob as Blob);
          setText2speechAudio(audioURL);
          setT2sButtonLoading(false);
        }, (reason: string) => {
          setT2sButtonLoading(false);
          alert(reason);
        });
      })
      .catch(err => {
        setT2sButtonLoading(false);
        console.error(err);
      });
  }
  const confirmCloseProtectModal = () => {
    if (prevCertRecordID == '' || (!isRecording && !t2sButtonLoading)) {
      setIsProtectModalOpen(false);
      return;
    }
    confirm({
      title: 'Confirm',
      content: 'Are you sure to discard your voice or generated speech?',
      onOk() {
        setIsProtectModalOpen(false);
      }
    });
  }
  const uploadVoice = () => {
    // if (CERTIFICATION_ID == '') {
    //   showToast('You should submit your certifications first before upload your voice.', 'error');
    //   return;
    // }
    //
    // submitVoiceProtectButton.disabled = true;
    // vppUploadStatusDiv.style.display = 'block';
    // vppUploadStatusDiv.innerHTML = 'Saving';
    // var uploadProgress = document.getElementById("voice-upload-progress");
    // var uploadProgressValue = document.getElementById("voice-upload-progress-value");
    // uploadProgress.style.display = 'block';
    // function showUploadError() {
    //   submitVoiceProtectButton.disabled = false;
    //   vppUploadStatusDiv.classList.remove('text-success');
    //   vppUploadStatusDiv.classList.add('text-danger');
    //   vppUploadStatusDiv.innerHTML = 'Save Failed';
    //   uploadProgress.style.display = 'none';
    //   uploadProgressValue.style.width = "0";
    // }
    // function showUploadSuccess() {
    //   submitVoiceProtectButton.disabled = false;
    //   vppUploadStatusDiv.classList.remove('text-danger');
    //   vppUploadStatusDiv.classList.add('text-success');
    //   vppUploadStatusDiv.innerHTML = 'Save Success';
    //   // vppCertificateMetadataWrapperDiv.style.display = 'block';
    //   // if (CHATGPT_RESPONSE != '') {
    //   //     vppCertificateMetadataDiv.innerText = CHATGPT_RESPONSE;
    //   // } else {
    //   //     vppCertificateMetadataDiv.innerText = 'You did\'t submit metadata for certification. Please submit it again.';
    //   // }
    //   isVoiceProtectFileUploaded = true;
    //   uploadProgress.style.display = 'none';
    //   uploadProgressValue.style.width = "0";
    // }
    //
    // try {
    //   const xhr = new XMLHttpRequest();
    //   var fd = new FormData()
    //
    //   fd.append('file', MP3Blob, 'record.mp3');
    //   fd.append('cert_id', CERTIFICATION_ID);
    //
    //   xhr.upload.addEventListener("progress", (event) => {
    //     if (event.lengthComputable) {
    //       uploadProgressValue.style.width = ((event.loaded / event.total) * 100) + "%";
    //     }
    //   });
    //
    //   xhr.addEventListener("loadend", (evt) => {
    //     if (xhr.readyState === 4 && xhr.status === 200) {
    //       let data = JSON.parse(xhr.response);
    //       VOICE_PROTECT_FILE_ID = data.recordID;
    //       showUploadSuccess();
    //       showVoiceGenerator();
    //     } else {
    //       showUploadError();
    //     }
    //   });
    //   xhr.open("POST", API_VOICE_UPLOAD, true);
    //   xhr.send(fd);
    // } catch (e) {
    //   console.error(e);
    //   showUploadError();
    // }
  }
  /*************************************************/

  return (
    <>
      <PageTitle>Blinder Home</PageTitle>
      <BaseRow style={{height: '100%'}}>
        <BaseCol xl={4}>
          <S.LeftSideWrapper>
            <S.StyledRow align="center">
              <DefaultButton type="primary" onClick={onExportButonClicked}>{t('blinder.buttons.export')}</DefaultButton>
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
        </BaseCol>
        <BaseCol xl={16}>
          {isMainChaboxVisible?(
          <S.ChatboxWrapper >
            <S.Bubble>{chatboxContent}</S.Bubble>
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
        onCancel={() => setIsUploadModalOpen(false)}
        footer={null}
      >
        <S.StyledRow align="space-around" style={{marginLeft: "200px", marginRight: "200px"}}>
          <BaseButton type="primary" onClick={onUploadModalExportButtonClicked}>{t('blinder.buttons.export')}</BaseButton>
          <BaseButton type="primary" onClick={onUploadModalSaveButtonClicked}>{t('blinder.buttons.save')}</BaseButton>
          <BaseButton type="primary" onClick={onUploadModalCopyrightButtonClicked}>{t('blinder.buttons.fileCopyright')}</BaseButton>
        </S.StyledRow>
        <S.StyledRow align="center">
        {
          fileType=='image'? (<img src={imageSrc} style={{maxWidth: "100%"}}></img>) : (fileType=='video' ? (
            <video width="100%" controls>
              <source src={imageSrc} type="video/mp4" />
            </video>
          ) : (
            <audio src={imageSrc} style={{"width": "100%"}} controls></audio>
          ))
        }
        </S.StyledRow>
        <S.StyledRow align="center">
          <S.Bubble>{chatGPTResponse}</S.Bubble>
        </S.StyledRow>
        <S.StyledRow align="space-around" style={{marginLeft: "200px", marginRight: "200px"}}>
          <BaseButton type="primary">{t('blinder.buttons.export')}</BaseButton>
          <BaseButton type="primary">{t('blinder.buttons.save')}</BaseButton>
          <BaseButton type="primary">{t('blinder.buttons.fileCopyright')}</BaseButton>
        </S.StyledRow>
      </BaseModal>
      <BaseModal
        centered
        open={isProtectModalOpen}
        width={"1000px"}
        onCancel={() => confirmCloseProtectModal()}
        footer={[
          <Button key="back" onClick={() => setIsProtectModalOpen(false)}>
            Close
          </Button>
        ]}
      >
        <BaseTypography.Title level={4} >Record yourself:</BaseTypography.Title>
        <BaseTypography.Text >Record yourself saying the following script and singing the following lyrics. Blinder will generate a unique voice ID and pattern for you that you can use to protect your voice likeness:</BaseTypography.Text>
        <BaseTypography.Paragraph>
          <BaseTypography.Text >Say: How now brown cow?</BaseTypography.Text><br/>
          <BaseTypography.Text >Sing: Twinkle Twinkle Little Star</BaseTypography.Text>
        </BaseTypography.Paragraph>
        <Checkbox checked={isRecordingAutoUpload} onChange={OnIsRecordingAutoUploadChange}>Upload my voice automatically</Checkbox>
        { isRecording?(
          <DefaultButton onClick={onStopRecordingClicked}>Stop Recording</DefaultButton>
        ):(
          <DefaultButton onClick={onStartRecordingClicked}>Start Recording</DefaultButton>
        )}
        <DefaultButton onClick={onVoiceSavingClicked} loading={isRecUploading}>Save</DefaultButton>
        <BaseRow>
          <BaseTypography.Text>Recording
            Time:</BaseTypography.Text><BaseTypography.Text>{voiceRecTime}</BaseTypography.Text>
          <audio src={recordedAudio} style={{ "width": "100%" }} controls></audio>
        </BaseRow>
        <Progress percent={voiceUploadProgress} showInfo={false} />
        <BaseTypography.Title level={4}>Transform your text into speech with<Select
          placeholder={t('blinder.jurisdictions.selectJurisdiction')}
          options={text2speechSpeakers}
          style={{ width: '120px' }}
          dropdownMatchSelectWidth={false}
          onChange={(val) => setSelectedSpeaker(val)}
        /></BaseTypography.Title>
        <TextArea
          placeholder="Feel free to type your words to have them voiced by AI."
          autoSize={{ minRows: 2, maxRows: 6 }}
          maxLength={100}
          value={text2speechContent} onChange={(e) => setText2speechContent(e.target.value)}
        />
        <S.StyledRow>
          <DefaultButton onClick={onGenerateSpeechClicked} loading={t2sButtonLoading}>Generate</DefaultButton>
          <S.ExpandingDiv>
            <audio src={text2speechAudio} style={{"width": "100%"}} controls></audio>
          </S.ExpandingDiv>
        </S.StyledRow>
        <Progress percent={voiceUploadProgress} showInfo={false} />
        <BaseTypography.Title level={4} >Your Certificate</BaseTypography.Title>
        <DefaultButton>Update your certificate</DefaultButton>
        <S.StyledRow align="center">
          <BaseTypography.Paragraph
            ellipsis={{
              rows: 10,
              expandable: true,
            }}
          >
            {chatGPTResponse}
          </BaseTypography.Paragraph>
        </S.StyledRow>
      </BaseModal>
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
