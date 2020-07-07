import React, { useState, useCallback, InputHTMLAttributes } from 'react';

import { IconBaseProps } from 'react-icons/lib/cjs';
import { Container, BoxInput } from './styles';

interface PropsInput extends InputHTMLAttributes<HTMLInputElement> {
  hasTitle?: string;
  styleInput?: object;
  inputRef?: React.RefObject<HTMLInputElement>;
  valueSearch: string;
  handleSearch: (search: string) => void;
  icon?: React.ComponentType<IconBaseProps>;
}

const InputSearch: React.FC<PropsInput> = ({
  icon: Icon,
  style,
  hasTitle,
  valueSearch,
  handleSearch,
  inputRef,
  styleInput,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      handleSearch(value);
    },
    [handleSearch],
  );

  return (
    <Container style={style}>
      {hasTitle && <span>{hasTitle}</span>}

      <BoxInput isFocused={isFocused}>
        {Icon && <Icon size={22} />}

        <input
          ref={inputRef}
          onChange={e => handleChange(e.target.value)}
          value={valueSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styleInput}
          {...rest}
        />
      </BoxInput>
    </Container>
  );
};

export default InputSearch;
