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

export const ContainerCommands = styled.ul`
  list-style: none;
  max-height: 500px;
  overflow-y: auto;
`;

export const RowCommand = styled.li<{ hasSelected: boolean }>`
  display: flex;
  padding: 8px 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  & + li {
    border-top: 1px solid #2a2a2c;
  }

  &:hover {
    background-color: ${shade(0.2, '#2f2f31')};
  }

  ${({ hasSelected }) =>
    hasSelected &&
    css`
      background-color: ${shade(0.2, '#2f2f31')};
    `}
`;

export const ImgCustomer = styled.div`
  width: 50px;
  height: 50px;
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

  h2 {
    color: #e5a43a;
    font-weight: 500;
    font-size: 16px;
  }

  span {
    font-size: 16px;

    strong {
      font-size: 18px;
    }
  }
`;
