import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

import SignInBackground from '../../assets/background-singin.svg';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  flex-wrap: wrap;
  background: url(${SignInBackground}) no-repeat center;
  background-size: cover;
`;

export const Content = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 10px;
`;

const appearFromRight = keyframes`
  from{
    opacity:0;
    transform: translateX(50px);
  }
  to{
    opacity:1;
    transform: translateX(0);
  }
`;

export const AsideRegister = styled.aside`
  animation: ${appearFromRight} 1s;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 330px;
  align-items: center;
  margin-top: 30px;

  h1 {
    margin-top: 100px;
    font-weight: bold;
    font-size: 24px;
    color: #f9f7f0;
    margin-bottom: 28px;
  }

  a {
    text-decoration: none;
    color: #f9f7f0;
    margin-top: 24px;
    transition: color 0.2s;

    display: flex;
    align-items: center;
    font-weight: 500;
    margin-top: 85px;

    &:hover {
      color: ${shade(0.2, '#f9f7f0')};
    }

    svg {
      margin-right: 10px;
    }
  }
`;

export const ContentDescription = styled.div`
  margin-top: 30px;
  width: 100%;
  max-width: 490px;

  nav {
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }

  ul {
    list-style: none;
    display: flex;
    align-items: center;
    height: 68px;

    li {
      padding-right: 20px;

      a {
        color: #e5a43a;
        text-decoration: none;
        transition: color 0.2s;

        &:hover {
          color: ${shade(0.2, '#e5a43a')};
        }
      }

      & + li {
        padding: 0 20px;
        border-left: 1px solid #e5a43a;
      }
    }
  }

  h1 {
    font-size: 28px;
    font-weight: bold;
    line-height: 33px;
    max-width: 425px;
    margin: 98px 0 0px 0;
    padding-bottom: 16px;
  }

  h2 {
    font-size: 22px;
    font-weight: bold;
    line-height: 36px;
    margin-top: 38px;
  }

  p {
    line-height: 26px;
    margin-left: 10px;
  }
`;

export const Footer = styled.footer`
  width: 100%;
  text-align: center;
  margin-top: auto;
  font-size: 14px;
  padding: 16px;
`;
