import React from 'react';

import { Container } from './styles';

interface Props {
  show?: boolean;
  style?: object;
  clicked(): void;
}

const BackDrop: React.FC<Props> = ({ show = false, style, clicked }) => {
  return <> {show && <Container style={style} onClick={() => clicked()} />}</>;
};

export default BackDrop;
