import styled, { css } from 'styled-components';

interface PropsInput {
  isFocused: boolean;
  isFilled: boolean;
}

export const Container = styled.div<PropsInput>`
  width: 100%;
  height: 52px;
  border: 2px solid #23211f;
  background: #23211f;
  border-radius: 6px;
  display: flex;
  padding: 0 10px;
  align-items: center;
  transition: border-color 0.2s;

  & + div {
    margin-top: 8px;
  }

  &:hover {
    border-color: #e6a43a;
  }

  svg {
    margin-right: 10px;
    color: #979797;
  }

  ${({ isFilled }) =>
    isFilled &&
    css`
      svg {
        color: #e6a43a;
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
    height: 100%;
    border: 0;
    flex: 1;
    background: transparent;
    color: #fff;

    &::placeholder {
      color: #979797;
    }
  }
`;
