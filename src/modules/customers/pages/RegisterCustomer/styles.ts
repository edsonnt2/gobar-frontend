import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 20px auto 50px;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Content = styled.div`
  margin-top: 70px;
  width: 100%;
  max-width: 520px;

  h1 {
    text-align: center;
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 36px;
  }

  p {
    margin-top: 73px;
    color: #bebeb9;
    line-height: 26px;
  }
`;

export const BackPage = styled.button`
  display: flex;
  align-self: flex-start;
  align-items: center;
  color: var(--color-white-primary);
  transition: opacity 0.2s;
  font-weight: bold;
  border: 0;
  background: transparent;
  svg {
    margin-right: 10px;
  }

  &:hover {
    opacity: 0.72;
  }
`;
