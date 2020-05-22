import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  width: 100%;
  height: 56px;
  line-height: 56px;
  text-align: center;
  background: #e6a43a;
  font-size: 18px;
  font-weight: bold;
  color: #4d4843;
  border-radius: 6px;
  margin-top: 16px;
  border: 0;
  transition: background 0.2s;

  &:hover {
    background: ${shade(0.2, '#e6a43a')};
  }
`;
