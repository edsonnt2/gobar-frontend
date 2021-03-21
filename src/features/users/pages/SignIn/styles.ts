import styled, { keyframes } from 'styled-components';

import { backgroundSignIn } from '@/assets';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  flex-wrap: wrap;
  background: url(${backgroundSignIn}) no-repeat center;
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

const appearFromLeft = keyframes`
  from{
    opacity:0;
    transform: translateX(-50px);
  }
  to{
    opacity:1;
    transform: translateX(0);
  }
`;

export const AsideLogin = styled.aside`
  animation: ${appearFromLeft} 1s;

  width: 100%;
  max-width: 330px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;

  form {
    width: 100%;
  }

  h1 {
    margin-top: 100px;
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 28px;
  }

  a {
    text-decoration: none;
    color: var(--color-white-primary);
    margin-top: 24px;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.72;
    }

    & + a {
      display: flex;
      align-items: center;
      color: var(--color-yellow-primary);
      font-weight: 500;
      margin-top: 110px;

      &:hover {
        opacity: 0.72;
      }

      svg {
        margin-right: 10px;
      }
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
    justify-content: flex-end;
  }

  ul {
    list-style: none;
    display: flex;
    align-items: center;
    height: 68px;

    li {
      padding: 0 20px;

      a {
        color: var(--color-yellow-primary);
        text-decoration: none;
        transition: opacity 0.2s;

        &:hover {
          opacity: 0.72;
        }
      }

      & + li {
        border-left: 1px solid var(--color-yellow-primary);
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
