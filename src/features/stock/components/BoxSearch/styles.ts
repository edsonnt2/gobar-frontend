import { shade } from 'polished';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

interface PropsButton {
  isRed?: number;
}

export const Container = styled.ul`
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
