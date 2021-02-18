import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { shade } from 'polished';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 235px auto;
  grid-template-rows: 70px auto 35px;
  grid-template-areas:
    'HB HB'
    'NB CB'
    'NB FB';
  height: 100vh;
`;

export const NavBusiness = styled.nav`
  grid-area: NB;
  background: var(--color-gray-secondary);
  border-right: 1px solid var(--color-border-gray);
  height: 100vh;
  width: 235px;
  position: fixed;
  z-index: 1;
`;

export const MenuMain = styled.div`
  margin-top: 80px;
  width: 100%;
`;

export const LinkMenu = styled(Link)<{ isshow: number }>`
  display: flex;
  align-items: center;
  color: var(--color-white-primary);
  font-size: 16px;
  text-decoration: none;
  padding: 10px 10px 10px 12px;
  margin: 2px 0;
  transition: background-color 0.2s;

  img {
    margin-right: 10px;
  }

  &:hover {
    background-color: ${shade(0.15, '#2f2f31')};
  }

  ${({ isshow }) =>
    isshow &&
    css`
      background-color: ${shade(0.25, '#2f2f31')};

      &:hover {
        background-color: ${shade(0.25, '#2f2f31')};
      }
    `}
`;

export const Content = styled.main`
  grid-area: CB;
`;

export const Footer = styled.footer`
  grid-area: FB;
  padding-right: 20px;
  text-align: right;
`;
