import React from 'react';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { NotificationsDropdown } from '../components/notificationsDropdown/NotificationsDropdown';
import { ProfileDropdown } from '../components/profileDropdown/ProfileDropdown/ProfileDropdown';
import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
import { SettingsDropdown } from '../components/settingsDropdown/SettingsDropdown';
import { HeaderFullscreen } from '../components/HeaderFullscreen/HeaderFullscreen';
import * as S from '../Header.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import notFoundImg from "@app/assets/images/nothing-found.webp";
import { BaseButton } from "@app/components/common/BaseButton/BaseButton";

interface DesktopHeaderProps {
  isTwoColumnsLayout: boolean;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ isTwoColumnsLayout }) => {
  const leftSide = isTwoColumnsLayout ? (
    <S.SearchColumn xl={16} xxl={17}>
      <BaseRow justify="space-between">
        <BaseCol xl={15} xxl={12}>
          <HeaderSearch />
        </BaseCol>
        <BaseCol>
          <S.GHButton />
        </BaseCol>
      </BaseRow>
    </S.SearchColumn>
  ) : (
    <>
      <BaseCol lg={13}>
        <BaseRow justify="center" align="middle">
          <S.Image src="https://basicannon.s3.amazonaws.com/blinder+Main+Logo.png" alt="Blinder" preview={false} style={{height: '70px'}}  />
          <S.Image src="https://basicannon.s3.amazonaws.com/cancellation-x.svg" alt="x" preview={false} style={{height: '40px'}} />
          <S.Image src="https://s3.amazonaws.com/blinder.copyright/seal2004-removebg-preview.png" alt="govCopyright" preview={false} style={{height: '120px'}} />
        </BaseRow>
      </BaseCol>
      <BaseCol lg={8}>
        <BaseRow align="middle" justify="space-around">
          <Link to="/">
            <BaseButton type="primary"><HomeOutlined />Home</BaseButton>
          </Link>
          <HeaderSearch />
        </BaseRow>
      </BaseCol>
    </>
  );

  return (
    <BaseRow justify="space-between" align="top">
      {leftSide}

      <S.ProfileColumn xl={3} $isTwoColumnsLayout={isTwoColumnsLayout}>
        <BaseRow align="middle" justify="end" gutter={[5, 5]}>
          <BaseCol>
            <BaseRow gutter={[{ xxl: 5 }, { xxl: 5 }]}>
              <BaseCol>
                <HeaderFullscreen />
              </BaseCol>

              {/*<BaseCol>*/}
              {/*  <NotificationsDropdown />*/}
              {/*</BaseCol>*/}

              <BaseCol>
                <SettingsDropdown />
              </BaseCol>
            </BaseRow>
          </BaseCol>

          <BaseCol>
            <ProfileDropdown />
          </BaseCol>
        </BaseRow>
      </S.ProfileColumn>
    </BaseRow>
  );
};
