import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from "@app/components/common/BaseRow/BaseRow";
import { BaseCol } from "@app/components/common/BaseCol/BaseCol";
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseForm } from "@app/components/common/forms/BaseForm/BaseForm";
import { BaseTable } from "@app/components/common/BaseTable/BaseTable";

const MyCertificationPage: React.FC = () => {
  const { t } = useTranslation();

  const certifications = [
    {
      certID: 'aaaa',
      dataType: 'bbbb',
      natureOfWork: 'cccc',
      createdAt: 'dddd',
    },
    {
      certID: 'dddd',
      dataType: 'dddd',
      natureOfWork: 'dddd',
      createdAt: 'dddd',
    },
    {
      certID: 'ffff',
      dataType: 'ffff',
      natureOfWork: 'ffff',
      createdAt: 'ggggg',
    },
    {
      certID: 'hhhh',
      dataType: 'hhhh',
      natureOfWork: 'hhhh',
      createdAt: 'hhhh',
    },
    {
      certID: '1234',
      dataType: '1234',
      natureOfWork: '1234',
      createdAt: '1234',
    },
  ]
  const columns = [
    {
      title: 'ID',
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
    },
  ];
  return (
    <>
      <PageTitle>{t('profile.nav.payments.title')}</PageTitle>
      <BaseCard>
        <BaseRow gutter={[0, 30]}>
          <BaseForm.Title>{t('profile.nav.payments.paymentHistory')}</BaseForm.Title>
          <BaseCol span={24}>
            <BaseTable
              columns={columns}
              dataSource={certifications}
              bordered
            />
          </BaseCol>
        </BaseRow>
      </BaseCard>
    </>
  );
};

export default MyCertificationPage;
