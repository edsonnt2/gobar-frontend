import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface PropsSpotlight {
  spotlight: boolean;
}

export const Container = styled.div`
  margin: 100px auto 40px;
  width: 100%;
  max-width: 680px;
  padding: 10px;

  h1 {
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 26px;
  }

  p {
    margin-top: 73px;
    color: #bebeb9;
    line-height: 26px;
  }
`;

export const RowForm = styled.div`
  display: flex;
  width: 100%;
`;

export const AllCustomers = styled.div`
  width: 100%;
  background: #2f2f31;
  border: 1px solid #2a2a2c;
  border-radius: 6px;
  margin-top: 16px;
  position: relative;
  padding-bottom: 80px;
`;

export const DetailCustomer = styled.div<PropsSpotlight>`
  ${({ spotlight }) =>
    spotlight
      ? css`
          position: absolute;
          bottom: 0;
        `
      : css`
          position: relative;
          border-bottom: 1px solid #2a2a2c;
        `}

  width: 100%;
  display: flex;
  padding: 8px;

  svg {
    align-self: center;
    margin-right: 10px;
    cursor: pointer;
    color: #bebebe;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#bebebe')};
    }
  }
`;

export const ImgCustomer = styled.div<PropsSpotlight>`
  ${({ spotlight }) =>
    spotlight
      ? css`
          width: 65px;
          height: 65px;
        `
      : css`
          width: 55px;
          height: 55px;
          margin-left: 8px;
        `}
  border-radius: 50%;
  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    width: 100%;
    top: 49.99%;
    transform: translateY(-50%);
  }
`;

export const InfoCustomer = styled.div<PropsSpotlight>`
  display: flex;
  margin-left: 14px;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 2px 0;

  h2 {
    font-size: ${({ spotlight }) => (spotlight ? '20' : '18')}px;
    font-weight: 500;
  }

  div {
    display: flex;

    span {
      color: var(--color-white-primary);
      font-size: ${({ spotlight }) => (spotlight ? '18' : '16')}px;
      flex: 1;

      strong {
        font-size: ${({ spotlight }) => (spotlight ? '20' : '18')}px;
      }
    }
  }
`;

export const HasTable = styled.span`
  position: absolute;
  top: 8px;
  right: 10px;
`;

export const AllTable = styled.div`
  width: 100%;
  background: #2f2f31;
  border: 1px solid #2a2a2c;
  border-radius: 6px;
  margin-top: 16px;
  padding-top: 8px;
`;

export const InfoTable = styled.div<Partial<PropsSpotlight>>`
  ${({ spotlight }) =>
    !spotlight
      ? css`
          border-bottom: 1px solid #2a2a2c;

          h2 {
            font-size: 20px;
          }

          span {
            font-size: 18px;
          }
        `
      : css`
          h2 {
            font-size: 22px;
          }

          span {
            font-size: 20px;
          }
        `}

  display: flex;
  padding: 10px 16px 8px;

  h2 {
    font-weight: 500;
    margin-right: 30px;
  }

  span {
    flex: 1;
    color: #dedcd5;
  }

  svg {
    cursor: pointer;
    color: #bebebe;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#bebebe')};
    }
  }
`;

export const DetailCustomersTable = styled.ul`
  list-style: none;
  margin-bottom: 8px;
`;

export const RowInfoTable = styled.li`
  width: 100%;
  display: flex;
  align-items: center;

  padding: 8px 14px 8px 24px;

  & + li {
    border-top: 1px solid #2a2a2c;
  }

  h2 {
    flex: 1;
    margin-left: 14px;
    font-size: 16px;
    font-weight: 500;
  }

  svg {
    cursor: pointer;
    color: #fedf75;
    transition: color 0.2s;
    margin: 10px 0 0 14px;

    &:hover {
      color: ${shade(0.2, '#fedf75')};
    }
  }
`;

export const ImgCustomerTable = styled.div`
  width: 46px;
  height: 46px;
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

export const H2Description = styled.h2`
  font-size: 18px;
  font-weight: 500;
  margin-top: 24px;
  margin-bottom: 5px;
`;

export const ListProducts = styled.ul`
  width: 100%;
  list-style: none;
`;

export const RowProducts = styled.li`
  width: 100%;
  display: flex;
  padding: 10px 8px;

  & + li {
    border-top: 1px solid #2a2a2c;
  }
`;

export const ImgProduct = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 6px;
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
  flex-direction: column;
  justify-content: space-between;
  flex: 1;

  h2 {
    font-size: 18px;
    font-weight: normal;
  }
`;

export const DescriptionProduct = styled.div`
  display: flex;
  align-items: center;
`;

export const ValueProduct = styled.div`
  display: flex;
  flex: 1;
  span {
    flex-grow: 1;
    color: var(--color-white-primary);
    font-size: 18px;
  }
`;

export const Operator = styled.span`
  color: var(--color-white-primary);
  font-size: 18px;
  flex: 1;
  text-align: center;
`;

export const DateProduct = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--color-white-primary);
  font-size: 18px;
  line-height: 28px;
`;

export const IconListProduct = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  svg {
    align-self: center;
    margin: 0 8px 0 20px;
    cursor: pointer;
    color: #fedf75;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#FEDF75')};
    }
  }
`;

export const TotalCommand = styled.h2`
  margin-left: auto;
  font-size: 20px;
  font-weight: 500;
  padding-right: 8px;
  color: var(--color-gray-quaternary);
`;

export const TotalProduct = styled.h2`
  margin-left: auto;
  font-size: 22px;
  font-weight: 500;
  padding: 10px 8px 0 0;
`;

export const BoxButtons = styled.div`
  width: 100%;
  display: flex;
  margin-top: 22px;
`;

export const SeparatorButton = styled.div`
  width: 10px;
  height: auto;
`;
