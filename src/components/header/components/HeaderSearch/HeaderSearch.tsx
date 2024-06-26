import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import { useLocation } from 'react-router';
import { Input } from 'antd';
import { addDeferredPrompt } from '@app/store/slices/pwaSlice'
import { SearchDropdown } from '../searchDropdown/SearchDropdown';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { components as configComponents, Component } from '@app/constants/config/components';
import { categoriesList, CategoryType } from '@app/constants/categoriesList';
import { useResponsive } from '@app/hooks/useResponsive';
import { setKeyword } from '@app/store/slices/searchSlice';
import * as S from './HeaderSearch.styles';
const { Search } = Input;
export interface CategoryComponents {
  category: CategoryType;
  components: Component[];
}

export const HeaderSearch: React.FC = () => {
  const { mobileOnly, isTablet } = useResponsive();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const { t } = useTranslation();

  const [query, setQuery] = useState('');
  const [components] = useState<Component[]>(configComponents);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isOverlayOpen, setOverlayOpen] = useState(false);

  const sortedResults = query
    ? categoriesList.reduce((acc, current) => {
        const searchResults = components.filter(
          (component) =>
            component.categories.includes(current.name) &&
            component.keywords.some((keyword) => keyword.includes(query)),
        );

        return searchResults.length > 0 ? acc.concat({ category: current.name, components: searchResults }) : acc;
      }, [] as CategoryComponents[])
    : null;

  useEffect(() => {
    setModalOpen(false);
    setOverlayOpen(false);
  }, [pathname]);

  const onSearch = (value: string) => {
    console.log(value);
    dispatch(setKeyword({keyword: value, type: 'search'}));
    navigate('/certs');
  }

  return (
    <>
      {mobileOnly && (
        <>
          <BaseButton
            type={isModalOpen ? 'ghost' : 'text'}
            icon={<S.SearchIcon onClick={() => setModalOpen(true)} />}
          />
          <S.SearchModal
            open={isModalOpen}
            closable={false}
            footer={null}
            onCancel={() => setModalOpen(false)}
            destroyOnClose
          >
            <SearchDropdown
              query={query}
              setQuery={setQuery}
              data={sortedResults}
              isOverlayOpen={isOverlayOpen}
              setOverlayOpen={setOverlayOpen}
            />
          </S.SearchModal>
        </>
      )}

      {isTablet && (
        // <SearchDropdown
        //   query={query}
        //   setQuery={setQuery}
        //   data={sortedResults}
        //   isOverlayOpen={isOverlayOpen}
        //   setOverlayOpen={setOverlayOpen}
        // />
        <Search
          placeholder={t('header.search')}
          allowClear
          enterButton="Search"
          onSearch={onSearch}
          style={{ width: 400 }}
        />
      )}
    </>
  );
};
