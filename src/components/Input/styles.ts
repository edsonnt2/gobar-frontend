import styled, { css, keyframes } from 'styled-components';
import { shade } from 'polished';

interface PropsInput {
  isFocused: boolean;
  isFilled: boolean;
  isError: boolean;
  isDisabled: boolean;
}

export const Container = styled.div`
  span {
    display: block;
    color: #979797;
    margin-bottom: 2px;

    margin-top: 14px;
  }
`;

export const BoxInput = styled.div<PropsInput>`
  width: 100%;
  border: 2px solid #23211f;
  background: #23211f;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: border-color 0.2s;
  margin-bottom:8px;

  flex-wrap: wrap;

  ${({ isDisabled }) =>
    !isDisabled
      ? css`
          &:hover {
            border-color: #e6a43a;
          }
        `
      : css`
          cursor: not-allowed;

          input {
            cursor: not-allowed;
          }
        `}

  > svg {
    margin-left: 10px;
    color: #979797;
  }

  ${({ isFilled }) =>
    isFilled &&
    css`
      svg {
        color: #e6a43a;
      }
    `}

  ${({ isError }) =>
    isError &&
    css`
      border-color: #f00;

      svg {
        color: #f00;
      }
    `}


  ${({ isFocused }) =>
    isFocused &&
    css`
      border-color: #e6a43a;

      svg {
        color: #e6a43a;
      }
    `}


  input {
    height: 52px;
    margin: 0 10px;
    border: 0;
    flex: 1;
    background: transparent;
    color: #fff;

    &::placeholder {
      color: #979797;
    }
  }
`;

const appearFromTop = keyframes`
  from{
    opacity: 0;
    transform: translateY(-50px)
    visibility: hidden;
  }
  to{
    opacity: 1;
    transform: translateY(0)
    visibility: visible;
  }
`;

export const Error = styled.div`
  animation: ${appearFromTop} 0.4s;
  background: #e63a3a;
  width: 100%;
  border-radius: 6px;
  padding: 10px;
  margin: 0 0 8px 0;
  position: relative;
  font-weight: 500;
  font-size: 14px;

  &::before {
    content: '';
    position: absolute;
    border-style: solid;
    border-color: #e63a3a transparent;
    border-width: 0 8px 8px 8px;
    bottom: 100%;
    left: 50%;
    transform: translateX(-100%);
  }
`;

export const MultSelect = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 2px 0 0 5px;

  li {
    border: 1px solid #171717;
    background: #1a1918;
    padding-left: 5px;
    height: 38px;
    margin: 1px;
    color: #e2e0de;
    position: relative;
    display: flex;
    align-items: center;

    button {
      border: 0;
      width: 18px;
      height: 18px;
      padding: 0;
      background: transparent;
      margin: 0 5px;

      svg {
        width: 18px;
        height: 18px;
        color: #7b7777;
        transition: color 0.2s;

        &:hover {
          color: ${shade(0.2, '#7b7777')};
        }
      }
    }
  }
`;
