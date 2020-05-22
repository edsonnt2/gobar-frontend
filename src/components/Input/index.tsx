import React, {
  InputHTMLAttributes,
  useState,
  useCallback,
  useRef,
} from 'react';

import { IconBaseProps } from 'react-icons/lib/cjs';
import { Container } from './styles';

interface PropsInput extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<PropsInput> = ({ icon: Icon, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBluir = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!refInput.current?.value);
  }, []);

  return (
    <Container isFocused={isFocused} isFilled={isFilled}>
      {Icon && <Icon size={20} />}
      <input
        onFocus={handleFocus}
        onBlur={handleBluir}
        ref={refInput}
        {...rest}
      />
    </Container>
  );
};

export default Input;
