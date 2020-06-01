import styled from 'styled-components';
import { shade } from 'polished';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 55px auto 30px;
  padding: 0 10px;

  h1 {
    font-size: 20px;
    margin: 46px 0 28px 0;
  }
`;

export const InputLocation = styled.div`
  width: 100%;
  background: #23211f;
  border-radius: 6px;
  height: 56px;
  display: flex;
  align-items: center;

  color: #626262;

  svg {
    width: 20px;
    height: 20px;
    margin-left: 15px;
  }

  input {
    height: 56px;
    border: 0;
    flex: 1;
    padding: 0 15px;
    background: transparent;
    color: #fff;

    &::placeholder {
      color: #626262;
    }
  }
`;

export const ButtonLocation = styled.button`
  width: 100%;
  background: #e6a43a;
  border-radius: 6px;
  height: 56px;
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #4d4843;
  margin-top: 22px;
  border: 0;

  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#e6a43a')};
  }

  svg {
    width: 20px;
    height: 20px;
    margin: 0 16px;
  }
`;

export const RegisterBusiness = styled(Link)`
  text-decoration: none;
  color: #bebeb9;
  font-size: 18px;
  font-weight: bold;
  margin-top: 58px;
  transition: color 0.2s;

  &:hover {
    color: ${shade(0.2, '#bebeb9')};
  }
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
