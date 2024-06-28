import React from 'react';
import { DatePicker, Select } from 'antd';
import { useTranslation } from "react-i18next";

import * as S from './Form.styles';

import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseButton, LinkButton } from "@app/components/common/BaseButton/BaseButton";
import { BaseForm } from "@app/components/common/forms/BaseForm/BaseForm";
import { BaseImage } from "@app/components/common/BaseImage/BaseImage";
import { BaseTypography } from "@app/components/common/BaseTypography/BaseTypography";
import { DayjsDatePicker } from "@app/components/common/pickers/DayjsDatePicker";

export const CertificationForm: React.FC = () => {
  const { t } = useTranslation();

  const dataTypes = [
    { value: 'CP', label: t('blinder.certType.cinema') },
    { value: 'VF', label: t('blinder.certType.video') },
    { value: 'AF', label: t('blinder.certType.audio') },
    { value: 'MD', label: t('blinder.certType.meta') },
    { value: 'SC', label: t('blinder.certType.script') },
    { value: 'DR', label: t('blinder.certType.drawing') },
    { value: 'PH', label: t('blinder.certType.photo') },
    { value: 'WW', label: t('blinder.certType.written') },
    { value: 'OT', label: t('blinder.certType.other') },
  ];
  const handleSubmit = () => {
    return '';
  }

  return (
    <>
    {/*<BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional">*/}
      <BaseRow justify="center">
        <BaseImage src="https://basicannon.s3.amazonaws.com/blinder+Main+Logo.png" preview={false} style={{height: '70px'}} />
      </BaseRow>
      <BaseTypography>{t('blinder.text.welcome')}</BaseTypography>
      <S.FormItem
        name="dataType"
        label={t('blinder.certFormLabels.dataType')}
        rules={[{ required: true, message: t('common.requiredField') }]}
      >
        <Select
          placeholder={t('blinder.jurisdictions.selectJurisdiction')}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={dataTypes}
        />
      </S.FormItem>
      <S.FormItem
        name="natureOfWork"
        label={t('blinder.certFormLabels.natureOfWork')}
      >
        <S.FormInput />
      </S.FormItem>
      <S.FormItem
        name="workDescription"
        label={t('blinder.certFormLabels.workDescription')}
      >
        <S.FormInput />
      </S.FormItem>
      <S.FormItem
        name="creationDate"
        label={t('blinder.certFormLabels.creationDate')}
      >
        {/*<S.FormInput />*/}
        {/*<DayjsDatePicker format="L" style={{"width": "100%"}} />*/}
        <DatePicker format="MM/DD/YYYY" style={{"width": "100%"}}></DatePicker>
      </S.FormItem>
      <S.FormItem
        name="author"
        label={t('blinder.certFormLabels.author')}
      >
        <S.FormInput />
      </S.FormItem>
      <S.FormItem
        name="ownershipDetails"
        label={t('blinder.certFormLabels.ownershipDetails')}
      >
        <S.FormInput />
      </S.FormItem>
      <S.FormItem
        name="publicationStatus"
        label={t('blinder.certFormLabels.publicationStatus')}
      >
        <S.FormInput />
      </S.FormItem>
      <S.FormItem
        name="priorVersions"
        label={t('blinder.certFormLabels.priorVersions')}
      >
        <S.FormInput />
      </S.FormItem>
      <S.FormItem
        name="thirdPartyContent"
        label={t('blinder.certFormLabels.thirdPartyContent')}
      >
        <S.FormInput />
      </S.FormItem>
      <S.FormItem
        name="intendedUse"
        label={t('blinder.certFormLabels.intendedUse')}
      >
        <S.FormInput />
      </S.FormItem>
      <S.FormItem
        name="registrationObjectives"
        label={t('blinder.certFormLabels.registrationObjectives')}
      >
        <S.FormInput />
      </S.FormItem>
      <S.FormItem
        name="digitalContent"
        label={t('blinder.certFormLabels.digitalContent')}
      >
        <S.FormInput />
      </S.FormItem>
      <S.FormItem
        name="externalAgreement"
        label={t('blinder.certFormLabels.externalAgreement')}
      >
        <S.FormInput />
      </S.FormItem>
    {/*</BaseForm>*/}
    </>
  );
};
