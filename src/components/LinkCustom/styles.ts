import styled from 'styled-components';
import { shade } from 'polished';
import { Link } from 'react-router-dom';

export const Container = styled(Link)`
  text-decoration: none;
  display: block;
  width: 100%;
  height: 56px;
  line-height: 56px;
  text-align: center;
  background: #e6a43a;
  font-size: 18px;
  font-weight: bold;
  color: #4d4843;
  border-radius: 6px;
  margin-top: 22px;
  border: 0;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#e6a43a')};
  }
`;
