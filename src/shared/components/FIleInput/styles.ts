import styled, { css } from 'styled-components';

export const Container = styled.div<{ imgInCircle: number }>`
  position: relative;
  width: 100%;
  height: 100%;

  ${({ imgInCircle }) =>
    imgInCircle &&
    css`
      border-radius: 50%;
    `}
  overflow: hidden;

  img {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }

  input {
    display: none;
  }
`;
