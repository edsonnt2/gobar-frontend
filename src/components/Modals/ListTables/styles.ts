import styled, { css } from 'styled-components';
import { animated } from 'react-spring';
import { shade } from 'polished';

export const Container = styled(animated.div)`
  position: fixed;
  z-index: 4;
  width: 500px;
  top: 20%;
  left: calc(50% - 250px);
  max-width: 500px;
  border-radius: 6px;
  background: #2f2f31;
  border: 1px solid #1d1d1f;
  padding: 16px 20px;

  h1 {
    font-size: 18px;
    margin-bottom: 10px;
  }
`;

export const CloseTable = styled.button`
  position: absolute;
  background: transparent;
  width: 28px;
  height: 28px;
  border: 0;
  top: 10px;
  right: 10px;
  color: #979797;
  transition: color 0.2s;

  &:hover {
    color: ${shade(0.2, '#979797')};
  }
`;

export const ContainerTables = styled.ul`
  list-style: none;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
`;

export const BoxTable = styled.li<{ isEmpty: number }>`
  width: 114px;
  height: 68px;
  margin: 3px 0 3px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8px;
  border: 2px solid #0fa81f;
  color: #0fa81f;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;

  ${({ isEmpty }) =>
    !isEmpty &&
    css`
      border-color: #d64531;
      color: #d64531;
    `}

  :hover {
    ${({ isEmpty }) =>
      !isEmpty
        ? css`
            border-color: ${shade(0.15, '#d64531')};
            color: ${shade(0.15, '#d64531')};
          `
        : css`
            border-color: ${shade(0.15, '#0fa81f')};
            color: ${shade(0.15, '#0fa81f')};
          `}
  }

  h2 {
    font-size: 22px;
    display: flex;
    align-items: center;
    margin-bottom: 4px;

    svg {
      margin-top: -20px;
      margin-right: 5px;
    }
  }

  span {
    font-size: 14px;
    font-weight: bold;
  }
`;
