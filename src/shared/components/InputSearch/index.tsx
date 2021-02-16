import React, { useState, useCallback, InputHTMLAttributes } from 'react';

import { IconBaseProps } from 'react-icons/lib/cjs';
import { Container, BoxInput } from './styles';

interface PropsInput extends InputHTMLAttributes<HTMLInputElement> {
  hasTitle?: string;
  styleInput?: React.CSSProperties;
  isNumber?: boolean;
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
  isNumber,
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
      const newValue = isNumber
        ? value
            .split('')
            .filter(char => Number(char) || char === '0')
            .join('')
        : value;

      handleSearch(newValue);
    },
    [handleSearch, isNumber],
  );

  return (
    <Container style={style}>
      {hasTitle && <span>{hasTitle}</span>}

      <BoxInput isFocused={isFocused}>
        {Icon && <Icon size={22} />}

        <input
          ref={inputRef}
          value={valueSearch}
          onChange={e => handleChange(e.target.value)}
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
