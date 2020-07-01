import React, { useState, useCallback, InputHTMLAttributes } from 'react';

import { IconBaseProps } from 'react-icons/lib/cjs';
import { Container, BoxInput } from './styles';

interface PropsInput extends InputHTMLAttributes<HTMLInputElement> {
  hasTitle?: string;
  styleInput?: object;
  inputRef?: React.RefObject<HTMLInputElement>;
  hasSearch?: (search: string) => void;
  icon?: React.ComponentType<IconBaseProps>;
}

const InputSearch: React.FC<PropsInput> = ({
  icon: Icon,
  style,
  hasTitle,
  hasSearch,
  inputRef,
  styleInput,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const [valueSearch, setValueSearch] = useState('');

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFilled(!!valueSearch);
    setIsFocused(false);
  }, [valueSearch]);

  const handleChange = useCallback(
    (value: string) => {
      setValueSearch(value);
      if (hasSearch) hasSearch(value);
    },
    [hasSearch],
  );

  return (
    <Container style={style}>
      {hasTitle && <span>{hasTitle}</span>}

      <BoxInput isFocused={isFocused} isFilled={isFilled}>
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
