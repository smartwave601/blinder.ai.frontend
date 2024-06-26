import React from 'react';
import * as S from './Blinder.styles';
import { useTranslation } from 'react-i18next';
import { DefaultButton } from "@app/components/common/BaseButton/BaseButton";

export const LeftSide: React.FC = () => {
  const { t } = useTranslation();

  return (
    <S.LeftSideWrapper>
      <S.StyledRow align="center">
        <DefaultButton type="primary">{t('blinder.buttons.export')}</DefaultButton>
      </S.StyledRow>
      <S.StyledRow align="center">
        <DefaultButton type="primary">{t('blinder.buttons.upload')}</DefaultButton>
      </S.StyledRow>
      <S.StyledRow align="center">
        <DefaultButton type="primary">{t('blinder.buttons.reset')}</DefaultButton>
      </S.StyledRow>
      <S.StyledRow align="center">
        <DefaultButton type="primary">{t('blinder.buttons.fileCopyright')}</DefaultButton>
      </S.StyledRow>
    </S.LeftSideWrapper>
  );
};
