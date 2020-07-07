import styled, { css } from 'styled-components';

import { Link } from 'react-router-dom';
import { shade } from 'polished';

interface PropsButton {
  isRed?: number;
}

export const Container = styled.div`
  margin: 100px auto 40px;
  width: 100%;
  max-width: 540px;
  padding: 10px;

  h1 {
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 26px;
  }

  p {
    margin-top: 73px;
    color: #bebeb9;
    line-height: 26px;
  }
`;

export const ContentSearch = styled.div`
  width: 100%;

  h1 {
    font-size: 18px;
    font-weight: 500;
    color: var(--color-white-primary);
    margin: 15px 0 18px 0;
  }
`;

export const BoxSearch = styled.ul`
  margin-bottom: 10px;
  list-style: none;
  width: 100%;
`;

export const RowSearch = styled.li`
  display: flex;
  align-items: center;
  height: 84px;

  & + li {
    border-top: 1px solid #242426;
  }
`;

export const LinkSearch = styled(Link)`
  display: flex;
  text-decoration: none;
  width: 100%;
  padding: 7px 0;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${shade(0.1, '#373739')};
  }

  span {
    color: #c4c4c4;
  }
`;

export const ImgSearch = styled.div`
  margin-left: 8px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const InfoSearch = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 15px;

  h2 {
    font-size: 18px;
    font-weight: 500;
    width: 100%;
    color: var(--color-white-primary);
    margin: 4px 0 12px;
  }
`;

export const LinkH2 = styled(Link)`
  font-size: 18px;
  font-weight: 500;
  align-self: flex-start;
  text-decoration: none;
  color: var(--color-white-primary);
  margin: 4px 0 12px;

  transition: color 0.2s;

  &:hover {
    color: ${shade(0.2, '#F9F7F0')};
  }
`;

export const ButtonOptions = styled.div`
  display: flex;
`;

export const ButtonSearch = styled.button<PropsButton>`
  background: transparent;
  text-align: center;
  flex-grow: 1;
  border: 0;
  font-size: 16px;
  transition: color 0.2s;

  & + button {
    border-left: 1px solid #242426;
  }

  color: #31d641;
  &:hover {
    color: ${shade(0.2, '#31d641')};
  }

  ${({ isRed }) =>
    isRed &&
    css`
      color: #d64531;
      &:hover {
        color: ${shade(0.2, '#d64531')};
      }
    `}
`;

export const Separator = styled.div`
  width: 100%;
  border-bottom: 2px solid #242426;
`;
