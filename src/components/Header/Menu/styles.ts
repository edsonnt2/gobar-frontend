import styled, { css } from 'styled-components';
import { shade } from 'polished';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  background: #333337;
  border: 1px solid #242427;
  width: 280px;
  border-radius: 6px;
  max-height: 580px;
  position: absolute;
  z-index: 3;
  right: 0;
  top: calc(100% + 5px);
  overflow-x: auto;

  h2 {
    margin-top: 8px;
    margin-left: 10px;
    color: var(--color-yellow-primary);
    font-size: 14px;
    font-weight: 500;
  }
`;

export const BoxInfoMenu = styled.div`
  display: flex;
  align-items: center;
  margin: 2px 0;
  padding: 6px 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${shade(0.2, '#333337')};
  }
`;

export const ImgMenu = styled.div`
  width: 40px;
  height: 40px;
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

export const InfoMenu = styled.div<{ isTop?: boolean }>`
  display: flex;
  flex-direction: column;
  margin-left: 10px;

  strong {
    color: var(--color-white-primary);
    font-weight: 500;
  }

  span {
    font-size: 14px;
    ${({ isTop }) =>
      isTop
        ? css`
            margin-bottom: 5px;
          `
        : css`
            margin-top: 5px;
          `}

    color: var(--color-gray-primary);
  }
`;

export const LinkOption = styled(Link)`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 15px;
  text-decoration: none;
  margin: 14px 0 14px 22px;
  color: var(--color-white-primary);
  transition: color 0.2s;

  svg {
    margin-right: 10px;
  }

  &:hover {
    color: ${shade(0.2, '#F9F7F0')};
  }
`;

export const Separator = styled.div`
  width: 100%;
  border-bottom: 1px solid #29292c;
`;

export const ButtonLogout = styled.button`
  background: transparent;
  border: 0;
  display: flex;
  align-items: center;
  color: var(--color-white-primary);
  transition: color 0.2s;

  font-size: 14px;
  margin: 14px 0 12px 20px;

  svg {
    margin-right: 10px;
    margin-top: -2px;
  }

  &:hover {
    color: ${shade(0.2, '#F9F7F0')};
  }
`;
