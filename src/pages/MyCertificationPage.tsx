import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from "@app/components/common/BaseRow/BaseRow";
import { BaseCol } from "@app/components/common/BaseCol/BaseCol";
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseForm } from "@app/components/common/forms/BaseForm/BaseForm";
import { BaseTable } from "@app/components/common/BaseTable/BaseTable";
import { SearchData } from "@app/interfaces/interfaces";
import { ICertificationData, searchCertifications, getDerivatives } from "@app/api/blinder.api";
import { notificationController } from "@app/controllers/notificationController";
import { useAppSelector } from "@app/hooks/reduxHooks";
import { BasicTableRow } from "@app/api/table.api";
import { Dates } from "@app/constants/Dates";
import { Link } from "react-router-dom";



const MyCertificationPage: React.FC = () => {
  const { t } = useTranslation();

  const [isSearching, setIsSearching] = useState(false);

  const [searchResult, setSearchResult] = useState<ICertificationData[]>([]);

  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (user) {
      doSearch({
        keyword: '',
        type: 'fetch',    // "search" or "fetch"
        userID: user?.email,
      });
    }
  }, [user]);

  const doSearch = (search:SearchData) => {
    setIsSearching(true);
    searchCertifications(search).then((responseData) => {
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
      }
    }).catch((e) => {
      setIsSearching(false);
      notificationController.error({ message: e.message });
    });
  }
  const columns: ColumnsType<ICertificationData> = [
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
      dataIndex: 'certID',
      render: (_:string, record:ICertificationData) => (
        <Space size="middle">
          <Link to={`/cert?cert_id=${record.certID}`}>Details</Link>
        </Space>
      ),
    },
  ];
  return (
    <>
      <PageTitle>Certifications</PageTitle>
      <BaseCard>
        <BaseRow gutter={[0, 30]}>
          <BaseForm.Title>My Certifications</BaseForm.Title>
          <BaseCol span={24}>
            <BaseTable
              columns={columns}
              dataSource={searchResult}
              loading={isSearching}
              bordered
            />
          </BaseCol>
        </BaseRow>
      </BaseCard>
    </>
  );
};

export default MyCertificationPage;
