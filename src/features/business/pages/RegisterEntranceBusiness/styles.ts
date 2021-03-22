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
  margin: 94px auto 50px;
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
  max-width: 820px;
  margin: 50px 0 30px;

  display: flex;
`;

export const ContentRegister = styled.div`
  flex: 1;
  padding: 0 20px 35px 20px;
  position: relative;
  background: #2f2f31;
  border-radius: 6px;
  border: 1px solid #2a2a2c;

  form {
    width: 100%;
  }

  h1 {
    font-size: 20px;
    margin: 30px 0 50px 0;
  }

  h2 {
    font-size: 18px;
    margin: 30px 0 18px 0;
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

export const ContentEntrance = styled.ul`
  list-style: none;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #23211f;
`;

export const ListEntrance = styled.li`
  position: relative;
  height: 58px;
  display: flex;
  align-items: center;

  & + li {
    border-top: 1px solid #23211f;
  }

  span {
    color: #d0cec7;
    margin: 0 15px;
  }

  svg {
    width: 24px;
    height: 24px;
    color: #fedf75;
    position: absolute;
    right: 18px;
    top: calc(50% - 12px);
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#fedf75')};
    }
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
