import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Radio, Select, Upload, Checkbox, Progress, Space, Divider } from "antd";
import type { CheckboxProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

import { useTranslation } from 'react-i18next';

import { convertToMP3V2 } from '@app/utils/jsutils';
import * as S from '../Blinder.styles';
import {BlinderAPIBasePath, ElevenLabsAPI, ElevenLabsToken} from "@app/constants/global";

import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseButton, DefaultButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseModal } from "@app/components/common/BaseModal/BaseModal";

import { useAppDispatch, useAppSelector } from "@app/hooks/reduxHooks";
import { notificationController } from "@app/controllers/notificationController";

import { BaseTypography } from "@app/components/common/BaseTypography/BaseTypography";

const { confirm } = Modal;
const { TextArea } = Input;

interface ElevenlapSpeaker {
  value: string;
  label: string;
}

interface ITypeEleven11Voice {
  voice_id: string;
  name: string;
}

interface IProps {
  isProtectModalOpen: boolean;
  onClose: () => void;
  onSubmitVoice: () => void;
  onSubmitGeneratedSpeech: () => void;
  onSubmitCustomFile: () => void;
  onOpenCertificationModal?: () => void;
  prevCertRecordID: string;
  chatGPTData: string;
  showCertificateInfo: boolean;
}

export const AddDerivativeModal: React.FC<IProps> = ({
                                                       isProtectModalOpen,
                                                       onClose,
                                                       onSubmitVoice,
                                                       onSubmitGeneratedSpeech,
                                                       onSubmitCustomFile,
                                                       onOpenCertificationModal,
                                                       prevCertRecordID,
                                                       chatGPTData,
                                                       showCertificateInfo}) => {
  const { t } = useTranslation();

  const user = useAppSelector((state) => state.user.user);

  // Voice Protect Modal

  const [IS_ELEVENLABS_INITIALIZED, SET_IS_ELEVENLABS_INITIALIZED] = useState(false);

  const [isRecordingAutoUpload, setIsRecordingAutoUpload] = useState(false);
  const [voiceRecTime, setVoiceRecTime] = useState('0:00');
  const [isRecording, setIsRecording] = useState(false);
  const [text2speechSpeakers, setText2speechSpeakers] = useState<ElevenlapSpeaker[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('');
  const [text2speechContent, setText2speechContent] = useState('');
  const [text2speechAudioBlob, setText2speechAudioBlob] = useState<Blob|null>(null);
  const [text2speechAudio, setText2speechAudio] = useState('');
  const [t2sButtonLoading, setT2sButtonLoading] = useState(false);
  const [isSpeechUploading, setIsSpeechUploading] = useState(false);
  const [t2sMetaData, setT2sMetaData] = useState<string>('');

  const [speechUploadProgress, setSpeechUploadProgress] = useState(0);


  const [recordedAudio, setRecordedAudio] = useState('');
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob|null>(null);
  const [isRecUploading, setIsRecUploading] = useState(false);
  const [voiceUploadProgress, setVoiceUploadProgress] = useState(0);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder|null>(null);
  const [hasNewVoice, setHasNewVoice] = useState(false);
  const [hasNewSpeech, setHasNewSpeech] = useState(false);


  const [isCustomFileUploading, setIsCustomFileUploading] = useState(false);
  const [customFileUploadProgress, setCustomFileUploadProgress] = useState(0);

  useEffect(() => {
    if (isProtectModalOpen) {
      loadElevenlabs();
    }
  }, [isProtectModalOpen]);

  /************** Open Modals *************/
  // Central middle "Voice Protect" Button is clicked
  const loadElevenlabs = () => {
    const options = {method: 'GET', headers: {'xi-api-key': ElevenLabsToken}};
    if (!IS_ELEVENLABS_INITIALIZED) {
      fetch(`${ElevenLabsAPI}/v1/voices`, options)
        .then(response => response.json())
        .then(response => {
          SET_IS_ELEVENLABS_INITIALIZED(true);
          const speakers:ElevenlapSpeaker[] = [];
          response.voices.forEach((element: ITypeEleven11Voice) => {
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


  /********** Voice Protect Modal Actions **********/
  const OnIsRecordingAutoUploadChange: CheckboxProps['onChange'] = (e) => {
    console.log(e.target.checked);
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
            console.log('-----------ondataavailable------------', (new Date()).getTime());
            if (event.data.size > 0) {
              recordedChunks.push(event.data);
            }
          };
          mr.onstop = function() {
            stopRecordingCounter();

            const blob: Blob = new Blob(recordedChunks, { type: 'audio/webm' });
            convertToMP3V2(blob, function(mp3Data: Blob) {
              setRecordedAudioBlob(mp3Data);
              const audioURL = URL.createObjectURL(mp3Data);
              setRecordedAudio(audioURL);

              if (isRecordingAutoUpload) {
                onVoiceSavingClicked();
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
    setHasNewVoice(true);
    setIsRecording(false);
  }

  const showUploadError = () => {
    notificationController.error({ message: 'Saving is failed.' });
    setIsRecUploading(false);
    setVoiceUploadProgress(0);
  }
  const showUploadSuccess = () => {
    setHasNewVoice(false);
    setIsRecUploading(false);
    onSubmitVoice();
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
      fd.append('m_type', 'recording');
      fd.append('meta', '');

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
    debugger;
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
    if (selectedSpeaker == null || selectedSpeaker == "") {
      BaseModal.warning({
        title: t('blinder.text.warning'),
        content: "Please select a person to speak your words.",
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
    fetch(`${ElevenLabsAPI}/v1/text-to-speech/${selectedSpeaker}?output_format=mp3_22050_32&optimize_streaming_latency=0&enable_logging=true`, options)
      .then(response => {
        streamToBlob(response.body as ReadableStream).then( blob => {
          const audioURL = URL.createObjectURL(blob as Blob);
          setText2speechAudioBlob(blob as Blob);
          setText2speechAudio(audioURL);
          setT2sButtonLoading(false);
          setT2sMetaData(payload.text);
          setHasNewSpeech(true);
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

  const showSpeechUploadError = () => {
    notificationController.error({ message: 'Saving is failed.' });
    setIsSpeechUploading(false);
    setVoiceUploadProgress(0);
  }
  const showSpeechUploadSuccess = () => {
    setHasNewSpeech(false);
    setIsSpeechUploading(false);
    onSubmitGeneratedSpeech();
    notificationController.success({ message: 'Upload Success.' });
  }
  const onGeneratedSpeechSavingClicked = () => {
    if (prevCertRecordID == '') {
      notificationController.error({ message: 'You should submit your certifications first before upload your voice.' });
      return;
    }
    if (text2speechAudioBlob == null) {
      notificationController.error({ message: 'Please generate an audio.' });
      return;
    }
    if (!user) {
      notificationController.error({ message: 'Login required.' });
      return;
    }
    setIsSpeechUploading(true);
    setSpeechUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();
      const fd = new FormData()

      fd.append('file', text2speechAudioBlob, 'record.mp3');
      fd.append('cert_id', prevCertRecordID);
      fd.append('user_id', user.email);
      fd.append('m_type', 'ai_gen');
      fd.append('meta', t2sMetaData);

      xhr.upload.addEventListener("progress", (event) => {
        setSpeechUploadProgress(((event.loaded / event.total) * 100))
      });

      xhr.addEventListener("loadend", (evt) => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          // const data = JSON.parse(xhr.response);
          showSpeechUploadSuccess();
          // showVoiceGenerator();
        } else {
          showSpeechUploadError();
        }
      });
      xhr.open("POST", `${BlinderAPIBasePath}/Prod/v1/VoiceProtect`, true);
      xhr.send(fd);
    } catch (e) {
      console.error(e);
      showSpeechUploadError();
    }
  }

  const confirmCloseProtectModal = () => {
    if (isRecording) {
      notificationController.warning({"message": "Please stop your recording before close."});
      return;
    }
    if (t2sButtonLoading) {
      notificationController.warning({"message": "You could not close while you are generating a speech."});
      return;
    }
    if (isRecUploading) {
      notificationController.warning({"message": "You could not close while you are saving your voice."});
      return;
    }
    if (isSpeechUploading) {
      notificationController.warning({"message": "You could not close while you are saving the speech."});
      return;
    }
    if (!hasNewSpeech && !hasNewVoice) {
      onClose();
      return;
    }
    confirm({
      title: 'Confirm',
      content: 'Are you sure to discard your voice or generated speech?',
      onOk() {
        onClose();
      }
    });
  }

  const uploadVoice = () => {
    void(0);
  }
  /*************************************************/

  const showCustomFileUploadSuccess = () => {
    onSubmitCustomFile();
    notificationController.success({ message: 'Upload Success.' });
  }
  const showCustomFileUploadError = () => {
    onSubmitCustomFile();
    notificationController.error({ message: 'Upload Failed.' });
  }
  const uploadCustomFile = (file:RcFile) => {
    if (prevCertRecordID == '') {
      notificationController.error({ message: 'You should submit your certifications first before upload your work.' });
      return;
    }
    if (!user) {
      notificationController.error({ message: 'Login required.' });
      return;
    }
    setIsCustomFileUploading(true);
    try {
      const xhr = new XMLHttpRequest();
      const fd = new FormData()

      fd.append('file', file);
      fd.append('cert_id', prevCertRecordID);
      fd.append('user_id', user.email);
      fd.append('m_type', 'local');
      fd.append('meta', file.name);

      xhr.upload.addEventListener("progress", (event) => {
        setCustomFileUploadProgress(((event.loaded / event.total) * 100))
      });

      xhr.addEventListener("loadend", (evt) => {
        setIsCustomFileUploading(false);
        if (xhr.readyState === 4 && xhr.status === 200) {
          showCustomFileUploadSuccess();
        } else {
          showCustomFileUploadError();
        }
      });
      xhr.open("POST", `${BlinderAPIBasePath}/Prod/v1/VoiceProtect`, true);
      xhr.send(fd);
    } catch (e) {
      console.error(e);
      setIsCustomFileUploading(false);
    }
  }

  const props: UploadProps = {
    beforeUpload: file => {
      uploadCustomFile(file);
      return false;
    },
  };

  return (
    <BaseModal
      centered
      open={isProtectModalOpen}
      width={"1000px"}
      onCancel={() => confirmCloseProtectModal()}
      bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
      footer={[
        <Button key="back" onClick={() => confirmCloseProtectModal()}>
          Close
        </Button>
      ]}
    >
      <Space direction="vertical" size="small">
        <BaseTypography.Title level={4}>Record yourself:</BaseTypography.Title>
        <BaseTypography.Text>Record yourself saying the following script and singing the following lyrics. Blinder will
          generate a unique voice ID and pattern for you that you can use to protect your voice
          likeness:</BaseTypography.Text>
        <BaseTypography.Text>Say: How now brown cow?</BaseTypography.Text>
        <BaseTypography.Text>Sing: Twinkle Twinkle Little Star</BaseTypography.Text>
        <BaseRow>
          <BaseCol flex="450px">
            <BaseRow style={{ marginBottom: "8px" }}>
              <Checkbox checked={isRecordingAutoUpload} onChange={OnIsRecordingAutoUploadChange}>Upload my voice
                automatically</Checkbox>
            </BaseRow>
            <Space size="middle">
              {isRecording ? (
                <DefaultButton size="middle" onClick={onStopRecordingClicked}>Stop Recording</DefaultButton>
              ) : (
                <DefaultButton size="middle" onClick={onStartRecordingClicked}>Start Recording</DefaultButton>
              )}
              <DefaultButton danger={hasNewVoice} size="middle" onClick={onVoiceSavingClicked}
                             loading={isRecUploading}>Save</DefaultButton>
            </Space>
          </BaseCol>
          <BaseCol flex="auto">
            <BaseRow style={{ marginBottom: "8px" }}>
              <BaseTypography.Text>Recording
                Time:</BaseTypography.Text><BaseTypography.Text>{voiceRecTime}</BaseTypography.Text>
            </BaseRow>
            <BaseRow>
              <audio src={recordedAudio} style={{ "width": "100%" }} controls></audio>
            </BaseRow>
          </BaseCol>
          {voiceUploadProgress > 0 ? <Progress percent={voiceUploadProgress} showInfo={false} /> : null}
        </BaseRow>
      </Space>
      <Divider dashed />
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Space size="middle">
          <BaseTypography.Title level={4}>Transform your text into speech with</BaseTypography.Title>
          <Select
            placeholder="???"
            options={text2speechSpeakers}
            style={{ width: '150px' }}
            dropdownMatchSelectWidth={false}
            onChange={(val) => setSelectedSpeaker(val)}
          />
        </Space>
        <TextArea
          placeholder="Feel free to type your words to have them voiced by AI."
          autoSize={{ minRows: 2, maxRows: 6 }}
          maxLength={100}
          value={text2speechContent} onChange={(e) => setText2speechContent(e.target.value)}
        />
        <BaseRow>
          <BaseCol flex="450px">
            <Space size="middle">
              <DefaultButton onClick={onGenerateSpeechClicked} loading={t2sButtonLoading}>Generate</DefaultButton>
              <DefaultButton danger={hasNewSpeech} onClick={onGeneratedSpeechSavingClicked}
                             loading={isSpeechUploading}>Save</DefaultButton>
            </Space>
          </BaseCol>
          <BaseCol flex="auto">
            <audio src={text2speechAudio} style={{ "width": "100%" }} controls></audio>
          </BaseCol>
          {speechUploadProgress > 0? <Progress percent={speechUploadProgress} showInfo={false} /> : null}
        </BaseRow>
      </Space>
      <Divider dashed />
      <BaseRow>
        <Upload {...props} showUploadList={false}>
          <DefaultButton icon={<UploadOutlined />} loading={isCustomFileUploading}>Click to Upload</DefaultButton>
        </Upload>
        {customFileUploadProgress > 0 ? <Progress percent={customFileUploadProgress} /> : null}
      </BaseRow>
      {showCertificateInfo ? (
        <>
          <Divider dashed />
          <BaseRow style={{ marginBottom: "0.5rem" }}>
            <BaseCol flex="1 1 200px">
              <BaseTypography.Title level={4}>Your Certificate</BaseTypography.Title>
            </BaseCol>
            <BaseCol flex="0 1 300px">
              <BaseRow justify="end">
                <BaseButton onClick={onOpenCertificationModal}>Update your certificate</BaseButton>
              </BaseRow>
            </BaseCol>
          </BaseRow>
          <S.StyledRow align="center">
            <S.Bubble>
              <BaseTypography.Paragraph ellipsis={{ rows: 5, expandable: true }} style={{ "color": "white" }}>
                {chatGPTData}
              </BaseTypography.Paragraph>
            </S.Bubble>
          </S.StyledRow>
        </>
      ) : (
        <></>
      )}
    </BaseModal>
  );
};
