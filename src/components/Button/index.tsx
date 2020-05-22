import React, { ButtonHTMLAttributes } from 'react';
import { Container } from './styles';

type PropsButton = ButtonHTMLAttributes<HTMLButtonElement>;

const Input: React.FC<PropsButton> = ({ children, ...rest }) => {
  return <Container {...rest}>{children}</Container>;
};

export default Input;
