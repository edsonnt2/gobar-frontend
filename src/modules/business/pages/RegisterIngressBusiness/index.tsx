import React, { useCallback, useRef, useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

import { useHistory } from 'react-router-dom';
import { IoMdTrash } from 'react-icons/io';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Header from '~/shared/components/Header';
import Button from '~/shared/components/Button';
import Input from '~/shared/components/Input';
import Select from '~/shared/components/Select';
import api from '~/shared/services/api';
import { useToast } from '~/shared/hooks/Toast';
import getValidationErrors from '~/shared/utils/getValidationErrors';
import MenuRegisterPTT from '~/modules/business/components/MenuRegisterPTT';
import FormattedUtils from '~/shared/utils/formattedUtils';

import {
  Container,
  Content,
  BackPage,
  Main,
  ContentRegister,
  ContentInput,
  SeparateInput,
  ContentIngress,
  ListIngress,
  Footer,
} from './styles';

interface RegisterIngressBusinessData {
  description: string;
  value: string;
  consume: string;
}

interface Ingress {
  id: string;
  description: string;
  value: number;
  formattedValue: string;
  consume: boolean;
}

const RegisterIngressBusiness: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const [ingress, setIngress] = useState<Ingress[]>([]);

  useEffect(() => {
    api.get<Ingress[]>('ingress').then(response => {
      setIngress(
        response.data.map(getIngress => ({
          ...getIngress,
          formattedValue: FormattedUtils.formattedValue(getIngress.value),
        })),
      );
    });
  }, []);

  const handleSubmit = useCallback(
    async (data: RegisterIngressBusinessData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          description: Yup.string().required('Descrição é obrigatório'),
          value: Yup.string().required('Valor de Entrada é obrigatório'),
          consume: Yup.string().required('Tipo de Entrada é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { description, value, consume } = data;

        const formattedValue = value
          .split('')
          .filter(char => Number(char) || char === '0' || char === ',')
          .join('')
          .replace(',', '.');

        const response = await api.post<Ingress>('ingress', {
          description,
          value: formattedValue,
          consume: !!Number(consume),
        });

        setIngress(prevIngress => [
          ...prevIngress,
          {
            ...response.data,
            formattedValue: FormattedUtils.formattedValue(response.data.value),
          },
        ]);

        formRef.current?.setData({
          description: ' ',
          value: '.00',
          consume: ' ',
        });
        formRef.current?.reset();
        formRef.current?.getFieldRef('description').focus();

        addToast({
          type: 'success',
          message: 'Cadastro de Entrada',
          description: 'Entrada cadastrada com sucesso',
        });
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
            case 'Ingress description already registered':
              errorData = { description: 'Descrição de Entrada já cadastrada' };
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
              message: 'Erro no Cadastro de Entrada',
              description:
                'Ocorreu um erro ao fazer o cadastro da entradao produto, tente novamente !',
            });
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const handleDeleteIngress = useCallback(
    async (id: string) => {
      try {
        await api.delete(`ingress/${id}`);

        setIngress(prevIngress =>
          prevIngress.filter(getIngress => getIngress.id !== id),
        );
        addToast({
          type: 'success',
          message: 'Entrada Deletada com sucesso',
        });
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Opss... Encontramos um erro',
          description:
            'Ocorreu um erro ao tenta deleta entrada, tente novamente',
        });
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Header />

      <Content>
        <BackPage onClick={() => history.push('/business')}>
          <FiArrowLeft size={20} />
          Ir para Início
        </BackPage>

        <Main>
          <MenuRegisterPTT whoSelected="ingress" />

          <ContentRegister>
            <h1>Cadastrar Entrada</h1>

            <Form onSubmit={handleSubmit} ref={formRef}>
              <Input
                mask=""
                name="description"
                hasTitle="Descrição da Entrada"
              />

              <ContentInput>
                <Input
                  mask=""
                  name="value"
                  hasTitle="Valor da Entrada"
                  style={{ width: 170, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                  isCurrency
                />
                <SeparateInput />

                <Select name="consume" hasTitle="Tipo de Entrada">
                  <option value="">Selecione</option>
                  <option value="1">C/ Consuma</option>
                  <option value="0">S/ Consuma</option>
                </Select>
              </ContentInput>

              <Button loading={loading} type="submit">
                CADASTRAR
              </Button>
            </Form>

            {ingress.length > 0 && (
              <>
                <h2>Todas as Entradas</h2>
                <ContentIngress>
                  {ingress.map(
                    ({ id, description, formattedValue, consume }) => (
                      <ListIngress key={id}>
                        <span>{description}</span>
                        <span>{formattedValue}</span>
                        <span>{consume ? 'C/ Consuma' : 'S/ Consuma'}</span>
                        <IoMdTrash onClick={() => handleDeleteIngress(id)} />
                      </ListIngress>
                    ),
                  )}
                </ContentIngress>
              </>
            )}
          </ContentRegister>
        </Main>
      </Content>
      <Footer>
        <div>goBar © 2020 - Todos os direitos reservados</div>
      </Footer>
    </Container>
  );
};

export default RegisterIngressBusiness;
