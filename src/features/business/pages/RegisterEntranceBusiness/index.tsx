import { useCallback, useRef, useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { IoMdTrash } from 'react-icons/io';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { Entrance, EntranceService } from '@/services';
import { Header, Button, Input, Select } from '@/components';
import { useToast } from '@/hooks';
import { getValidationErrors, FormattedUtils } from '@/utils';

import { MenuRegisterPTT } from '../../components';

import {
  Container,
  Content,
  BackPage,
  Main,
  ContentRegister,
  ContentInput,
  SeparateInput,
  ContentEntrance,
  ListEntrance,
  Footer,
} from './styles';

interface RegisterEntranceBusinessData {
  description: string;
  value: string;
  consume: string;
}

const RegisterEntranceBusiness: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const [entrance, setEntrance] = useState<Entrance[]>([]);

  useEffect(() => {
    EntranceService.fetchEntrance().then(response => {
      setEntrance(
        response.map(getEntrance => ({
          ...getEntrance,
          value_formatted: FormattedUtils.formattedValue(getEntrance.value),
        })),
      );
    });
  }, []);

  const handleSubmit = useCallback(
    async (data: RegisterEntranceBusinessData) => {
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

        const response = await EntranceService.registerEntrance({
          description,
          value: FormattedUtils.valueDefault(value),
          consume: !!Number(consume),
        });

        if (!response) return;

        setEntrance(prevEntrance => [
          ...prevEntrance,
          {
            ...response,
            value_formatted: FormattedUtils.formattedValue(response.value),
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

          const whichError = error.response && error.response.data ? error.response.data.message : 'error';

          switch (whichError) {
            case 'Entrance description already registered':
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
              description: 'Ocorreu um erro ao fazer o cadastro da entradao produto, tente novamente !',
            });
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const handleDeleteEntrance = useCallback(
    async (id: string) => {
      try {
        await EntranceService.removeEntrance(id);

        setEntrance(prevEntrance => prevEntrance.filter(getEntrance => getEntrance.id !== id));
        addToast({
          type: 'success',
          message: 'Entrada Deletada com sucesso',
        });
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Opss... Encontramos um erro',
          description: 'Ocorreu um erro ao tenta deleta entrada, tente novamente',
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
          <MenuRegisterPTT whoSelected="entrance" />

          <ContentRegister>
            <h1>Cadastrar Entrada</h1>

            <Form onSubmit={handleSubmit} ref={formRef}>
              <Input mask="" name="description" hasTitle="Descrição da Entrada" />

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

            {entrance.length > 0 && (
              <>
                <h2>Todas as Entradas</h2>
                <ContentEntrance>
                  {entrance.map(({ id, description, value_formatted, consume }) => (
                    <ListEntrance key={id}>
                      <span>{description}</span>
                      <span>{value_formatted}</span>
                      <span>{consume ? 'C/ Consuma' : 'S/ Consuma'}</span>
                      <IoMdTrash onClick={() => handleDeleteEntrance(id)} />
                    </ListEntrance>
                  ))}
                </ContentEntrance>
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

export default RegisterEntranceBusiness;
