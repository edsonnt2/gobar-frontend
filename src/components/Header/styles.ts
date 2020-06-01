import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  background: #2f2f31;
  border-bottom: 1px solid #242426;

  > div {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 10px;
    height: 70px;
    align-items: center;
  }
`;

export const LogoAndSearch = styled.div`
  display: flex;
  align-items: center;
  > img {
    margin-right: 23px;
  }
`;

export const SearchHeader = styled.div`
  background: #23211f;
  height: 46px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  padding: 0 10px;

  color: #626262;

  svg {
    width: 25px;
    height: 25px;
  }

  input {
    width: 200px;
    padding: 0 6px;
    border: 0;
    height: 46px;
    background: transparent;
    color: #fff;

    &::placeholder {
      color: #626262;
    }
  }
`;

export const OptionsUserHeader = styled.div`
  display: flex;
  align-items: center;

  button {
    background: transparent;
    border: 0;

    svg {
      width: 22px;
      height: 22px;
      color: #bbb7b3;
    }
  }
`;

export const UserHader = styled.div`
  display: flex;
  align-items: center;
`;

export const ImgUser = styled.div`
  width: 55px;
  height: 55px;
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

export const InfoUser = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 45px 0 15px;
  line-height: 24px;

  span {
    color: #979797;
  }

  strong {
    color: #e5a43a;
    font-weight: bold;
  }
`;
