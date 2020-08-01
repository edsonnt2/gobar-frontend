import styled, { css, keyframes } from 'styled-components';

interface PropsInput {
  isFocused: boolean;
  isFilled: boolean;
  isError: boolean;
  isDisabled: boolean;
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
  border: 2px solid var(--color-select);
  background: var(--color-select);
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: border-color 0.2s;
  margin-bottom: 8px;

  flex-wrap: wrap;

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

  select {
    color: var(--color-text-select);
    -webkit-appearance: none; /* Remove estilo padrão do Chrome */
    -moz-appearance: none; /* Remove estilo padrão do FireFox */
    appearance: none; /* Remove estilo padrão do FireFox*/
    height: 52px;
    padding: 0 10px;
    border: 0;
    flex: 1;
    background: transparent;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
  }

  ${({ isDisabled }) =>
    !isDisabled
      ? css`
          &:hover {
            border-color: var(--color-yellow-primary);
          }
        `
      : css`
          cursor: not-allowed;

          select {
            cursor: not-allowed;
          }
        `}

  > svg {
    color: var(--color-text-select);
    width: 24px;
    height: 24px;
    position: absolute;
    top: calc(50% - 10px);
    right: 15px;
  }

  ${({ isFocused }) =>
    isFocused &&
    css`
      border-color: var(--color-yellow-primary);

      > svg {
        color: #3b4d71;
      }
    `}
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
