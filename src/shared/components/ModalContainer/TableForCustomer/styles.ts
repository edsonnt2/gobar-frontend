import styled, { css } from 'styled-components';

import { animated } from 'react-spring';
import { shade } from 'polished';

interface PropsBoxTable {
  isEmpty: number;
}

export const Container = styled(animated.div)`
  position: fixed;
  z-index: 4;
  width: 510px;
  top: 20%;
  left: calc(50% - 255px);
  max-width: 500px;
  border-radius: 6px;
  background: #2f2f31;
  border: 1px solid #1d1d1f;
  padding: 20px 10px 20px 6px;
`;

export const CloseCommand = styled.button`
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

export const BoxInfoCustomer = styled.div`
  display: flex;
  margin: 0 0 10px 4px;
`;

export const ImgCustomer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const InfoCustomer = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 24px;
  justify-content: space-around;
  margin-left: 16px;

  span {
    color: var(--color-gray-primary);
    font-size: 18px;
  }

  h1 {
    /* color: #e5a43a; */
    font-weight: 500;
    font-size: 22px;
  }
`;

export const ListTable = styled.ul`
  list-style: none;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
`;

export const BoxTable = styled.li<PropsBoxTable>`
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
