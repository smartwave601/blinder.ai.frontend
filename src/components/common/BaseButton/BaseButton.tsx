import React from 'react';
import { ButtonProps as AntButtonProps, Button as AntdButton } from 'antd';
import { Severity } from '@app/interfaces/interfaces';
import * as S from './BaseButton.styles';
import styled from "styled-components";
import { BASE_COLORS } from "@app/styles/themes/constants";

export const { Group: ButtonGroup } = AntdButton;

export interface BaseButtonProps extends AntButtonProps {
  severity?: Severity;
  noStyle?: boolean;
}

export const BaseButton = React.forwardRef<HTMLElement, BaseButtonProps>(
  ({ className, severity, noStyle, children, ...props }, ref) => (
    <S.Button ref={ref} className={className} $noStyle={noStyle} {...props} $severity={severity}>
      {children}
    </S.Button>
  ),
);

export const DefaultButton = styled(BaseButton)`
    width: 200px;
    white-space: break-spaces;
    height: auto;
`;

// export const LinkButton = React.forwardRef<HTMLElement, AntButtonProps>(
//   ({ className, children, ...props }) => (
//     <S.LinkButton className={className} {...props} >
//       {children}
//     </S.LinkButton>
//   ),
// )

export const LinkButton = styled.a`
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;