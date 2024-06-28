import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Input, Space } from "antd";
import { BaseButton, DefaultButton } from "@app/components/common/BaseButton/BaseButton";
import { useTranslation } from "react-i18next";

import { BaseSelect, Option } from "@app/components/common/selects/BaseSelect/BaseSelect";
import * as S from './Blinder.styles';
import { useAppSelector } from "@app/hooks/reduxHooks";
import { SearchData } from '@app/interfaces/interfaces';
import {
  ICertificationData,
  searchCertifications,
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
import { Dates } from "@app/constants/Dates";

const { Search } = Input;
const defaultSearchData = {
  keyword: '',
  type: '',
  user: '',
}
const SearchResultPage: React.FC = () => {
  const { t } = useTranslation();
  const search = useAppSelector((state) => state.search.search);
  const [searchCondition, setSearchCondition] = useState<SearchData>(defaultSearchData);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<ICertificationData[]>([]);

  useEffect(() => {
    setSearchCondition(search);
    if (search.keyword == '') {
      return;
    }
    doSearch(search);
  }, [search]);

  const doSearch = (search:SearchData) => {
    setIsSearching(true);
    searchCertifications(search).then((responseData) => {
      setIsSearching(false);
      if (!responseData) {
        notificationController.error({ message: `Server connection failed` });
        return;
      }
      if (responseData.status == 0) {
        notificationController.warning({ message: `Error: ${responseData.message}` });
        return;
      }
      if (responseData?.certifications && responseData.certifications.Count > 0) {
        setSearchResult(responseData.certifications.Items);
      } else {
        notificationController.warning({ message: `Could not find certifications.` });
        setSearchResult([]);
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

  const columns = [
    {
      title: 'Certification ID',
      dataIndex: 'certID',
      key: 'certID',
    },
    {
      title: 'Data Type',
      dataIndex: 'dataType',
      key: 'dataType',
    },
    {
      title: 'Nature of work',
      dataIndex: 'natureOfWork',
      key: 'natureOfWork',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_:string, record:ICertificationData) => (
        <>{Dates.format(record.createdAt, 'D MMMM YYYY HH:mm')}</>
      )
    },
    {
      title: 'Action',
      dataIndex: 'act',
      key: 'action',
      render: (_: string, record: ICertificationData) => (
        <Space size="middle">
          <Link to={`/cert?cert_id=${record.certID}`}>Details</Link>
        </Space>
      ),
    }
  ];
  return (
    <S.RightSideWrapper>
      <S.StyledRow align="center">
        <Search
          placeholder={t('header.search')}
          allowClear
          enterButton="Search"
          value={searchCondition.keyword}
          onChange={(e) => setSearchCondition({
            keyword: e.target.value,
            type: 'search',
            userID: '',
          })}
          onSearch={onSearchButtonClicked}
          loading={isSearching}
          style={{ width: '100%' }}
        />
      </S.StyledRow>
      <BaseTable
        columns={columns}
        dataSource={searchResult}
        // pagination={tableData.pagination}
        // loading={tableData.loading}
        // onChange={handleTableChange}
        scroll={{ x: 800 }}
        loading={isSearching}
        bordered
      />
    </S.RightSideWrapper>
  );
};
export default SearchResultPage;