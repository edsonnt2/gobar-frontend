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

import { Container, Content, BackPage, Main, Footer } from './styles';

interface CategoryProvider {
  name: string;
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

  return (
    <Container>
      <Header isBusiness />

      <Content>
        <BackPage onClick={() => history.push('/business')}>
          <FiArrowLeft size={20} />
          Ir para Início
        </BackPage>

        <Main>Adicionar aqui o estoque de produtos</Main>
      </Content>
      <Footer>
        <div>goBar © 2020 - Todos os direitos reservados</div>
      </Footer>
    </Container>
  );
};

export default RegisterProductBusiness;
