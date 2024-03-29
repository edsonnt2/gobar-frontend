import { useState, useCallback, useRef, useEffect, KeyboardEvent } from 'react';
import ReactInputMask, { Props as InputProps } from 'react-input-mask';
import { FiXCircle, FiSearch } from 'react-icons/fi';
import { IconBaseProps } from 'react-icons/lib/cjs';
import { useField } from '@unform/core';

import { FormattedUtils } from '@/utils';

import { Container, BoxInput, ButtonInInput, Error, MultSelect, AutoComplete, LiAutoComplete } from './styles';

interface FnOnChange {
  value: number;
  indexRef?: number;
}

interface PropsInput extends Omit<InputProps, 'mask'> {
  mask?: string | Array<string | RegExp>;
  hasTitle?: string;
  name: string;
  formatField?: 'taxId' | 'number';
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
  handleBlur?(value?: string): void;
  handleChange?(value?: string): void;
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
  mask = '',
  name,
  style,
  disabled,
  hasTitle,
  formatField,
  hasMultSelect,
  hasAutoComplete,
  handleBlur,
  handleChange,
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

  const handleBlurFn = useCallback(() => {
    if (handleBlur) handleBlur();
    setIsFocused(false);
  }, [handleBlur]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const lengthList = hasAutoComplete ? hasAutoComplete.list.length : 0;

      if (e.key === 'Enter') {
        const saveItem = cursor > -1 ? hasAutoComplete?.list[cursor].name : valueForm;

        if (saveItem) {
          if (hasMultSelect) {
            hasMultSelect.handleSelect(saveItem);
          } else if (hasAutoComplete?.handleSelect) {
            setValueForm(saveItem);
            hasAutoComplete.handleSelect(fieldName);
          }
        }
        setCursor(-1);
        if (hasSubmitDown) hasSubmitDown();
      } else if (e.key === 'ArrowUp' && cursor >= 0) {
        setCursor(cursor - 1);
      } else if (e.key === 'ArrowDown' && cursor < lengthList - 1) {
        setCursor(cursor + 1);
      }
    },
    [hasMultSelect, valueForm, hasAutoComplete, cursor, fieldName, hasSubmitDown],
  );

  const handleChangeFn = useCallback(
    (value: string) => {
      if (handleChange) handleChange(value);

      if (hasAutoComplete) {
        setCursor(-1);
        hasAutoComplete.handleChange(value);
      }

      setIsFilled(!!value);

      if (formatField) {
        const onlyNumber = FormattedUtils.onlyNumber(value);

        if (formatField === 'number') {
          setValueForm(onlyNumber);
          if (hasOnChange) {
            hasOnChange.fnOnChange({
              value: +onlyNumber,
              indexRef: hasOnChange.indexRef,
            });
          }
        } else {
          setValueForm(FormattedUtils.formattedTaxId(onlyNumber));
        }
      } else if (isCurrency) {
        const formatChar = FormattedUtils.onlyNumber(value);

        const valueCurrency =
          formatChar.length === 1
            ? `0.0${formatChar}`
            : formatChar
                .split('')
                .map((char, index) => (index + 2 === formatChar.length ? `.${char}` : char))
                .join('');

        setValueForm(
          valueCurrency === '.00' || valueCurrency === '' ? '' : FormattedUtils.formattedValue(+valueCurrency),
        );
        if (hasOnChange) {
          hasOnChange.fnOnChange({
            value: valueCurrency === '.00' || valueCurrency === '' ? 0 : +valueCurrency,
            indexRef: hasOnChange.indexRef,
          });
        }
      } else {
        setValueForm(value);
      }
    },
    [formatField, hasAutoComplete, isCurrency, hasOnChange, handleChange],
  );

  const handleClickAutoComplete = useCallback(
    item => {
      if (hasMultSelect) {
        hasMultSelect.handleSelect(item);
      } else {
        setValueForm(item);
        if (hasAutoComplete?.handleSelect) hasAutoComplete.handleSelect(fieldName);
      }
    },
    [hasMultSelect, hasAutoComplete, fieldName],
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: refInput.current,
      path: 'value',
      setValue(_, value: string) {
        if (value) {
          handleChangeFn(value.trim());
        }
      },
    });
  }, [fieldName, registerField, handleChangeFn]);

  useEffect(() => {
    if (defaultValue) setValueForm(prevValue => (prevValue !== defaultValue ? defaultValue : prevValue));
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
                <button type="button" onClick={() => hasMultSelect.handleRemove(item)}>
                  <FiXCircle />
                </button>
              </li>
            ))}
          </MultSelect>
        )}

        <ReactInputMask
          ref={refInput}
          mask={mask}
          onChange={e => handleChangeFn(e.target.value)}
          value={valueForm}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlurFn}
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

        {hasAutoComplete && (hasAutoComplete.loading || hasAutoComplete.list.length > 0) && (
          <AutoComplete loading={Number(hasAutoComplete.loading)}>
            {hasAutoComplete.loading && <li>Loading...</li>}
            {hasAutoComplete.list.map(({ name: item }, index) => (
              <LiAutoComplete hasSelected={cursor === index} key={item} onClick={() => handleClickAutoComplete(item)}>
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

export { Input };
