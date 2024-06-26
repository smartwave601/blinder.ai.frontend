import styled from 'styled-components';
import { FormTitle } from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { BaseForm } from "@app/components/common/forms/BaseForm/BaseForm";
import { FONT_SIZE, FONT_WEIGHT } from "@app/styles/themes/constants";
import { BaseInput as CommonInput } from "@app/components/common/inputs/BaseInput/BaseInput";
import { InputPassword as CommonInputPassword } from "@app/components/common/inputs/InputPassword/InputPassword";
import { BaseButton } from "@app/components/common/BaseButton/BaseButton";

export const Title = styled(FormTitle)`
  margin-bottom: 1.875rem;
`;

export const FormItem = styled(BaseForm.Item)`
  margin-bottom: 0.75rem;
  & .ant-form-item-control-input {
    min-height: 3.125rem;
  }

  & .ant-form-item-explain-error {
    font-size: ${FONT_SIZE.xs};
  }

  & label {
    color: var(--primary-color);
    font-size: ${FONT_SIZE.xs};
    line-height: 1.25rem;
  }

  &.ant-form-item-has-feedback .ant-input-affix-wrapper .ant-input-suffix {
    padding-right: 1.5rem;
  }
`;

export const FormInput = styled(CommonInput)`
  color: var(--text-main-color);
  background: transparent;

  & input.ant-input {
    background: transparent;
  }
`;

export const FormInputPassword = styled(CommonInputPassword)`
  color: var(--text-main-color);
  background: transparent;

  & input.ant-input {
    background: transparent;
  }
`;

export const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

export const SubmitButton = styled(BaseButton)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
  width: 100%;
`;
