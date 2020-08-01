import styled, { css, keyframes } from 'styled-components';
import { shade } from 'polished';

interface PropsInput {
  isFocused: boolean;
  isFilled: boolean;
  isError: boolean;
  isDisabled: boolean;
  isButoonRight?: boolean;
  hasMultSelect?: boolean;
}

interface PropsAutoComplete {
  loading: number;
}

interface PropsAutoCompleteLi {
  hasSelected: boolean;
}

interface PropsButton {
  isFocusedButton: boolean;
}

export const Container = styled.div`
  span {
    display: block;
    color: var(--color-gray-primary);
    margin-bottom: 4px;

    margin-top: 14px;
  }
`;

export const BoxInput = styled.div<PropsInput>`
  position: relative;
  width: 100%;
  border: 2px solid var(--color-input);
  background: var(--color-input);
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: border-color 0.2s;
  margin-bottom:8px;

  ${({ hasMultSelect }) =>
    hasMultSelect &&
    css`
      flex-wrap: wrap;
    `}

  ${({ isDisabled }) =>
    !isDisabled
      ? css`
          &:hover {
            border-color: var(--color-yellow-primary);
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
    color: var(--color-gray-primary);
  }

  ${({ isFilled }) =>
    isFilled &&
    css`
      svg {
        color: var(--color-yellow-primary);
      }
    `}

  ${({ isError }) =>
    isError &&
    css`
      border-color: var(--color-red-primary);

      svg {
        color: var(--color-red-primary);
      }
    `}


  ${({ isFocused }) =>
    isFocused &&
    css`
      border-color: var(--color-yellow-primary);

      svg {
        color: var(--color-yellow-primary);
      }
    `}


  input {
    height: 52px;
    padding: 0 10px;

    ${({ isButoonRight }) =>
      isButoonRight &&
      css`
        padding-right: 62px;
      `}

    border: 0;
    flex: 1;
    background: transparent;
    color: var(--color-text-input);

    &::placeholder {
      color: var(--color-gray-primary);
    }
  }
`;

export const ButtonInInput = styled.button<PropsButton>`
  position: absolute;
  top: -2px;
  right: -2px;
  height: 56px;
  width: 56px;
  background-color: #a6a4a2;
  border: 0;
  border-radius: 0 6px 6px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${shade(0.2, '#a6a4a2')};
  }

  ${({ isFocusedButton }) =>
    isFocusedButton &&
    css`
      background-color: ${shade(0.2, '#a6a4a2')};
    `}

  svg {
    color: #575757;
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
  background: var(--color-red-secondary);
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
    border-color: var(--color-red-secondary) transparent;
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

export const AutoComplete = styled.ul<PropsAutoComplete>`
  list-style: none;
  position: absolute;
  top: 100%;
  width: 100%;
  max-height: 400px;
  z-index: 2;
  border: 1px solid #444341;
  overflow-y: auto;
  background: #373735;

  li {
    ${({ loading }) =>
      loading
        ? css`
            text-align: center;
          `
        : css`
            cursor: pointer;
            &:hover {
              background: var(--color-yellow-primary);
            }
          `}
  }
`;

export const LiAutoComplete = styled.li<PropsAutoCompleteLi>`
  display: block;
  padding: 9px 8px;

  & + li {
    border-top: 1px solid #444341;
  }

  ${({ hasSelected }) =>
    hasSelected &&
    css`
      background: var(--color-yellow-primary);
    `}
`;
