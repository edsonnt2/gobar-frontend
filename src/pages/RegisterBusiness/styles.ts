import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1280px;
  margin: 24px auto 50px;
  padding: 0 10px;
`;

export const BackPage = styled.button`
  display: flex;
  align-self: flex-start;
  align-items: center;
  color: #f9f7f0;
  transition: color 0.2s;
  font-weight: bold;
  border: 0;
  background: transparent;
  svg {
    margin-right: 10px;
  }

  &:hover {
    color: ${shade(0.2, '#f9f7f0')};
  }
`;

export const Main = styled.main`
  align-self: center;
  width: 100%;
  max-width: 560px;

  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-size: 20px;
    margin: 5px 0 28px 0;
  }
`;

export const ContentRegister = styled.div`
  margin-top: 75px;
  padding-top: 75px;
  padding: 75px 20px 30px 20px;
  width: 100%;
  background: #2f2f31;
  border: 1px solid #2a2a2c;
  border-radius: 6px;
  position: relative;
`;

export const BoxImgBusiness = styled.label`
  position: absolute;
  width: 150px;
  height: 150px;
  left: 35px;
  top: -75px;
  border-radius: 50%;
  border: 2px solid #2a2a2c;
  background: #2f2f31;
  cursor: pointer;

  span {
    background: #2f2f31;
    border: 1px solid #2a2a2c;
    border-radius: 50%;
    width: 35px;
    height: 35px;

    color: #979797;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0px;
    top: 9px;
    transition: background-color 0.2s;
  }

  &:hover span {
    background: ${shade(0.3, '#2f2f31')};
  }
`;

export const ContentInput = styled.div`
  display: flex;

  div {
    flex: 1;
  }
`;

export const SeparateInput = styled.span`
  width: 8px;
`;

export const Footer = styled.footer`
  width: 100%;
  margin-top: auto;
  padding: 16px;

  > div {
    width: 100%;
    max-width: 1280px;
    font-size: 14px;
    text-align: right;
    margin: 0 auto;
  }
`;
