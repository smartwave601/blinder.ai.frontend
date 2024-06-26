import React, { useEffect, useState } from "react";
import { Input } from 'antd';
import { Select } from 'antd';
import { BaseButton, DefaultButton } from "@app/components/common/BaseButton/BaseButton";
import { useTranslation } from "react-i18next";

import { BaseSelect, Option } from "@app/components/common/selects/BaseSelect/BaseSelect";
import * as S from './Blinder.styles';
import { useAppSelector } from "@app/hooks/reduxHooks";
import { SearchData } from '@app/interfaces/interfaces';
import {
  CertificationData,
  getCertification,
  DerivativeData,
  getDerivatives,
} from "@app/api/blinder.api";
import { notificationController } from "@app/controllers/notificationController";
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseTypography } from "@app/components/common/BaseTypography/BaseTypography";
import { BaseTable } from "@app/components/common/BaseTable/BaseTable";
import { BaseInput } from "@app/components/common/inputs/BaseInput/BaseInput";
import { setKeyword } from "@app/store/slices/searchSlice";

const { Search } = Input;

const SearchResultPage: React.FC = () => {
  const { t } = useTranslation();
  const search = useAppSelector((state) => state.search.search);
  const [searchCondition, setSearchCondition] = useState<SearchData>();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<CertificationData[]>([]);
  const [derivatives, setDerivatives] = useState<DerivativeData[]>([]);


  useEffect(() => {
    setSearchCondition(search);
    if (search.keyword == '') {
      return;
    }
    doSearch(search);
  }, [search]);

  const doSearch = (search:SearchData) => {
    // setIsSearching(true);
    getCertification(search).then((responseData) => {
      setIsSearching(false);
      if (!responseData) {
        notificationController.error({ message: `Server connection failed` });
        return;
      }
      if (responseData?.status == 0) {
        notificationController.warning({ message: `Could not find certification.` });
        return;
      }
      if (responseData?.certifications && responseData.certifications.Count > 0) {
        setSearchResult(responseData.certifications.Items);
        getDerivatives({certID: responseData.certifications.Items[0].certID}).then((derivativeData)=> {
          if (!derivativeData) {
            notificationController.error({ message: `Server connection failed` });
            return;
          }
          if (derivativeData?.status == 0) {
            notificationController.warning({ message: `Could not find certInfo` });
            return;
          }
          if (derivativeData?.list && derivativeData.list.Count > 0) {
            setDerivatives(derivativeData.list.Items);
          }
        }).catch((e) => {
          console.error(e);
          notificationController.error({ message: e.message });
        })
      }
    }).catch((e) => {
      setIsSearching(false);
      notificationController.error({ message: e.message });
    });
  }

  const onSearchButtonClicked = (value: string) => {
    const newSearchCond:SearchData = {
      keyword: value,
      type: 'search',
    };
    setSearchCondition(newSearchCond);
    doSearch(newSearchCond);
  }
  // const dataSource = [
  //   {
  //     key: '1',
  //     name: 'Mike',
  //     age: 32,
  //     address: '10 Downing Street',
  //   },
  //   {
  //     key: '2',
  //     name: 'John',
  //     age: 42,
  //     address: '10 Downing Street',
  //   },
  // ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'itemID',
      key: 'itemID',
    },
    {
      title: 'Type',
      dataIndex: 'mType',
      key: 'mType',
    },
    {
      title: 'Path',
      dataIndex: 's3Path',
      key: 's3Path',
    },
    {
      title: 'Meta',
      dataIndex: 'metaData',
      key: 'metaData',
    },
    {
      title: 'CreatedAt',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];
  return (
    <S.RightSideWrapper>
      <S.StyledRow align="center">
        {/*<Search*/}
        {/*  placeholder={t('header.search')}*/}
        {/*  allowClear*/}
        {/*  enterButton="Search"*/}
        {/*  value={searchCondition?.keyword}*/}
        {/*  onSearch={onSearchButtonClicked}*/}
        {/*  loading={isSearching}*/}
        {/*  style={{ width: 400 }}*/}
        {/*/>*/}
      </S.StyledRow>
      {searchResult.map((item, index)=> (
        <BaseRow key={index}>
          <BaseCol md={12}>
            <BaseRow>
              ID: {item.certID}
            </BaseRow>
            <BaseRow>
              Data Type: {item.dataType}
            </BaseRow>
            <BaseRow>
              Created At: {item.createdAt}
            </BaseRow>
            <BaseRow>
              <S.Bubble>
                {item.chatGPT}
              </S.Bubble>
            </BaseRow>
          </BaseCol>
          <BaseCol md={12}>
            <BaseRow>
              <BaseTypography.Title level={3}>Derivatives</BaseTypography.Title>
              <DefaultButton>Append</DefaultButton>
            </BaseRow>
            <BaseTable
              columns={columns}
              dataSource={derivatives}
              // pagination={tableData.pagination}
              // loading={tableData.loading}
              // onChange={handleTableChange}
              scroll={{ x: 800 }}
              bordered
            />
          </BaseCol>
        </BaseRow>
      ))}
    </S.RightSideWrapper>
  );
};
export default SearchResultPage;