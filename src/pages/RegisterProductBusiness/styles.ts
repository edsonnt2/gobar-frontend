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
