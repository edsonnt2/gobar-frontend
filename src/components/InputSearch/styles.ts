import styled, { css } from 'styled-components';

interface PropsInput {
  isFocused: boolean;
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
  margin-bottom: 8px;

  flex-wrap: wrap;

  &:hover {
    border-color: var(--color-yellow-primary);
  }

  > svg {
    margin-left: 10px;
    color: var(--color-gray-primary);
  }

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
    border: 0;
    flex: 1;
    background: transparent;
    color: var(--color-text-input);

    &::placeholder {
      color: var(--color-gray-primary);
    }
  }
`;
