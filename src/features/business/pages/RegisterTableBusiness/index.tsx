import { useCallback, useRef, useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { BusinessService } from '@/services';
import { Header, Button, Input } from '@/components';
import { useToast, useAuth } from '@/hooks';
import { getValidationErrors } from '@/utils';

import { MenuRegisterPTT } from '../../components';

import { Container, Content, BackPage, Main, ContentRegister, Footer } from './styles';

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
    async ({ table }: { table: string }) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          table: Yup.string().required('Quantidade de mesas é obrigatório'),
        });

        await schema.validate(
          { table },
          {
            abortEarly: false,
          },
        );

        const response = await BusinessService.updateNumberOfTable(table);

        saveAuth({
          business: response,
        });

        addToast({
          type: 'success',
          message: 'Cadastro de Mesas',
          description: Number(table) > 1 ? 'Mesas forão cadastradas com sucesso' : 'Mesa foi cadastrada com sucesso',
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
