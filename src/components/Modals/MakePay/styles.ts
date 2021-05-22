import styled from 'styled-components';

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
  padding: 20px;
  padding-bottom: 25px;
`;

export const ClosePay = styled.button`
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

export const RowHeaderPay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderLeft = styled.div`
  h2 {
    font-size: 22px;
    line-height: 32px;
    font-weight: normal;
  }

  h1 {
    font-size: 26px;
    font-weight: bold;
  }
`;

export const HeaderRight = styled.div`
  margin-top: 26px;
  width: 160px;
`;

export const RowInput = styled.div`
  display: flex;
`;

export const SeparateInput = styled.span`
  width: 8px;
  height: auto;
`;
