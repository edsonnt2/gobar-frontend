import { useCallback, useRef, useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Header from '@/shared/components/Header';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import api from '@/shared/services/api';
import { useToast } from '@/shared/hooks/Toast';
import getValidationErrors from '@/shared/utils/getValidationErrors';
import { useAuth } from '@/shared/hooks/Auth';
import MenuRegisterPTT from '@/modules/business/components/MenuRegisterPTT';

import { Container, Content, BackPage, Main, ContentRegister, Footer } from './styles';

interface RegisterTableBusinessData {
  table: string;
}

const RegisterTableBusiness: React.FC = () => {
  const { business, saveAuth } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const quantityTable = String(business?.table) || '0';
    formRef.current?.setFieldValue('table', quantityTable);
  }, [business]);

  const handleSubmit = useCallback(
    async (data: RegisterTableBusinessData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          table: Yup.string().required('Quantidade de mesas é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.patch('business/update-table', data);

        saveAuth({
          business: response.data,
        });

        addToast({
          type: 'success',
          message: 'Cadastro de Mesas',
          description:
            Number(data.table) > 1 ? 'Mesas forão cadastradas com sucesso' : 'Mesa foi cadastrada com sucesso',
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            message: 'Erro no cadastro',
            description: 'Ocorreu um erro ao fazer o cadastro do produto, tente novamente !',
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [addToast, saveAuth],
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
          <MenuRegisterPTT whoSelected="table" />

          <ContentRegister>
            <h1>Adicionar Mesa</h1>

            <Form onSubmit={handleSubmit} ref={formRef}>
              <Input mask="" type="number" name="table" hasTitle="Quantidade de Mesas" formatField="number" />
              <Button loading={loading} type="submit">
                SALVAR
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

export default RegisterTableBusiness;
