import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

interface Props {
  selected: number;
}

export const Container = styled.nav``;

export const Menu = styled.ul`
  list-style: none;
  width: 233px;
  margin-right: 25px;

  li {
    border-radius: 6px;
    overflow: hidden;
    display: block;
    background: #272523;
    height: 56px;

    & + li {
      margin-top: 8px;
    }
  }
`;

export const LinkMenu = styled(Link)<Props>`
  height: 100%;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #b0b3b6;
  padding: 0 10px;
  font-weight: 500;

  svg {
    margin: 0 15px 0 12px;
  }

  ${({ selected }) =>
    selected &&
    css`
      background: #1b1917;
      color: #dde0e3;
    `}
`;
