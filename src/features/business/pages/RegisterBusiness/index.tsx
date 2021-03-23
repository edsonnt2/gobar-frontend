import { useCallback, useState, useRef, useEffect } from 'react';
import { FiArrowLeft, FiCamera } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { BrasilAPIService, BusinessService, RegisterBusinessDTO } from '@/services';
import { Header, Input, FileInput, Button } from '@/components';
import { useToast, useAuth, useLoading } from '@/hooks';
import { FormattedUtils, getValidationErrors } from '@/utils';
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

interface CategoriesBusiness {
  name: string;
}

const RegisterBusiness: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { setLoading } = useLoading();
  const { saveAuth, user } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchCategories, setSearchCategories] = useState<CategoriesBusiness[]>([]);
  const [searchCategory, setSearchCategory] = useState('');

  const functionThatSubmitsForm = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleListCategory = useCallback(
    (saveCategory: string) => {
      if (saveCategory?.trim() && categories.length < 4) {
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

  const handleBlur = useCallback(
    async (cep: string) => {
      if (!cep) return;

      const formattedCep = FormattedUtils.onlyNumber(cep);
      if (formattedCep.length < 8) return;

      formRef.current?.setData({
        street: 'carregando...',
        neighborhood: 'carregando...',
        city: 'carregando...',
        state: ' ',
      });

      try {
        const response = await BrasilAPIService.fetchAddress(FormattedUtils.onlyNumber(cep));

        if (!response) throw new Error();

        const { street, neighborhood, city, state } = response;

        formRef.current?.setData({
          street,
          neighborhood,
          city,
          state,
        });
      } catch {
        formRef.current?.setData({
          street: ' ',
          neighborhood: ' ',
          city: ' ',
        });

        addToast({
          type: 'error',
          message: 'CEP não encontrado',
        });
      }
    },
    [addToast],
  );

  const handleSubmit = useCallback(
    async (data: RegisterBusinessDTO) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome do Negócio é obrigatório'),
          taxId: Yup.string().required('CNJ/CNPJ é obrigatório'),
          zip_code: Yup.string().required('CEP é obrigatório'),
          number: Yup.string().required('Número é obrigatório'),
          street: Yup.string().required('Logradouro é obrigatório'),
          neighborhood: Yup.string().required('Bairro é obrigatório'),
          city: Yup.string().required('Cidade é obrigatório'),
          state: Yup.string().required('Estado é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (!categories?.length) throw new Error();

        const { cell_phone, phone, ...restData } = data;

        const response = await BusinessService.registerBusiness({
          ...restData,
          ...(cell_phone && { cell_phone: FormattedUtils.onlyNumber(cell_phone) }),
          ...(phone && { phone: FormattedUtils.onlyNumber(phone) }),
          categories,
        });

        if (!response) throw new Error();

        const { business, token } = response;

        saveAuth({
          token,
          business,
          user,
        });

        addToast({
          type: 'success',
          message: 'Cadastro feito com sucesso',
          description: 'Seu novo Negócio foi cadastrado no goBar :D',
        });

        history.push('/business/register-product');
      } catch (error) {
        let errorCategory: string | undefined;

        if (!categories?.length)
          errorCategory = data.category ? 'Salve a categoria colocada com enter' : 'Coloque pelo menos 1 categoria';

        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          if (errorCategory) errors.category = errorCategory;
          formRef.current?.setErrors(errors);
          return;
        }

        const whichError = error?.response?.data?.message || undefined;

        const typeErrors: { [key: string]: any } = {
          'Business name already registered': { name: 'Nome de Negócio já cadastrodo' },
          'Cell phone already registered with another business': {
            cell_phone: 'Celular já cadastrado em outro Negócio',
          },
          'Phone already registered with another business': { phone: 'Telefone já cadastrado em outro Negócio' },
          'TaxId informed is invalid': { taxId: 'CPF/CNPJ informado é inválido' },
          'CPF registered at another business for another user': {
            taxId: 'CPF cadastrado em outro Negócio por outro usuário',
          },
          'CNPJ registered at another business': { taxId: 'CNPJ cadatrado em outro Negócio' },
        };

        if (typeErrors[whichError] || errorCategory) {
          formRef.current?.setErrors({
            ...(errorCategory && { category: errorCategory }),
            ...typeErrors[whichError],
          });
          return;
        }

        addToast({
          type: 'error',
          message: 'Erro no cadastro',
          description: whichError || 'Ocorreu um erro ao fazer o cadastro, por favor, tente novamente !',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, categories, saveAuth, user, history, setLoading],
  );

  const handleSearchCategory = useCallback(
    (category: string) => {
      setSearchCategories([]);
      if (category?.trim() && categories.length < 4) {
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
    const timer = setTimeout(async () => {
      if (searchCategory?.trim()) {
        try {
          const response = await BusinessService.fetchCategories(searchCategory);
          setSearchCategories(response);
        } catch {
          addToast({
            type: 'error',
            message: 'Opss... Encontramos um erro',
            description: 'Ocorreu um erro ao busca por categorias',
          });
        } finally {
          setLoadingCategory(false);
        }
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
              <Input name="name" hasTitle="Nome do seu Negócio" />

              <Input
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

              <Input formatField="taxId" name="taxId" hasTitle="CPF/CNPJ" />

              <ContentInput>
                <Input
                  mask="99999-999"
                  name="zip_code"
                  hasTitle="CEP"
                  style={{ width: 110, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                  handleChange={handleBlur}
                />
                <SeparateInput />
                <Input
                  maxLength={9}
                  formatField="number"
                  name="number"
                  hasTitle="Número"
                  style={{ width: 100, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                />
                <SeparateInput />
                <Input name="complement" hasTitle="Complemento" placeholder="(Opcional)" />
              </ContentInput>

              <ContentInput>
                <Input name="street" hasTitle="Logradouro" placeholder="Rua/Avenida" disabled />
                <SeparateInput />
                <Input name="neighborhood" hasTitle="Bairro" disabled />
              </ContentInput>

              <ContentInput>
                <Input name="city" hasTitle="Cidade" disabled />
                <SeparateInput />
                <Input
                  name="state"
                  hasTitle="Estado"
                  maxLength={2}
                  style={{ width: 100, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                  disabled
                />
              </ContentInput>

              <Button type="button" onClick={functionThatSubmitsForm}>
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
