import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface PropsOptionCustomer {
  isOpen?: boolean;
}

export const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 20px auto 50px;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Content = styled.div`
  margin-top: 70px;
  width: 100%;
  max-width: 580px;

  h1 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 20px;
  }

  p {
    margin-top: 73px;
    color: #bebeb9;
    line-height: 26px;
  }
`;

export const BoxCustomer = styled.section`
  border-radius: 6px;
  width: 100%;
  padding: 20px;
  background: var(--color-gray-secondary);
  border: 1px solid var(--color-border-gray);
`;

export const RowCustomer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

export const ImgCustomer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  margin-right: 15px;

  img {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const InfoCustomer = styled.div`
  display: flex;
  line-height: 24px;
  flex-wrap: wrap;

  & + div {
    margin-left: 28px;
  }

  h2 {
    font-size: 18px;
    font-weight: 500;
    width: 100%;
    margin-bottom: 17px;
  }

  h3 {
    font-size: 16px;
    color: var(--color-gray-primary);
    font-weight: normal;
    width: 100%;
  }

  span {
    color: var(--color-gray-quaternary);

    & + span {
      margin-left: 30px;
    }
  }
`;

export const OptionsCustomer = styled.div`
  background: var(--color-gray-tertiary);
  border: 1px solid #222224;
  border-radius: 6px;
  display: flex;
  margin: 20px 0 10px;
`;

export const OptionCustomer = styled.button<PropsOptionCustomer>`
  height: 80px;
  flex: 1;
  text-align: center;
  line-height: 80px;
  border: 0;
  background: transparent;
  transition: background-color 0.2s;
  font-weight: 500;

  ${({ isOpen }) =>
    isOpen
      ? css`
          color: #d64531;
        `
      : css`
          color: #31d641;
        `}

  &:hover {
    background-color: ${shade(0.06, '#2a2a2c')};
  }

  & + button {
    border-left: 1px solid #222224;
  }
`;

export const BackPage = styled.button`
  display: flex;
  align-self: flex-start;
  align-items: center;
  color: var(--color-white-primary);
  transition: opacity 0.2s;
  font-weight: bold;
  border: 0;
  background: transparent;
  svg {
    margin-right: 10px;
  }

  &:hover {
    opacity: 0.72;
  }
`;
