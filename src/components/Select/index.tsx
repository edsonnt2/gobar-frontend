import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  SelectHTMLAttributes,
} from 'react';

import { useField } from '@unform/core';
import { FaChevronDown } from 'react-icons/fa';
import { Container, BoxInput, Error } from './styles';

interface PropsSelect extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  hasTitle?: string;
  styleInput?: object;
  children: React.ReactNode;
}

const Select: React.FC<PropsSelect> = ({
  name,
  styleInput,
  hasTitle,
  style,
  disabled,
  children,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const refInput = useRef<HTMLSelectElement>(null);
  const {
    error,
    fieldName,
    registerField,
    defaultValue,
    clearError,
  } = useField(name);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    clearError();
  }, [clearError]);

  const handleBlur = useCallback(() => {
    setIsFilled(!!refInput.current?.value);
    setIsFocused(false);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: refInput.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container style={style}>
      {hasTitle && <span>{hasTitle}</span>}

      <BoxInput
        isFocused={isFocused}
        isFilled={isFilled}
        isError={!!error}
        isDisabled={!!disabled}
      >
        <select
          ref={refInput}
          defaultValue={defaultValue}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styleInput}
          {...rest}
        >
          {children}
        </select>
        <FaChevronDown />
      </BoxInput>
      {error && <Error>{error}</Error>}
    </Container>
  );
};

export default Select;
