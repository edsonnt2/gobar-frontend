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
    font-weight: 500;
    font-size: 22px;
  }
`;
