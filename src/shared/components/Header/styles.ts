import styled, { css } from 'styled-components';
import { shade } from 'polished';
import { Link } from 'react-router-dom';
import { PropsHeader } from '.';

interface PropsInfoMenu {
  isTop?: boolean;
}

export const Container = styled.div<PropsHeader>`
  grid-area: HB;

  width: 100%;
  background: var(--color-gray-secondary);
  border-bottom: 1px solid var(--color-border-gray);
  position: fixed;
  z-index: 2;

  > header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    ${({ isBusiness }) =>
      !isBusiness &&
      css`
        max-width: 1280px;
      `}
    margin: 0 auto;
    padding: 0 10px;
    height: 70px;
    align-items: center;
  }
`;

export const LogoAndSearch = styled.div`
  display: flex;
  align-items: center;

  > a {
    margin-right: 23px;
    margin-top: 5px;
  }
`;

export const SearchHeader = styled.div`
  background: #23211f;
  height: 46px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  padding: 0 10px;

  color: #626262;

  svg {
    width: 25px;
    height: 25px;
  }

  input {
    width: 200px;
    padding: 0 6px;
    border: 0;
    height: 46px;
    background: transparent;
    color: #fff;

    &::placeholder {
      color: #626262;
    }
  }
`;

export const OptionsUserHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const UserHader = styled.div`
  display: flex;
  align-items: center;
`;

export const ImgUser = styled.div`
  width: 55px;
  height: 55px;
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

export const InfoUser = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 45px 0 15px;
  line-height: 24px;

  span {
    color: var(--color-gray-primary);
  }

  strong {
    color: #e5a43a;
    font-weight: bold;
  }
`;

export const Menu = styled.nav`
  position: relative;
  display: flex;
`;

export const ButtonMenu = styled.span`
  background-color: #28282a;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--color-gray-primary);
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 5px;

  & + span {
    margin-left: 10px;
  }

  &:hover {
    background-color: ${shade(0.2, '#28282a')};
  }
`;

export const BoxMenu = styled.div`
  background: #333337;
  border: 1px solid #242427;
  width: 280px;
  border-radius: 6px;
  max-height: 580px;
  position: absolute;
  z-index: 3;
  right: 0;
  top: calc(100% + 5px);
  overflow-x: auto;

  h2 {
    margin-top: 8px;
    margin-left: 10px;
    color: var(--color-yellow-primary);
    font-size: 14px;
    font-weight: 500;
  }
`;

export const BoxInfoMenu = styled.div`
  display: flex;
  align-items: center;
  margin: 2px 0;
  padding: 6px 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${shade(0.2, '#333337')};
  }
`;

export const ImgMenu = styled.div`
  width: 40px;
  height: 40px;
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

export const InfoMenu = styled.div<PropsInfoMenu>`
  display: flex;
  flex-direction: column;
  margin-left: 10px;

  strong {
    color: var(--color-white-primary);
    font-weight: 500;
  }

  span {
    font-size: 14px;
    ${({ isTop }) =>
      isTop
        ? css`
            margin-bottom: 5px;
          `
        : css`
            margin-top: 5px;
          `}

    color: var(--color-gray-primary);
  }
`;

export const LinkOption = styled(Link)`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 15px;
  text-decoration: none;
  margin: 14px 0 14px 22px;
  color: var(--color-white-primary);
  transition: color 0.2s;

  svg {
    margin-right: 10px;
  }

  &:hover {
    color: ${shade(0.2, '#F9F7F0')};
  }
`;

export const Separator = styled.div`
  width: 100%;
  border-bottom: 1px solid #29292c;
`;

export const ButtonLogout = styled.button`
  background: transparent;
  border: 0;
  display: flex;
  align-items: center;
  color: var(--color-white-primary);
  transition: color 0.2s;

  font-size: 14px;
  margin: 14px 0 12px 20px;

  svg {
    margin-right: 10px;
    margin-top: -2px;
  }

  &:hover {
    color: ${shade(0.2, '#F9F7F0')};
  }
`;
