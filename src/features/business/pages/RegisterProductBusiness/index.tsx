import { useCallback, useRef, useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { AiOutlineBarcode } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { ProductService } from '@/services';
import { Header, Button, Input, FileInput } from '@/components';
import { useLoading, useToast } from '@/hooks';
import { getValidationErrors, FormattedUtils } from '@/utils';
import { addImage } from '@/assets';

import { MenuRegisterPTT } from '../../components';

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

interface CategoryProvider {
  name: string;
}

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
  const { setLoading } = useLoading();
  const { addToast } = useToast();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);

  const [loadingCategory, setLoadingCategory] = useState(false);
  const [allCategories, setAllCategories] = useState<CategoryProvider[]>([]);
  const [searchCategory, setSearchCategory] = useState('');
  const [porcentDefault, setPorcentDefault] = useState('100');
  const [valueSaleDefault, setValueSaleDefault] = useState('');
  const [valuePushaseDefault, setvaluePushaseDefault] = useState(0);

  const [loadingCategoryProvider, setLoadingCategoryProvider] = useState(false);
  const [allCategoriesProvider, setAllCategoriesProvider] = useState<CategoryProvider[]>([]);
  const [searchCategoryProvider, setSearchCategoryProvider] = useState('');

  const functionThatSubmitsForm = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleSubmit = useCallback(
    async (data: RegisterProductBusinessData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          description: Yup.string().required('Descrição do Produto é obrigatório'),
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

        await ProductService.registerProduct({
          ...data,
          pushase_value: FormattedUtils.valueDefault(data.pushase_value),
          sale_value: FormattedUtils.valueDefault(data.sale_value),
        });

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
          return;
        }

        const whichError = error?.response?.data?.message || undefined;

        const typeErrors: { [key: string]: any } = {
          'Internal code already registered': { internal_code: 'Código interno já cadastrado' },
          'Description already registered': { description: 'Descrição já cadastrada' },
        };

        if (whichError && typeErrors[whichError]) {
          formRef.current?.setErrors(typeErrors[whichError]);
          return;
        }

        addToast({
          type: 'error',
          message: 'Erro no cadastro',
          description: whichError || 'Ocorreu um erro ao fazer o cadastro do produto, tente novamente !',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, setLoading],
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

  const handleValueWithPorcent = useCallback(
    ({ value }: { value: number }) => {
      const result = value / 100;
      const calcValue = value + Number(porcentDefault) * result;
      setValueSaleDefault(calcValue > 0 ? FormattedUtils.formattedValue(calcValue) : ' ');
      setvaluePushaseDefault(value);
    },
    [porcentDefault],
  );

  const handleChangePorcent = useCallback(
    ({ value }: { value: number }) => {
      const result = valuePushaseDefault / 100;
      const calcValue = valuePushaseDefault + value * result;
      setValueSaleDefault(calcValue > 0 ? FormattedUtils.formattedValue(calcValue) : ' ');
      setPorcentDefault(String(value));
    },
    [valuePushaseDefault],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchCategoryProvider.trim() !== '') {
        ProductService.fetchCategoryProviders(searchCategoryProvider)
          .then(response => {
            setAllCategoriesProvider(response);
          })
          .catch(() => {
            addToast({
              type: 'error',
              message: 'Opss... Encontramos um erro',
              description: 'Ocorreu um erro ao buscar lista de fornecedores',
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
        ProductService.fetchCategoryProducts(searchCategory)
          .then(response => {
            setAllCategories(response);
          })
          .catch(() => {
            addToast({
              type: 'error',
              message: 'Opss... Encontramos um erro',
              description: 'Ocorreu um erro ao buscar lista de categorias',
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
                <FileInput name="image" imgPreview={addImage} />
              </ImageProduct>

              <Input name="description" hasTitle="Descrição do Produto" />
              <Input
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
                  formatField="number"
                  name="quantity"
                  hasTitle="Quatidade"
                  style={{ width: 152, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                  maxLength={11}
                />
                <SeparateInput />
                <Input
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
                  name="internal_code"
                  hasTitle="Código Interno"
                  style={{ width: 152, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                />
                <SeparateInput />
                <Input icon={AiOutlineBarcode} name="barcode" hasTitle="Código de Barra" placeholder="(Opcional)" />
              </ContentInput>

              <ContentInput>
                <Input
                  name="pushase_value"
                  hasTitle="Valor de Compra"
                  style={{ width: 198, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                  hasOnChange={{
                    fnOnChange: handleValueWithPorcent,
                  }}
                  isCurrency
                />
                <SeparateInput />
                <Input
                  name="porcent"
                  formatField="number"
                  hasTitle="Margem"
                  style={{ width: 122, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                  hasOnChange={{
                    fnOnChange: handleChangePorcent,
                  }}
                  defaultValue={porcentDefault}
                  maxLength={3}
                />
                <SeparateInput />
                <Input
                  name="sale_value"
                  hasTitle="Valor de Venda"
                  style={{ width: 198, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                  defaultValue={valueSaleDefault}
                  isCurrency
                />
              </ContentInput>

              <Button type="button" onClick={functionThatSubmitsForm}>
                CADASTRAR
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
