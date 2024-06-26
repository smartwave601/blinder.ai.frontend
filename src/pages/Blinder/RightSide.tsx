import React from 'react';
import { Select } from 'antd';
import * as S from './Blinder.styles';
import { BaseButton, DefaultButton } from "@app/components/common/BaseButton/BaseButton";
import { useTranslation } from "react-i18next";
import { BaseSelect, Option } from "@app/components/common/selects/BaseSelect/BaseSelect";

export const RightSide: React.FC = () => {
  const { t } = useTranslation();

  const jurisdictions = [
    { value: 'us', label: t('blinder.jurisdictions.usCopyright') },
    { value: 'uk', label: t('blinder.jurisdictions.ukCopyright') },
    { value: 'eu', label: t('blinder.jurisdictions.euCopyright') },
    { value: 'ca', label: t('blinder.jurisdictions.canadaCopyright') },
    { value: 'au', label: t('blinder.jurisdictions.australiaCopyright') },
    { value: 'jp', label: t('blinder.jurisdictions.japanCopyright') },
    { value: 'cn', label: t('blinder.jurisdictions.chinaCopyright') },
    { value: 'de', label: t('blinder.jurisdictions.germanCopyright') },
    { value: 'fr', label: t('blinder.jurisdictions.inpiCopyright') },
    { value: 'in', label: t('blinder.jurisdictions.indiaCopyright') },
    { value: 'br', label: t('blinder.jurisdictions.brazilCopyright') },
    { value: 'kr', label: t('blinder.jurisdictions.koreaCopyright') },
    { value: 'mx', label: t('blinder.jurisdictions.mexicoCopyright') },
    { value: 'ru', label: t('blinder.jurisdictions.russiaCopyright') },
    { value: 'es', label: t('blinder.jurisdictions.spanishCopyright') },
    { value: 'it', label: t('blinder.jurisdictions.italianCopyright') },
    { value: 'nl', label: t('blinder.jurisdictions.boipCopyright') },
    { value: 'ch', label: t('blinder.jurisdictions.swissCopyright') },
    { value: 'ar', label: t('blinder.jurisdictions.argentinaCopyright') },
    { value: 'pl', label: t('blinder.jurisdictions.polandCopyright') },
    { value: 'tr', label: t('blinder.jurisdictions.turkeyCopyright') },
    { value: 'se', label: t('blinder.jurisdictions.swedishCopyright') },
    { value: 'za', label: t('blinder.jurisdictions.safCopyright') },
    { value: 'il', label: t('blinder.jurisdictions.israelCopyright') },
    { value: 'sg', label: t('blinder.jurisdictions.singaporeCopyright') },
    { value: 'dk', label: t('blinder.jurisdictions.danishCopyright') },
    { value: 'no', label: t('blinder.jurisdictions.norwegianCopyright') },
    { value: 'fi', label: t('blinder.jurisdictions.finnishCopyright') },
    { value: 'be', label: t('blinder.jurisdictions.belgianCopyright') },
  ]

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
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
        />
      </S.StyledRow>
      <S.StyledRow align="center">
        <DefaultButton type="primary">{t('blinder.buttons.fileCopyright')}</DefaultButton>
      </S.StyledRow>
      <S.StyledRow align="center">
        <DefaultButton type="primary">{t('blinder.buttons.share')}</DefaultButton>
      </S.StyledRow>
    </S.RightSideWrapper>
  );
};
