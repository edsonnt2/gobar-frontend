import styled, { css } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button<{ isFocused: boolean }>`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e6a43a;
  font-size: 18px;
  font-weight: bold;
  color: #4d4843;
  border-radius: 6px;
  margin-top: 12px;
  border: 0;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#e6a43a')};
  }

  ${({ isFocused }) =>
    isFocused &&
    css`
      background: ${shade(0.2, '#e6a43a')};
    `}
`;
