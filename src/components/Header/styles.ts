import { shade } from 'polished';
import styled, { css } from 'styled-components';
import { PropsHeader } from '.';

export const Container = styled.header<PropsHeader>`
  grid-area: HB;

  width: 100%;
  background: var(--color-gray-secondary);
  border-bottom: 1px solid var(--color-border-gray);
  position: fixed;
  z-index: 2;

  > div {
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

export const OptionsHeader = styled.nav`
  position: relative;
  display: flex;
`;

export const ButtonMenu = styled.button`
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
  border: 1px solid ${shade(0.2, '#28282a')};

  & + span {
    margin-left: 10px;
  }

  &:hover {
    background-color: ${shade(0.2, '#28282a')};
  }
`;
