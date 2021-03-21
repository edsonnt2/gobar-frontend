import { useRef, useState, useCallback, ChangeEvent, useEffect } from 'react';

import { useField } from '@unform/core';
import { Container } from './styles';

interface InputProps {
  imgInCircle?: boolean;
  name: string;
  imgPreview: string;
}

const FileInput: React.FC<InputProps> = ({ name, imgPreview, imgInCircle, ...rest }) => {
  const inputRef = useRef(null);

  const { fieldName, registerField } = useField(name);
  const [preview, setPreview] = useState(imgPreview);

  const handlePreview = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        setPreview(imgPreview);
      }
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
    },
    [imgPreview],
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'files[0]',
      setValue(_: HTMLInputElement, value: string) {
        if (value) setPreview(value);
      },
      clearValue(ref: HTMLInputElement) {
        ref.value = '';
        setPreview(imgPreview);
      },
    });
  }, [fieldName, registerField, imgPreview]);

  return (
    <Container imgInCircle={Number(imgInCircle)}>
      <img src={preview} alt={fieldName} />
      <input ref={inputRef} type="file" id={name} {...rest} onChange={handlePreview} />
    </Container>
  );
};

export { FileInput };
