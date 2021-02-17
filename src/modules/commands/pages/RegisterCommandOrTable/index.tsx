import { useCallback, useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';

import { FiXCircle, FiClipboard } from 'react-icons/fi';
import { Form } from '@unform/web';
import { GiTicket } from 'react-icons/gi';
import { FormHandles } from '@unform/core';
import LayoutBusiness from '@/shared/components/LayoutBusiness';
import { useModal } from '@/shared/hooks/Modal';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import api from '@/shared/services/api';
import { useToast } from '@/shared/hooks/Toast';
import FormattedUtils from '@/shared/utils/formattedUtils';

import InputQuantityProduct from '@/modules/commands/components/InputQuantityProduct';

import noProduct from '@/shared/assets/no-product.png';

import {
  Container,
  ContentSelect,
  ButtonChange,
  ScroolSelectedColor,
  ScroolSelectedTransparent,
  BoxProduct,
  LiProduct,
  ImgProduct,
  InfoProduct,
  BoxInputProduct,
  ListSearchProducts,
  RowSearchProduct,
  SelectSearchProduct,
  ImgSearchProduct,
  InfoSearchProduct,
} from './styles';

interface SearchProduct {
  id: string;
  image_url?: string;
  description: string;
  quantity: number;
  internal_code: string;
  sale_value: number;
}

interface SelectedProduct {
  product_id?: string;
  image_url?: string;
  description: string;
  quantity: string;
  value?: number;
  value_formatted?: string;
  value_total: string;
  ref_quantity?: boolean;
  ref_value?: boolean;
}

interface HandleChange {
  value: string;
  index?: number;
  where?: 'quantity' | 'currency';
}

interface RegisterCmdORTableData {
  command_or_table: string;
  quantity: string[];
  value?: (string | undefined)[];
}

const RegisterCommandOrTable: React.FC = () => {
  const { addModal, responseModal, resetResponseModal } = useModal();
  const [isFocused, setIsFocused] = useState(false);
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchProducts, setSearchProducts] = useState<SearchProduct[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const [selectCommandOrTable, setSelectCommandOrTable] = useState<'command' | 'table'>('command');

  const [productSelected, setProductSelected] = useState<SelectedProduct[]>([]);

  const handleSelectCommandOrTable = useCallback(() => {
    setSelectCommandOrTable(prevState => (prevState === 'command' ? 'table' : 'command'));
    formRef.current?.getFieldRef('command_or_table').focus();
  }, []);

  const handleModal = useCallback(() => {
    addModal({
      list_command: true,
    });
  }, [addModal]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const InputkeyDown = useCallback(
    ({ where, index }: Omit<HandleChange, 'value'>) => {
      if (index === undefined) return;
      if (where === 'currency') {
        if (productSelected[index].value !== undefined) {
          setProductSelected(prevState =>
            prevState.map((prev, i) =>
              i === index
                ? {
                    ...prev,
                    ref_quantity: true,
                  }
                : prev,
            ),
          );
        }
      } else if (productSelected[index].quantity !== '') {
        if (productSelected[index].value === undefined) {
          setProductSelected(prevState =>
            prevState.map((prev, i) =>
              i === index
                ? {
                    ...prev,
                    ref_value: true,
                  }
                : prev,
            ),
          );
        } else {
          inputRef.current?.focus();
        }
      }
    },
    [productSelected],
  );

  const hasSubmit = useCallback(() => {
    if (productSelected.length === 0) {
      inputRef.current?.focus();
    } else {
      formRef.current?.submitForm();
    }
  }, [productSelected]);

  const handleSubmit = useCallback(
    async (data: RegisterCmdORTableData) => {
      setLoadingForm(true);
      try {
        formRef.current?.setErrors({});

        let errorProducts: { [key: string]: string } | undefined;
        if (data.command_or_table === '') {
          errorProducts = {
            command: 'Número da Comanda é obrigatório',
          };
        }

        productSelected.forEach(({ value, quantity }, index) => {
          if (!value) {
            errorProducts = {
              [`value[${index}]`]: 'Valor de Venda é obrigatório',
              ...(errorProducts && errorProducts),
            };
          }

          if (quantity === '') {
            errorProducts = {
              [`quantity[${index}]`]: 'Quantidade do produto é obrigatório',
              ...(errorProducts && errorProducts),
            };
          }
        });
        if (errorProducts) {
          formRef.current?.setErrors(errorProducts);
          return;
        }

        const products = productSelected.map(({ product_id, quantity, description, value }) => ({
          product_id,
          description,
          value,
          quantity,
        }));

        await api.post(`${selectCommandOrTable}s/products`, {
          [selectCommandOrTable]: data.command_or_table,
          products,
        });

        addToast({
          type: 'success',
          message: 'Produto Cadastrado com Sucesso',
          description:
            productSelected.length === 1 && Number(productSelected[0].quantity) <= 1
              ? `Produto adicionado na ${selectCommandOrTable === 'command' ? 'comanda' : 'mesa'} ${
                  data.command_or_table
                }`
              : `Produtos adicionados na ${selectCommandOrTable === 'command' ? 'comanda' : 'mesa'} ${
                  data.command_or_table
                }`,
        });

        setProductSelected([]);
        formRef.current?.setFieldValue('command_or_table', ' ');
        formRef.current?.getFieldRef('command_or_table').focus();
      } catch (error) {
        let errorData;
        const whichError: string = error.response && error.response.data ? error.response.data.message : 'error';

        if (whichError === 'Command not found at this Business') {
          errorData = { command_or_table: 'Comanda não encontrada' };
        } else if (whichError === 'Table not found at this Business') {
          errorData = { command_or_table: 'Mesa não encontrada' };
        } else {
          const isIdError = whichError.split('|');
          const findIndex = productSelected.findIndex(product => isIdError[1] && product.product_id === isIdError[1]);

          errorData =
            findIndex > -1
              ? {
                  [`quantity[${findIndex}]`]: 'Produto com quantidade insuficiente',
                }
              : undefined;
        }

        if (errorData) {
          formRef.current?.setErrors(errorData);
        } else {
          addToast({
            type: 'error',
            message: 'Opss... Encontramos um Erro',
            description: `Ocorreu um erro ao tentar cadastrar os produtos na ${
              selectCommandOrTable === 'command' ? 'comanda' : 'mesa'
            }, por favor, tente novamente !`,
          });
        }
      } finally {
        setLoadingForm(false);
      }
    },
    [productSelected, selectCommandOrTable, addToast],
  );

  const handleRemoveProduct = useCallback((index: number) => {
    setProductSelected(prevState => prevState.filter((_, indexPrev) => indexPrev !== index));
    inputRef.current?.focus();
  }, []);

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchProducts([]);
    setCursor(-1);
    if (value !== '') {
      setLoading(true);
      setSearch(value);
    } else {
      setSearch('');
      setLoading(false);
    }
  }, []);

  const handleProductSelected = useCallback((data: Partial<SearchProduct>) => {
    setSearch('');
    setSearchProducts([]);
    if (data.id) {
      const description = data.description as string;

      setProductSelected(prevState => [
        ...prevState.map(prev => ({
          ...prev,
          ref_quantity: undefined,
          ref_value: undefined,
        })),
        {
          product_id: data.id,
          image_url: data.image_url,
          description,
          quantity: '',
          value: data.sale_value,
          value_formatted: FormattedUtils.formattedValue(data.sale_value || 0),
          value_total: FormattedUtils.formattedValue(0),
          ref_quantity: true,
        },
      ]);
    } else if (data.description && data.description.trim() !== '') {
      const { description } = data;
      setProductSelected(prevState => [
        ...prevState.map(prev => ({
          ...prev,
          ref_quantity: undefined,
          ref_value: undefined,
        })),
        {
          description,
          quantity: '',
          value_total: FormattedUtils.formattedValue(0),
          ref_value: true,
        },
      ]);
    }
    setLoading(false);
  }, []);

  const handlekeyDown = useCallback(
    async (e: KeyboardEvent<HTMLInputElement>) => {
      const lengthList = searchProducts.length;

      if (search.trim() === '') {
        if (e.keyCode === 13) hasSubmit();
        setSearchProducts([]);
      } else if (e.keyCode === 13) {
        setLoading(true);
        if (cursor > -1) {
          handleProductSelected(searchProducts[cursor]);
          setCursor(-1);
        } else {
          const response = await api.get<SearchProduct>('products/find', {
            params: {
              internal_code: search,
            },
          });

          if (response.data) {
            const isRegisted = productSelected.findIndex(({ product_id }) => product_id === response.data.id);

            if (isRegisted > -1) {
              setProductSelected(prevState => {
                prevState[isRegisted] = {
                  ...prevState[isRegisted],
                  ref_quantity: true,
                };

                return prevState;
              });
              setSearch('');
            } else {
              handleProductSelected(response.data);
            }
          } else {
            handleProductSelected({
              description: search,
            });
          }
        }
      } else if (e.keyCode === 38 && cursor >= 0) {
        setCursor(cursor - 1);
      } else if (e.keyCode === 40 && cursor < lengthList - 1) {
        setCursor(cursor + 1);
      }
    },
    [cursor, handleProductSelected, search, searchProducts, productSelected, hasSubmit],
  );

  const handleChange = useCallback(({ value, index, where }: HandleChange) => {
    if (index === undefined) return;

    if (where === 'quantity') {
      setProductSelected(prevState =>
        prevState.map((prev, i) =>
          i === index
            ? {
                ...prev,
                quantity: value,
                value_total: FormattedUtils.formattedValue(Number(value) * (prev.value || 0)),
                ref_quantity: undefined,
                ref_value: undefined,
              }
            : {
                ...prev,
                ref_quantity: undefined,
                ref_value: undefined,
              },
        ),
      );
    } else if (where === 'currency') {
      setProductSelected(prevState =>
        prevState.map((prev, i) =>
          i === index
            ? {
                ...prev,
                value: value !== '.00' ? Number(value) : undefined,
                value_total: FormattedUtils.formattedValue(Number(prev.quantity) * Number(value)),
              }
            : prev,
        ),
      );
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() !== '') {
        api
          .get<SearchProduct[]>('products/search', {
            params: {
              search,
            },
          })
          .then(response => {
            setSearchProducts(
              response.data.filter(({ id }) => !productSelected.some(({ product_id }) => product_id === id)),
            );
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
        setSearchProducts([]);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [search, productSelected]);

  useEffect(() => {
    if (responseModal.response) {
      formRef.current?.setFieldValue('command_or_table', responseModal.response);
      inputRef.current?.focus();

      resetResponseModal();
    }
  }, [responseModal.response, resetResponseModal]);

  useEffect(() => {
    formRef.current?.getFieldRef('command_or_table').focus();
  }, []);

  return (
    <LayoutBusiness pgActive="register-command-table">
      <Container>
        <h1>Lançar Produto em Comanda ou Mesa</h1>

        <ContentSelect>
          <ScroolSelectedColor isSelected={selectCommandOrTable} />
          <ButtonChange isSelected={selectCommandOrTable} onClick={handleSelectCommandOrTable}>
            <span>Lançamento de Comanda</span>
            <span>Lançamento de Mesa</span>
          </ButtonChange>
          <ScroolSelectedTransparent isSelected={selectCommandOrTable} />
        </ContentSelect>

        <Form onSubmit={handleSubmit} ref={formRef}>
          <Input
            mask=""
            name="command_or_table"
            icon={GiTicket}
            formatField="number"
            placeholder={selectCommandOrTable === 'command' ? 'Número da Camanda' : 'Número da Mesa'}
            isButtonRight={{
              title: selectCommandOrTable === 'command' ? 'Encontrar Comanda' : 'Encontrar Mesa',
              handleButton: handleModal,
            }}
            hasSubmitDown={hasSubmit}
          />

          {productSelected.length > 0 && <h2>Produto{productSelected.length > 1 && 's'}</h2>}

          <BoxProduct>
            {productSelected.map((product, index) => (
              <LiProduct key={String(index)}>
                <ImgProduct>
                  <img src={product.image_url || noProduct} alt={product.description} />
                </ImgProduct>

                <InfoProduct>
                  <p>{product.description}</p>
                  <div>
                    {product.value_formatted ? (
                      <span>{product.value_formatted}</span>
                    ) : (
                      <InputQuantityProduct
                        name={`value[${index}]`}
                        isCurrency
                        inputAutoFocus={product.ref_value}
                        style={{ width: 120 }}
                        hasIndex={index}
                        isChange={handleChange}
                        hasKeyDown={InputkeyDown}
                      />
                    )}
                    <InputQuantityProduct
                      name={`quantity[${index}]`}
                      style={{ marginLeft: 32, marginRight: 32 }}
                      isNumber
                      inputAutoFocus={product.ref_quantity}
                      hasIndex={index}
                      isChange={handleChange}
                      hasKeyDown={InputkeyDown}
                      maxLength={4}
                    />
                    <span>{product.value_total}</span>
                  </div>
                </InfoProduct>
                <FiXCircle size={26} onClick={() => handleRemoveProduct(index)} />
              </LiProduct>
            ))}
          </BoxProduct>

          <h2>Adicionar Produtos</h2>

          <BoxInputProduct isFocused={isFocused}>
            <FiClipboard size={26} />
            <input
              ref={inputRef}
              placeholder="Código interno, descrição do Produto ou Diversos"
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleSearch}
              onKeyDown={handlekeyDown}
              value={search}
            />

            {loading && <span>loading...</span>}

            {search !== '' && searchProducts.length > 0 && (
              <ListSearchProducts>
                {searchProducts.map((listProduct, index) => (
                  <RowSearchProduct key={listProduct.id} hasSelected={cursor === index}>
                    <SelectSearchProduct
                      hasSelected={cursor === index}
                      onClick={() => handleProductSelected(listProduct)}
                    >
                      <ImgSearchProduct>
                        <img src={listProduct.image_url || noProduct} alt={listProduct.description} />
                      </ImgSearchProduct>
                      <InfoSearchProduct>
                        <p>{listProduct.description}</p>
                        <span>
                          Código: <strong>{listProduct.internal_code}</strong>
                        </span>
                      </InfoSearchProduct>
                    </SelectSearchProduct>
                  </RowSearchProduct>
                ))}
              </ListSearchProducts>
            )}
          </BoxInputProduct>
          <Button type="button" loading={loadingForm} onClick={hasSubmit}>
            LANÇAR PRODUTO
          </Button>
        </Form>

        <p>
          Informe o número da comanda ou o número da mesa para <br />
          cadastrada um novo produto.
        </p>
      </Container>
    </LayoutBusiness>
  );
};

export default RegisterCommandOrTable;
