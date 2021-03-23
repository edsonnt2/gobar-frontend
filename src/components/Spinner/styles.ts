import styled, { keyframes } from 'styled-components';

const frameSpinner = keyframes`
0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

export const Container = styled.div`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);

  & > div {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;

    div {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--color-yellow-primary);
      animation: ${frameSpinner} 1.3s linear infinite;

      &:nth-child(1) {
        top: 10px;
        left: 10px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        top: 10px;
        left: 40px;
        animation-delay: -0.4s;
      }
      &:nth-child(3) {
        top: 10px;
        left: 70px;
        animation-delay: -0.8s;
      }
      &:nth-child(4) {
        top: 40px;
        left: 10px;
        animation-delay: -0.4s;
      }
      &:nth-child(5) {
        top: 40px;
        left: 40px;
        animation-delay: -0.8s;
      }
      &:nth-child(6) {
        top: 40px;
        left: 70px;
        animation-delay: -1.2s;
      }
      &:nth-child(7) {
        top: 70px;
        left: 10px;
        animation-delay: -0.8s;
      }
      &:nth-child(8) {
        top: 70px;
        left: 40px;
        animation-delay: -1.2s;
      }
      &:nth-child(9) {
        top: 70px;
        left: 70px;
        animation-delay: -1.6s;
      }
    }
  }
`;
