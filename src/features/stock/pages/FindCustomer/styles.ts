import styled from 'styled-components';

export const Container = styled.div`
  margin: 100px auto 40px;
  width: 100%;
  max-width: 540px;
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

export const ContentSearch = styled.div`
  width: 100%;

  h1 {
    font-size: 18px;
    font-weight: 500;
    color: var(--color-white-primary);
    margin: 15px 0 18px 0;
  }
`;

export const Separator = styled.div`
  width: 100%;
  border-bottom: 2px solid #242426;
`;
