import styled, { css, keyframes } from 'styled-components';

interface PropsInput {
  isFocused: boolean;
  isError: boolean;
  isDisabled: boolean;
}

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 36px;
`;

export const BoxInput = styled.input<PropsInput>`
  background: #23211f;
  width: 54px;
  height: 36px;
  border: 0;
  border-radius: 6px;
  color: var(--color-white-primary);
  text-align: center;
  font-size: 18px;
  border: 2px solid #23211f;
  transition: border-color 0.2s;

  ${({ isDisabled }) =>
    !isDisabled
      ? css`
          &:hover {
            border-color: var(--color-yellow-primary);
          }
        `
      : css`
          cursor: not-allowed;
        `}

  ${({ isError }) =>
    isError &&
    css`
      border-color: var(--color-red-primary);
    `}

  ${({ isFocused }) =>
    isFocused &&
    css`
      border-color: var(--color-yellow-primary);
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
  position: absolute;
  top: calc(100% + 8px);
  background: var(--color-red-secondary);
  border-radius: 6px;
  width: 250px;
  padding: 10px 0;
  margin: 0 0 8px 0;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    border-style: solid;
    border-color: var(--color-red-secondary) transparent;
    border-width: 0 8px 8px 8px;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
`;
