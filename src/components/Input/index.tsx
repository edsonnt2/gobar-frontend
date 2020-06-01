import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  KeyboardEvent,
} from 'react';

import { IconBaseProps } from 'react-icons/lib/cjs';
import ReactInputMask, { Props as InputProps } from 'react-input-mask';
import { useField } from '@unform/core';
import { FiXCircle } from 'react-icons/fi';
import { Container, BoxInput, Error, MultSelect } from './styles';

interface PropsInput extends InputProps {
  hasTitle?: string;
  name: string;
  formatField?: 'cpf-and-cnpj' | 'number';
  hasAutoComplete?: boolean;
  styleInput?: object;
  hasMultSelect?: {
    items: string[];
    handleRemove(remove: string): void;
    handleSelect(value: string): void;
  };
  icon?: React.ComponentType<IconBaseProps>;
  hasUpBlur?: {
    handleBlur(): void;
  };
}

const Input: React.FC<PropsInput> = ({
  icon: Icon,
  name,
  style,
  disabled,
  hasTitle,
  formatField,
  hasMultSelect,
  hasUpBlur,
  styleInput,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [valueForm, setValueForm] = useState('');
  const refInput = useRef(null);
  const { error, fieldName, registerField, clearError } = useField(name);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    clearError();
  }, [clearError]);

  const handleBlur = useCallback(() => {
    if (hasUpBlur) hasUpBlur.handleBlur();
    setIsFocused(false);
  }, [hasUpBlur]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.charCode === 13 && hasMultSelect)
        hasMultSelect.handleSelect(valueForm);
    },
    [hasMultSelect, valueForm],
  );

  const handleChange = useCallback(
    (value: string) => {
      setIsFilled(!!value);

      if (formatField) {
        const valueSplit = value
          .split('')
          .filter(char => Number(char) || char === '0');

        if (formatField === 'number') {
          setValueForm(valueSplit.join(''));
        } else {
          const lengthChar = valueSplit.length;
          setValueForm(
            valueSplit
              .map((char, index) => {
                let caracter: string;
                if (lengthChar < 12) {
                  switch (index) {
                    case 3:
                      caracter = '.';
                      break;
                    case 6:
                      caracter = '.';
                      break;
                    case 9:
                      caracter = '-';
                      break;
                    default:
                      caracter = '';
                      break;
                  }
                } else {
                  switch (index) {
                    case 2:
                      caracter = '.';
                      break;
                    case 5:
                      caracter = '.';
                      break;
                    case 8:
                      caracter = '/';
                      break;
                    case 12:
                      caracter = '-';
                      break;
                    default:
                      caracter = '';
                      break;
                  }
                }

                return index < 14 ? caracter + char : '';
              })
              .join(''),
          );
        }
      } else {
        setValueForm(value);
      }
    },
    [formatField],
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: refInput.current,
      path: 'value',
      setValue(ref, value: string) {
        if (value) {
          handleChange(value.trim());
          // setValueForm(value);
        }
      },
    });
  }, [fieldName, registerField, handleChange]);

  return (
    <Container style={style}>
      {hasTitle && <span>{hasTitle}</span>}

      <BoxInput
        isFocused={isFocused}
        isFilled={isFilled}
        isError={!!error}
        isDisabled={!!disabled}
      >
        {Icon && <Icon size={20} />}

        {hasMultSelect && (
          <MultSelect>
            {hasMultSelect.items.map(item => (
              <li key={item}>
                {item}
                <button
                  type="button"
                  onClick={() => hasMultSelect.handleRemove(item)}
                >
                  <FiXCircle />
                </button>
              </li>
            ))}
          </MultSelect>
        )}

        <ReactInputMask
          ref={refInput}
          // defaultValue={defaultValue}
          onChange={e => handleChange(e.target.value)}
          value={valueForm}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styleInput}
          {...rest}
        />
      </BoxInput>
      {error && <Error>{error}</Error>}
    </Container>
  );
};

export default Input;
