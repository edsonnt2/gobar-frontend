import { LinkProps } from 'react-router-dom';
import { Container } from './styles';

interface PropsLInk extends LinkProps {
  to: string;
}

const LinkCustom: React.FC<PropsLInk> = ({ children, to, ...rest }) => {
  return (
    <Container to={to} {...rest}>
      {children}
    </Container>
  );
};

export default LinkCustom;
