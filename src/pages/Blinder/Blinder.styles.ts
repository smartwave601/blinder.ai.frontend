import styled from 'styled-components';
import { media } from '@app/styles/themes/constants';
import * as React from "react";

export const BlinderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: nowrap;
`;

export const ChatboxWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`

export const LeftSideWrapper = styled.div`
  padding-top: 100px;
`;

export const RightSideWrapper = styled.div`
    padding-top: 100px;
`;

export const Text = styled.span`
  display: flex;
  align-items: center;
  white-space: pre-wrap;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  @media only screen and ${media.xl} {
    margin-bottom: 0;
  }
`;

export const TextCenter = styled.div`
  text-align: center;
`;
export const Icons = styled.div`
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  display: flex;
  flex-wrap: nowrap;

  svg {
    font-size: 2rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
`;


export const VirtBar = styled.div`
    display: block;
    width: 1px;
    border: 1px solid #000;
    margin-left: 20px;
    margin-right: 20px;
`;

interface IStyledRowPros {
  align?: string;
  paddingY?: string;
  paddingX?: string;
  paddingBottom?: string;
  paddingTop?: string;
}

export const StyledRow = styled.div<IStyledRowPros>`
    display: flex;
    justify-content: ${props => props.align || "flex-start"};
    margin-bottom: 10px;
`;

export const Bubble = styled.div`
    white-space: pre-wrap;
    background-color: #000;
    color: #EDEAE2;
    padding: 10px;
    border-radius: 15px;
    width: 85%;
`;

export const Link = styled.a`
  display: flex;
  align-items: center;
  white-space: pre-wrap;
  flex-wrap: wrap;
  margin-bottom: 0;
`;
export const ExpandingDiv = styled.div`
    height: 60px;
    flex-grow: 2;
`;