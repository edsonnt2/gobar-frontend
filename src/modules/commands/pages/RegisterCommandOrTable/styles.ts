import styled, { css } from 'styled-components';

import { shade } from 'polished';

interface PropsButton {
  isSelected: 'command' | 'table';
}

interface PropsBoxInput {
  isFocused: boolean;
}

interface PropsSelectSearch {
  hasSelected: boolean;
}

export const Container = styled.div`
  margin: 100px auto 40px;
  width: 100%;
  max-width: 500px;
  padding: 10px;

  h1 {
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 26px;
  }

  h2 {
    font-size: 16px;
    font-weight: 500;
    margin: 14px 0 5px;
  }

  p {
    margin-top: 73px;
    color: #bebeb9;
    line-height: 26px;
  }
`;

export const ContentSelect = styled.div`
  margin: 10px 0 16px;
  position: relative;
  border-radius: 6px;
  width: 100%;
  background: #2f2f31;
  height: 56px;
  overflow: hidden;
`;

export const ButtonChange = styled.button<PropsButton>`
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  border: 0;
  height: 100%;
  background: transparent;
  display: flex;
  align-items: center;
  outline: none;

  span {
    font-weight: 500;
    flex: 1;
    ${({ isSelected }) =>
      isSelected === 'command'
        ? css`
            color: #353535;

            & + span {
              color: #6c6c6c;
            }
          `
        : css`
            color: #6c6c6c;

            & + span {
              color: #353535;
            }
          `}
  }
`;

export const ScroolSelectedColor = styled.div<PropsButton>`
  position: absolute;
  top: 0;
  left: 0;
  transition: left 0.5s;
  ${({ isSelected }) =>
    isSelected === 'table' &&
    css`
      left: 50%;
    `}
  width: 50%;
  background-color: #a6a4a2;
  height: 100%;
  border-radius: 6px;
`;

export const ScroolSelectedTransparent = styled.div<PropsButton>`
  position: absolute;
  top: 0;
  left: 0;
  transition: left 0.5s;
  ${({ isSelected }) =>
    isSelected === 'table' &&
    css`
      left: 50%;
    `}
  width: 50%;
  height: 100%;
  border-radius: 6px;
`;

export const BoxProduct = styled.ul`
  width: 100%;
  list-style: none;
`;

export const LiProduct = styled.li`
  position: relative;
  border-bottom: 1px solid #2a2826;
  padding: 9px 0 7px;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    right: 16px;
    color: var(--color-gray-primary);
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }
`;

export const ImgProduct = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 6%;
  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const InfoProduct = styled.div`
  display: flex;
  margin-left: 14px;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;

  p {
    margin: 0;
    color: var(--color-white-primary);
    font-size: 18px;
  }

  div {
    display: flex;
    align-items: center;

    span {
      color: var(--color-white-primary);
      font-size: 18px;
    }
  }
`;

export const InputQuantityProduct = styled.input`
  background: #23211f;
  width: 54px;
  height: 36px;
  border: 0;
  margin: 0 32px;
  border-radius: 6px;
  border: 2px solid #23211f;
  color: var(--color-white-primary);
  text-align: center;
  font-size: 18px;

  :hover {
    border-color: var(--color-yellow-primary);
  }
`;

export const BoxInputProduct = styled.div<PropsBoxInput>`
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
  border-bottom: 2px solid #252321;
  margin: 12px 0 24px;
  transition: border-color 0.2s, color 0.2s;
  color: var(--color-gray-primary);

  ${({ isFocused }) =>
    isFocused &&
    css`
      border-color: var(--color-yellow-primary);
      color: var(--color-yellow-primary);

      ul {
        border-color: var(--color-yellow-primary);
      }
    `}

  &:hover {
    border-color: var(--color-yellow-primary);
    color: var(--color-yellow-primary);
  }

  input {
    color: var(--color-white-primary);
    flex: 1;
    height: 48px;
    padding: 0 10px;
    background: transparent;
    border: 0;

    &::placeholder {
      color: var(--color-gray-primary);
    }
  }
`;

export const ListSearchProducts = styled.ul`
  list-style: none;
  width: 100%;
  position: absolute;
  top: 100%;
  left: 0;
  max-height: 400px;
  border: 2px solid #252321;
  overflow-y: auto;
  background: #373735;
  z-index: 1;
`;

export const RowSearchProduct = styled.li<PropsSelectSearch>`
  width: 100%;
  display: block;
  & + li {
    border-top: 1px solid #252321;
  }

  padding: 3px 0;

  ${({ hasSelected }) =>
    hasSelected &&
    css`
      background-color: ${shade(0.05, '#e6a43a')};
    `}
`;

export const SelectSearchProduct = styled.div<PropsSelectSearch>`
  width: 100%;
  display: flex;
  padding: 5px 5px;
  transition: background-color 0.2s;
  cursor: pointer;

  ${({ hasSelected }) =>
    !hasSelected &&
    css`
      &:hover {
        background-color: ${shade(0.25, '#373735')};
      }
    `}
`;

export const ImgSearchProduct = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 6%;
  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const InfoSearchProduct = styled.div`
  display: flex;
  margin-left: 14px;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;

  p {
    margin: 0;
    color: var(--color-white-primary);
    font-size: 18px;
  }

  span {
    color: var(--color-white-primary);
    font-size: 18px;
  }
`;
