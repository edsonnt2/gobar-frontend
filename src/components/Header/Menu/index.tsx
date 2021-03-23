import { useCallback, useEffect, useState } from 'react';
import { FiPower, FiUsers, FiPackage, FiDatabase } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import { AuthService } from '@/services';
import { useAuth, Business, User, useToast } from '@/hooks';

import { noAvatar, noBusiness } from '@/assets';

import { Container, BoxInfoMenu, ImgMenu, InfoMenu, LinkOption, Separator, ButtonLogout } from './styles';

export interface MenuProps {
  avatar: string;
  dataShow: Business | User;
  setShowOptions(): void;
}

const Menu: React.FC<MenuProps> = ({ avatar, dataShow, setShowOptions }) => {
  const history = useHistory();
  const { signOut, saveAuth, business, user } = useAuth();
  const { addToast } = useToast();
  const [listBusiness, setListBusiness] = useState<Business[]>([]);

  useEffect(() => {
    AuthService.fecthBussinessSession()
      .then(businessSession => {
        if (!businessSession) return;

        setListBusiness(businessSession.filter(({ id }) => id !== business?.id));
      })
      .catch(() => {
        addToast({
          type: 'error',
          message: 'Ooops... Encontrando um erro',
          description: 'Ocorreu um erro ao entrar em negócio, tente novamente',
        });
      });
  }, [addToast, business]);

  const handleBackUser = useCallback(async () => {
    setShowOptions();
    try {
      const response = await AuthService.fecthSession();

      if (!response) return;

      saveAuth(response);

      addToast({
        type: 'success',
        message: `Logado como ${response.user.full_name}`,
      });

      history.push('/dashboard');
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Ooops... Encontrando um erro',
        description: 'Ocorreu um erro ao volta para usuário, tente novamente',
      });
    }
  }, [saveAuth, addToast, history, setShowOptions]);

  const handleLoggedBusiness = useCallback(
    async (business_id: string) => {
      setShowOptions();
      try {
        const response = await AuthService.authenticateBusiness(business_id);

        if (!response) throw new Error();

        saveAuth({
          ...response,
          user,
        });

        addToast({
          type: 'success',
          message: `Logado como ${response?.business?.name}`,
        });

        history.push('/business');
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Ooops... Encontrando um erro',
          description: error?.response?.data?.message || 'Ocorreu um erro ao entrar em negócio, tente novamente',
        });
      }
    },
    [saveAuth, addToast, user, history, setShowOptions],
  );

  return (
    <Container>
      <h2>Logado como</h2>
      <BoxInfoMenu>
        <ImgMenu>
          <img src={avatar} alt={dataShow.name} />
        </ImgMenu>

        <InfoMenu>
          <strong>{dataShow.name}</strong>
          <span>
            Editar
            {business ? ' Négicio' : ' Perfil'}
          </span>
        </InfoMenu>
      </BoxInfoMenu>
      {business && (
        <>
          <LinkOption to="/business/register/product">
            <FiPackage size={22} />
            Cadastros
          </LinkOption>

          <LinkOption to="/business">
            <FiDatabase size={22} />
            Estoque
          </LinkOption>

          <LinkOption to="/business">
            <FiUsers size={22} />
            Clientes
          </LinkOption>

          <Separator />

          <BoxInfoMenu onClick={handleBackUser}>
            <ImgMenu>
              <img src={user.avatar_url || noAvatar} alt={user.name} />
            </ImgMenu>

            <InfoMenu isTop>
              <span>Voltar para</span>
              <strong>{user.name}</strong>
            </InfoMenu>
          </BoxInfoMenu>
        </>
      )}

      {listBusiness.length > 0 && (
        <>
          <Separator />
          <h2>{listBusiness.length === 1 ? 'Meu Negócio' : 'Meus Negócios'}</h2>
        </>
      )}
      {listBusiness.map(({ name, avatar_url, id }) => (
        <BoxInfoMenu key={id} onClick={() => handleLoggedBusiness(id)}>
          <ImgMenu>
            <img src={avatar_url || noBusiness} alt={name} />
          </ImgMenu>

          <InfoMenu>
            <strong>{name}</strong>
          </InfoMenu>
        </BoxInfoMenu>
      ))}

      <Separator />

      <ButtonLogout type="button" onClick={signOut}>
        <FiPower size={22} />
        Sair
      </ButtonLogout>
    </Container>
  );
};

export default Menu;
