import { ButtonHTMLAttributes, useState } from 'react';
import { Container } from './styles';

interface PropsButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button: React.FC<PropsButton> = ({ children, loading, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Container isFocused={isFocused} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} {...rest}>
      {loading ? 'Carregando...' : children}
    </Container>
  );
};

export { Button };
