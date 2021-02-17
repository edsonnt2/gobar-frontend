import { useState, useCallback, useRef, useEffect, KeyboardEvent, InputHTMLAttributes } from 'react';

import { useField } from '@unform/core';

import FormattedUtils from '@/shared/utils/formattedUtils';
import { Container, BoxInput, Error } from './styles';

interface HasChange {
  value: string;
  index?: number;
  where?: 'quantity' | 'currency';
}

interface PropsInput extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  isNumber?: boolean;
  isCurrency?: boolean;
  inputAutoFocus?: boolean;
  hasIndex?: number;
  isChange?: (data: HasChange) => void;
  hasKeyDown?: (data: Omit<HasChange, 'value'>) => void;
}

const InputQuantityProduct: React.FC<PropsInput> = ({
  name,
  disabled,
  isNumber,
  isCurrency,
  hasIndex,
  inputAutoFocus,
  isChange,
  hasKeyDown,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [valueForm, setValueForm] = useState('');
  const refInput = useRef<HTMLInputElement>(null);

  const { error, fieldName, registerField, defaultValue, clearError } = useField(name);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    clearError();
  }, [clearError]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode === 13 && hasKeyDown) {
        if (isNumber) {
          hasKeyDown({
            where: 'quantity',
            index: hasIndex,
          });
        } else if (isCurrency) {
          hasKeyDown({
            where: 'currency',
            index: hasIndex,
          });
        }
      }
    },
    [hasKeyDown, isNumber, isCurrency, hasIndex],
  );

  const handleChange = useCallback(
    (value: string) => {
      let setValue;
      if (isNumber) {
        const valueSplit = value.split('').filter(char => Number(char) || char === '0');
        setValue = valueSplit.join('');

        if (isChange)
          isChange({
            value: setValue,
            index: hasIndex,
            where: 'quantity',
          });
      } else if (isCurrency) {
        const formatChar = value
          .split('')
          .filter(char => Number(char) || char === '0')
          .join('')
          .replace(',', '.');

        const valueCurrency =
          formatChar.length === 1
            ? `0.0${formatChar}`
            : formatChar
                .split('')
                .map((char, index) => (index + 2 === formatChar.length ? `.${char}` : char))
                .join('');

        setValue =
          valueCurrency === '.00' || valueCurrency === '' ? '' : FormattedUtils.formattedValue(Number(valueCurrency));

        if (isChange)
          isChange({
            value: valueCurrency,
            index: hasIndex,
            where: 'currency',
          });
      } else {
        setValue = value;
      }
      setValueForm(setValue);
    },
    [isNumber, isCurrency, isChange, hasIndex],
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: refInput.current,
      path: 'value',
      setValue(ref, value: string) {
        if (value) handleChange(value.trim());
      },
    });
  }, [fieldName, registerField, handleChange]);

  useEffect(() => {
    if (inputAutoFocus) refInput.current?.focus();
  }, [inputAutoFocus]);

  return (
    <Container>
      <BoxInput
        isFocused={isFocused}
        isError={!!error}
        isDisabled={!!disabled}
        ref={refInput}
        defaultValue={defaultValue}
        onChange={e => handleChange(e.target.value)}
        value={valueForm}
        onKeyDown={handleKeyPress}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
      {error && <Error>{error}</Error>}
    </Container>
  );
};

export default InputQuantityProduct;
