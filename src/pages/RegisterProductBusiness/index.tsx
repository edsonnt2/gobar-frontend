import React, { useCallback, useRef, useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { AiOutlineBarcode } from 'react-icons/ai';

import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Header from '../../components/Header';
import Button from '../../components/Button';
import {
  Container,
  Content,
  BackPage,
  Main,
  ContentRegister,
  ContentInput,
  SeparateInput,
  ImageProduct,
  Footer,
} from './styles';
import Input from '../../components/Input';
import FileInput from '../../components/FIleInput';
import noProduct from '../../assets/add-image.png';
import api from '../../services/api';
import { useToast } from '../../hooks/Toast';
import getValidationErrors from '../../utils/getValidationErrors';
import MenuRegisterPTT from '../../components/MenuRegisterPTT';

interface CategoryProvider {
  name: string;
}

type TypeCategoies = 'category' | 'provider';

interface RegisterProductBusinessData {
  image?: File;
  description: string;
  category: string;
  quantity: string;
  provider: string;
  internal_code: string;
  barcode?: string;
  pushase_value: string;
  porcent: string;
  sale_value: string;
}

const RegisterProductBusiness: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);

  const [loadingCategory, setLoadingCategory] = useState(false);
  const [allCategories, setAllCategories] = useState<CategoryProvider[]>([]);
  const [searchCategory, setSearchCategory] = useState('');

  const [loadingCategoryProvider, setLoadingCategoryProvider] = useState(false);
  const [allCategoriesProvider, setAllCategoriesProvider] = useState<
    CategoryProvider[]
  >([]);
  const [searchCategoryProvider, setSearchCategoryProvider] = useState('');

  const functionThatSubmitsForm = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleSubmit = useCallback(
    async (data: RegisterProductBusinessData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape<RegisterProductBusinessData>({
          description: Yup.string().required(
            'Descrição do Produto é obrigatório',
          ),
          category: Yup.string().required('Categoria do produto é obrigatório'),
          quantity: Yup.string().required('Quantidade é obrigatório'),
          provider: Yup.string().required('Fornecedor é obrigatório'),
          internal_code: Yup.string().required('Código interno é obrigatório'),
          pushase_value: Yup.string().required('Valor de Compra é obrigatório'),
          porcent: Yup.string().required('Porcentagem é obrigatório'),
          sale_value: Yup.string().required('Valor de Venda é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          image,
          description,
          category,
          quantity,
          provider,
          internal_code,
          barcode,
          pushase_value,
          porcent,
          sale_value,
        } = data;

        const formattedPushaseValue = pushase_value
          .split('')
          .filter(char => Number(char) || char === '0' || char === ',')
          .join('')
          .replace(',', '.');

        const formattedSaleValue = sale_value
          .split('')
          .filter(char => Number(char) || char === '0' || char === ',')
          .join('')
          .replace(',', '.');

        const formData = new FormData();

        formData.append('description', description);
        formData.append('category', category);
        formData.append('quantity', quantity);
        formData.append('provider', provider);
        formData.append('internal_code', internal_code);
        formData.append('pushase_value', formattedPushaseValue);
        formData.append('porcent', porcent);
        formData.append('sale_value', formattedSaleValue);
        if (image) formData.append('image', image);
        if (barcode) formData.append('barcode', barcode);

        await api.post('products', formData);

        addToast({
          type: 'success',
          message: 'Produto cadastrado',
          description: 'Seu produto foi cadastrado com sucesso',
        });

        formRef.current?.setData({
          description: ' ',
          category: ' ',
          quantity: ' ',
          provider: ' ',
          internal_code: ' ',
          barcode: ' ',
          pushase_value: '.00',
          porcent: '100',
          sale_value: '.00',
        });
        formRef.current?.reset();
        formRef.current?.getFieldRef('description').focus();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
        } else {
          let errorData;
          const whichError =
            error.response && error.response.data
              ? error.response.data.message
              : 'error';

          switch (whichError) {
            case 'Internal code already registered':
              errorData = { internal_code: 'Código interno já cadastrado' };
              break;
            default:
              errorData = undefined;
              break;
          }

          if (errorData) {
            formRef.current?.setErrors(errorData);
          } else {
            addToast({
              type: 'error',
              message: 'Erro no cadastro',
              description:
                'Ocorreu um erro ao fazer o cadastro do produto, tente novamente !',
            });
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const handleCategory = useCallback((field: string) => {
    if (field === 'category') setAllCategories([]);
    else setAllCategoriesProvider([]);

    formRef.current?.getFieldRef(field).focus();
  }, []);

  const handleSearchCategory = useCallback((category: string) => {
    setAllCategories([]);
    if (category.trim() !== '') {
      setSearchCategory(category);
      setLoadingCategory(true);
    } else {
      setSearchCategory('');
      setLoadingCategory(false);
    }
  }, []);

  const handleSearchCategoryProvider = useCallback((category: string) => {
    setAllCategoriesProvider([]);
    if (category.trim() !== '') {
      setSearchCategoryProvider(category);
      setLoadingCategoryProvider(true);
    } else {
      setSearchCategoryProvider('');
      setLoadingCategoryProvider(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchCategoryProvider.trim() !== '') {
        api
          .get<CategoryProvider[]>('products/categories/search-provider', {
            params: {
              search: searchCategoryProvider,
            },
          })
          .then(({ data }) => {
            setAllCategoriesProvider(data);
          })
          .catch(() => {
            addToast({
              type: 'error',
              message: 'Opss... Encontramos um erro',
              description: 'Ocorreu um erro ao busca por cliente',
            });
          })
          .finally(() => {
            setLoadingCategoryProvider(false);
          });
      }
    }, 250);
    return () => {
      clearTimeout(timer);
    };
  }, [searchCategoryProvider, addToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchCategory.trim() !== '') {
        api
          .get<CategoryProvider[]>('products/categories/search-product', {
            params: {
              search: searchCategory,
            },
          })
          .then(({ data }) => {
            setAllCategories(data);
          })
          .catch(() => {
            addToast({
              type: 'error',
              message: 'Opss... Encontramos um erro',
              description: 'Ocorreu um erro ao busca por cliente',
            });
          })
          .finally(() => {
            setLoadingCategory(false);
          });
      }
    }, 250);
    return () => {
      clearTimeout(timer);
    };
  }, [searchCategory, addToast]);

  useEffect(() => {
    formRef.current?.setFieldValue('porcent', '100');
  }, []);

  return (
    <Container>
      <Header />

      <Content>
        <BackPage onClick={() => history.push('/business')}>
          <FiArrowLeft size={20} />
          Ir para Início
        </BackPage>

        <Main>
          <MenuRegisterPTT whoSelected="product" />

          <ContentRegister>
            <h1>Cadastrar Produto</h1>

            <Form onSubmit={handleSubmit} ref={formRef}>
              <ImageProduct htmlFor="image">
                <FileInput name="image" imgPreview={noProduct} />
              </ImageProduct>

              <Input
                mask=""
                name="description"
                hasTitle="Descrição do Produto"
              />
              <Input
                mask=""
                name="category"
                hasAutoComplete={{
                  loading: loadingCategory,
                  list: allCategories,
                  handleChange: handleSearchCategory,
                  handleSelect: handleCategory,
                }}
                hasTitle="Categoria"
              />

              <ContentInput>
                <Input
                  mask=""
                  formatField="number"
                  name="quantity"
                  hasTitle="Quatidade"
                  style={{ width: 152, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                  maxLength={11}
                />
                <SeparateInput />
                <Input
                  mask=""
                  name="provider"
                  hasAutoComplete={{
                    loading: loadingCategoryProvider,
                    list: allCategoriesProvider,
                    handleChange: handleSearchCategoryProvider,
                    handleSelect: handleCategory,
                  }}
                  hasTitle="Fornecedor"
                />
              </ContentInput>

              <ContentInput>
                <Input
                  mask=""
                  name="internal_code"
                  hasTitle="Código Interno"
                  style={{ width: 152, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                />
                <SeparateInput />
                <Input
                  icon={AiOutlineBarcode}
                  mask=""
                  name="barcode"
                  hasTitle="Código de Barra"
                  placeholder="(Opcional)"
                />
              </ContentInput>

              <ContentInput>
                <Input
                  mask=""
                  name="pushase_value"
                  hasTitle="Valor de Compra"
                  style={{ width: 198, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                  isCurrency
                />
                <SeparateInput />
                <Input
                  mask=""
                  name="porcent"
                  formatField="number"
                  hasTitle="Margem"
                  style={{ width: 122, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                  maxLength={3}
                />
                <SeparateInput />
                <Input
                  mask=""
                  name="sale_value"
                  hasTitle="Valor de Venda"
                  style={{ width: 198, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                  isCurrency
                />
              </ContentInput>

              <Button type="button" onClick={functionThatSubmitsForm}>
                {loading ? 'Carregando...' : 'CADASTRAR'}
              </Button>
            </Form>
          </ContentRegister>
        </Main>
      </Content>
      <Footer>
        <div>goBar © 2020 - Todos os direitos reservados</div>
      </Footer>
    </Container>
  );
};

export default RegisterProductBusiness;
