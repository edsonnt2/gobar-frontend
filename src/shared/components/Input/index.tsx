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
import { FiXCircle, FiSearch } from 'react-icons/fi';
import {
  Container,
  BoxInput,
  ButtonInInput,
  Error,
  MultSelect,
  AutoComplete,
  LiAutoComplete,
} from './styles';
import formattedValue from '../../utils/formattedValue';

interface FnOnChange {
  value: number;
  indexRef?: number;
}

interface PropsInput extends InputProps {
  hasTitle?: string;
  name: string;
  formatField?: 'cpf-and-cnpj' | 'number';
  styleInput?: React.CSSProperties;
  hasAutoComplete?: {
    loading: boolean;
    list: {
      name: string;
    }[];
    handleChange(search: string): void;
    handleSelect?: (filed: string) => void;
  };
  hasMultSelect?: {
    items: string[];
    handleRemove(remove: string): void;
    handleSelect(value: string): void;
  };
  icon?: React.ComponentType<IconBaseProps>;
  hasUpBlur?: {
    handleBlur(): void;
  };
  isCurrency?: boolean;
  isButtonRight?: {
    title?: string;
    handleButton(): void;
  };
  hasSubmitDown?: () => void;
  hasOnChange?: {
    fnOnChange(data: FnOnChange): void;
    indexRef?: number;
  };
  defaultValue?: string;
}

const Input: React.FC<PropsInput> = ({
  icon: Icon,
  name,
  style,
  disabled,
  hasTitle,
  formatField,
  hasMultSelect,
  hasAutoComplete,
  hasUpBlur,
  styleInput,
  isCurrency,
  isButtonRight,
  hasSubmitDown,
  hasOnChange,
  defaultValue,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedButton, setIsFocusedButton] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [cursor, setCursor] = useState(-1);

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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const lengthList = hasAutoComplete ? hasAutoComplete.list.length : 0;

      if (e.keyCode === 13) {
        const saveItem =
          cursor > -1 ? hasAutoComplete?.list[cursor].name : valueForm;

        if (saveItem) {
          if (hasMultSelect) {
            hasMultSelect.handleSelect(saveItem);
          } else if (hasAutoComplete?.handleSelect) {
            setValueForm(saveItem);
            hasAutoComplete.handleSelect(fieldName);
          }
        }
        if (hasSubmitDown) hasSubmitDown();
      } else if (e.keyCode === 38 && cursor >= 0) {
        setCursor(cursor - 1);
      } else if (e.keyCode === 40 && cursor < lengthList - 1) {
        setCursor(cursor + 1);
      }
    },
    [
      hasMultSelect,
      valueForm,
      hasAutoComplete,
      cursor,
      fieldName,
      hasSubmitDown,
    ],
  );

  const handleChange = useCallback(
    (value: string) => {
      if (hasAutoComplete) {
        setCursor(-1);
        hasAutoComplete.handleChange(value);
      }

      setIsFilled(!!value);

      if (formatField) {
        const valueSplit = value
          .split('')
          .filter(char => Number(char) || char === '0');

        if (formatField === 'number') {
          setValueForm(valueSplit.join(''));
          if (hasOnChange) {
            hasOnChange.fnOnChange({
              value: Number(valueSplit.join('')),
              indexRef: hasOnChange.indexRef,
            });
          }
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
                .map((char, index) =>
                  index + 2 === formatChar.length ? `.${char}` : char,
                )
                .join('');

        setValueForm(
          valueCurrency === '.00' || valueCurrency === ''
            ? ''
            : formattedValue(Number(valueCurrency)),
        );
        if (hasOnChange) {
          hasOnChange.fnOnChange({
            value:
              valueCurrency === '.00' || valueCurrency === ''
                ? 0
                : Number(valueCurrency),
            indexRef: hasOnChange.indexRef,
          });
        }
      } else {
        setValueForm(value);
      }
    },
    [formatField, hasAutoComplete, isCurrency, hasOnChange],
  );

  const handleClickAutoComplete = useCallback(
    item => {
      if (hasMultSelect) {
        hasMultSelect.handleSelect(item);
      } else {
        setValueForm(item);
        if (hasAutoComplete?.handleSelect)
          hasAutoComplete.handleSelect(fieldName);
      }
    },
    [hasMultSelect, hasAutoComplete, fieldName],
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

  useEffect(() => {
    if (defaultValue)
      setValueForm(prevValue =>
        prevValue !== defaultValue ? defaultValue : prevValue,
      );
  }, [defaultValue]);

  return (
    <Container style={style}>
      {hasTitle && <span>{hasTitle}</span>}

      <BoxInput
        isFocused={isFocused}
        isFilled={isFilled}
        isError={!!error}
        isDisabled={!!disabled}
        isButoonRight={!!isButtonRight}
        hasMultSelect={!!hasMultSelect}
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
          onChange={e => handleChange(e.target.value)}
          value={valueForm}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styleInput}
          {...rest}
        />
        {isButtonRight && (
          <ButtonInInput
            type="button"
            onFocus={() => setIsFocusedButton(true)}
            onBlur={() => setIsFocusedButton(false)}
            isFocusedButton={isFocusedButton}
            title={isButtonRight.title}
            onClick={isButtonRight.handleButton}
          >
            <FiSearch size={26} />
          </ButtonInInput>
        )}

        {hasAutoComplete &&
          (hasAutoComplete.loading || hasAutoComplete.list.length > 0) && (
            <AutoComplete loading={Number(hasAutoComplete.loading)}>
              {hasAutoComplete.loading && <li>Loading...</li>}
              {hasAutoComplete.list.map(({ name: item }, index) => (
                <LiAutoComplete
                  hasSelected={cursor === index}
                  key={item}
                  onClick={() => handleClickAutoComplete(item)}
                >
                  {item}
                </LiAutoComplete>
              ))}
            </AutoComplete>
          )}
      </BoxInput>
      {error && <Error>{error}</Error>}
    </Container>
  );
};

export default Input;
