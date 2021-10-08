import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cardThemes } from 'constants/cardThemes';
import { FormItem } from 'components/profile/ProfileCard/ProfileFormNav/ProfileForm/ProfileForm.styles';
import * as S from './CardThemeItem.styles';
import { CreditCard } from '../interfaces';
import { Col, Row } from 'antd';

interface CardThemeItemProps {
  cardData: CreditCard;
  setCardData: (state: CreditCard) => void;
}

export const CardThemeItem: React.FC<CardThemeItemProps> = ({ cardData, setCardData }) => {
  const { t } = useTranslation();

  const handleChange = useCallback(
    (item) => () => {
      setCardData({ ...cardData, background: item.background });
    },
    [setCardData, cardData],
  );

  const themes = useMemo(
    () =>
      cardThemes.map((item) => (
        <Col xs={8} md={4} key={item.id}>
          <S.BackgroundWrapper background={item.background} isActive={cardData.background === item.background}>
            <S.Theme onClick={handleChange(item)} />
          </S.BackgroundWrapper>
        </Col>
      )),
    [cardData, handleChange],
  );

  return (
    <FormItem label={t('profile.nav.payments.cardTheme')}>
      <Row gutter={[10, 10]}>{themes}</Row>
    </FormItem>
  );
};