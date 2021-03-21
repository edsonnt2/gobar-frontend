import { useCallback, useState, useRef, useEffect } from 'react';
import { FiArrowLeft, FiCamera } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import Cep from 'cep-promise';
import * as Yup from 'yup';

import api from '@/services/api';
import { Header, Input, FileInput, Button } from '@/components';
import { useToast, useAuth } from '@/hooks';
import { getValidationErrors } from '@/utils';
import { noBusiness } from '@/assets';

import {
  Container,
  Content,
  BackPage,
  Main,
  ContentRegister,
  BoxImgBusiness,
  ContentInput,
  SeparateInput,
  Footer,
} from './styles';

interface RegisterBusinessData {
  file?: File;
  name: string;
  category?: string;
  cell_phone?: string;
  phone?: string;
  taxId: string;
  zip_code: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
}

interface CategoriesBusiness {
  name: string;
}

const RegisterBusiness: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { saveAuth, user } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchCategories, setSearchCategories] = useState<CategoriesBusiness[]>([]);
  const [searchCategory, setSearchCategory] = useState('');

  const functionThatSubmitsForm = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleListCategory = useCallback(
    (saveCategory: string) => {
      if (saveCategory.trim() !== '' && categories.length < 4) {
        const haveSave = categories.find(cat => cat === saveCategory);

        if (!haveSave) setCategories([...categories, saveCategory]);

        setSearchCategory('');
        setSearchCategories([]);
        formRef.current?.setFieldValue('category', ' ');
        formRef.current?.getFieldRef('category').focus();
      }
    },
    [categories],
  );

  const handleRemoveCategory = useCallback(
    (categoryRemove: string) => {
      setCategories(categories.filter(cat => cat !== categoryRemove));
    },
    [categories],
  );

  const handleBlur = useCallback(async () => {
    const cep: string = formRef.current?.getFieldValue('zip_code');

    const formattedCep = Number(
      cep
        .split('')
        .filter(char => Number(char) || char === '0')
        .join(''),
    );

    formRef.current?.setData({
      street: 'carregando...',
      district: 'carregando...',
      city: 'carregando...',
      state: ' ',
    });

    try {
      const { street, neighborhood, city, state } = await Cep(formattedCep);
      formRef.current?.setData({
        street,
        district: neighborhood,
        city,
        state,
      });
    } catch {
      formRef.current?.setData({
        street: ' ',
        district: ' ',
        city: ' ',
      });

      addToast({
        type: 'error',
        message: 'CEP não encontrado',
        description: 'Ocorreu um erro ao tentar encontrar os dados de CEP',
      });
    }
  }, [addToast]);

  const handleSubmit = useCallback(
    async (data: RegisterBusinessData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome do Negócio é obrigatório'),
          taxId: Yup.string().required('CNJ/CNPJ é obrigatório'),
          zip_code: Yup.string().required('CEP é obrigatório'),
          number: Yup.string().required('Número é obrigatório'),
          street: Yup.string().required('Logradouro é obrigatório'),
          district: Yup.string().required('Bairro é obrigatório'),
          city: Yup.string().required('Cidade é obrigatório'),
          state: Yup.string().required('Estado é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (categories.length === 0) throw new Error();

        const {
          file,
          cell_phone,
          phone,
          city,
          taxId,
          district,
          name,
          number,
          state,
          street,
          zip_code,
          complement,
        } = data;

        const formattedCellPhone =
          cell_phone &&
          cell_phone
            .split('')
            .filter(char => Number(char) || char === '0')
            .join('');

        const formattedPhone =
          phone &&
          phone
            .split('')
            .filter(char => Number(char) || char === '0')
            .join('');

        const formData = new FormData();

        formData.append('name', name);
        formData.append('categories', categories.join(','));
        formData.append('taxId', taxId);
        formData.append('zip_code', zip_code);
        formData.append('street', street);
        formData.append('number', number);
        formData.append('district', district);
        formData.append('city', city);
        formData.append('state', state);
        if (complement) formData.append('complement', complement);
        if (formattedCellPhone) formData.append('cell_phone', formattedCellPhone);
        if (formattedPhone) formData.append('phone', formattedPhone);
        if (file) formData.append('avatar', file);

        const {
          data: { business, token },
        } = await api.post('business', formData);

        saveAuth({
          token,
          business,
          user,
        });

        addToast({
          type: 'success',
          message: 'Cadastro feito com sucesso',
          description: 'Seu novo Négocio foi cadastrado no goBar :D',
        });

        history.push('/business/register-product');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          if (categories.length === 0)
            errors.category =
              data.category === '' ? 'Coloque pelo menos 1 categoria' : 'Salve a categoria colocada com enter';

          formRef.current?.setErrors(errors);
        } else {
          let errorData;

          const whichError = error.response && error.response.data ? error.response.data.message : 'error';

          switch (whichError) {
            case 'Business name already registered':
              errorData = { name: 'Nome de Negócio já cadastrodo' };
              break;
            case 'Cell phone already registered with another business':
              errorData = {
                cell_phone: 'Celular já cadastrado em outro Negócio',
              };
              break;
            case 'Phone already registered with another business':
              errorData = { phone: 'Telefone já cadastrado em outro Negócio' };
              break;
            case 'TaxId informed is invalid':
              errorData = { taxId: 'CPF/CNPJ informado é inválido' };
              break;
            case 'CPF registered at another business for another user':
              errorData = {
                taxId: 'CPF cadastrado em outro Negócio por outro usuário',
              };
              break;
            case 'CNPJ registered at another business':
              errorData = { taxId: 'CNPJ cadatrado em outro Negócio' };
              break;
            default:
              errorData = undefined;
              break;
          }

          if (errorData) {
            formRef.current?.setErrors(errorData);
          } else if (categories.length === 0) {
            const erroCategory =
              data.category === '' ? 'Coloque pelo menos 1 categoria' : 'Salve a categoria colocada com enter';

            formRef.current?.setErrors({ category: erroCategory });
          } else {
            addToast({
              type: 'error',
              message: 'Erro no cadastro',
              description: 'Ocorreu um erro ao fazer o cadastro, por favor, tente novamente !',
            });
          }
        }
        setLoading(false);
      }
    },
    [addToast, categories, saveAuth, user, history],
  );

  const handleSearchCategory = useCallback(
    (category: string) => {
      setSearchCategories([]);
      if (category.trim() !== '' && categories.length < 4) {
        setSearchCategory(category);
        setLoadingCategory(true);
      } else {
        setSearchCategory('');
        setLoadingCategory(false);
      }
    },
    [categories],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchCategory.trim() !== '') {
        api
          .get<CategoriesBusiness[]>('business/categories/search', {
            params: {
              search: searchCategory,
            },
          })
          .then(({ data }) => {
            setSearchCategories(data);
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

  return (
    <Container>
      <Header />

      <Content>
        <BackPage onClick={() => history.goBack()}>
          <FiArrowLeft size={20} />
          Voltar
        </BackPage>

        <Main>
          <h1>Tudo sobre o seu Negócio</h1>

          <ContentRegister>
            <Form onSubmit={handleSubmit} ref={formRef}>
              <BoxImgBusiness htmlFor="file">
                <FileInput name="file" imgInCircle imgPreview={noBusiness} />

                <span>
                  <FiCamera size={20} />
                </span>
              </BoxImgBusiness>
              <Input mask="" name="name" hasTitle="Nome do seu Negócio" />

              <Input
                mask=""
                name="category"
                hasTitle="Categorias"
                placeholder="Adicione até 4 categorias"
                hasMultSelect={{
                  items: categories,
                  handleRemove: handleRemoveCategory,
                  handleSelect: handleListCategory,
                }}
                hasAutoComplete={{
                  loading: loadingCategory,
                  list: searchCategories,
                  handleChange: handleSearchCategory,
                }}
              />

              <ContentInput>
                <Input mask="(99) 99999-9999" name="cell_phone" hasTitle="Celular/Whatsapp" placeholder="(Opcional)" />
                <SeparateInput />
                <Input mask="(99) 9999-9999" name="phone" hasTitle="Telefone" placeholder="(Opcional)" />
              </ContentInput>

              <Input mask="" formatField="taxId" name="taxId" hasTitle="CPF/CNPJ" />

              <ContentInput>
                <Input
                  mask="99999-999"
                  name="zip_code"
                  hasTitle="CEP"
                  style={{ width: 110, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                  hasUpBlur={{ handleBlur }}
                />
                <SeparateInput />
                <Input
                  mask=""
                  maxLength={9}
                  formatField="number"
                  name="number"
                  hasTitle="Número"
                  style={{ width: 100, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                />
                <SeparateInput />
                <Input mask="" name="complement" hasTitle="Complemento" placeholder="(Opcional)" />
              </ContentInput>

              <ContentInput>
                <Input mask="" name="street" hasTitle="Logradouro" placeholder="Rua/Avenida" disabled />
                <SeparateInput />
                <Input mask="" name="district" hasTitle="Bairro" disabled />
              </ContentInput>

              <ContentInput>
                <Input mask="" name="city" hasTitle="Cidade" disabled />
                <SeparateInput />
                <Input
                  mask=""
                  name="state"
                  hasTitle="Estado"
                  maxLength={2}
                  style={{ width: 100, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                  disabled
                />
              </ContentInput>

              <Button type="button" loading={loading} onClick={functionThatSubmitsForm}>
                CONTINUAR
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

export default RegisterBusiness;
