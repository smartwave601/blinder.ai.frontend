import React from 'react';
import { ProfileOverlay } from '../ProfileOverlay/ProfileOverlay';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './ProfileDropdown.styles';
import { BasePopover } from '@app/components/common/BasePopover/BasePopover';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';
import { BaseButton } from "@app/components/common/BaseButton/BaseButton";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

const avatarImg = process.env.REACT_APP_ASSETS_BUCKET + '/avatars/avatar5.webp';

export const ProfileDropdown: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isTablet } = useResponsive();

  const user = useAppSelector((state) => state.user.user);

  const gotoLoginPage = () => {
    navigate('/auth/login');
  }

  return user ? (
    <BasePopover content={<ProfileOverlay />} trigger="click">
      <S.ProfileDropdownHeader as={BaseRow} gutter={[10, 10]} align="middle">
        <BaseCol>
          {/*<BaseAvatar src={user.imgUrl} alt="User" shape="circle" size={40} />*/}
          <BaseAvatar src="{avatarImg}" alt="User" shape="circle" size={40} />
        </BaseCol>
        {isTablet && (
          <BaseCol>
            <span>{`${user.firstName} ${user.lastName[0]}`}</span>
          </BaseCol>
        )}
      </S.ProfileDropdownHeader>
    </BasePopover>
  ) : (
    <BaseButton type="primary" onClick={gotoLoginPage}>{t('blinder.buttons.login')}</BaseButton>
  );
};
