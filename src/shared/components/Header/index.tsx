import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { MdNotifications } from 'react-icons/md';
import { GoTriangleDown } from 'react-icons/go';
import {
  FiSearch,
  FiPower,
  FiUsers,
  FiPackage,
  FiDatabase,
} from 'react-icons/fi';

import api from '../../services/api';

import { useAuth, Business } from '../../hooks/Auth';
import { useToast } from '../../hooks/Toast';

import imgSmallLogo from '../../assets/small-logo.svg';
import noAvatar from '../../assets/no-avatar.png';
import noBusiness from '~/modules/business/assets/no-business.png';

import {
  Container,
  LogoAndSearch,
  SearchHeader,
  OptionsUserHeader,
  UserHader,
  InfoUser,
  ImgUser,
  Menu,
  ButtonMenu,
  BoxMenu,
  BoxInfoMenu,
  ImgMenu,
  InfoMenu,
  LinkOption,
  Separator,
  ButtonLogout,
} from './styles';

export interface PropsHeader {
  isBusiness?: boolean;
}

const Header: React.FC<PropsHeader> = ({ isBusiness }) => {
  const history = useHistory();
  const { signOut, saveAuth, business, user } = useAuth();
  const { addToast } = useToast();

  const [showOptions, setShowOptions] = useState(false);
  const [listBusiness, setListBusiness] = useState<Business[]>([]);

  useEffect(() => {
    // Conserta isso aqui para não ficar chamando toda hora
    api.get<Business[]>('business/user').then(response => {
      const getBusiness = business
        ? response.data.filter(({ id }) => id !== business.id)
        : response.data;

      setListBusiness(getBusiness);
    });
  }, [business]);

  const dataShow = useMemo(() => business || user, [business, user]);

  const avatar = useMemo(() => {
    if (business) return business.avatar_url || noBusiness;
    return user.avatar_url || noAvatar;
  }, [business, user]);

  const handleBackUser = useCallback(async () => {
    setShowOptions(false);
    try {
      const response = await api.get('sessions');

      saveAuth(response.data);

      addToast({
        type: 'success',
        message: `Logado como ${response.data.user.full_name}`,
      });

      history.push('/dashboard');
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Ooops... Encontrando um erro',
        description: 'Ocorreu um erro ao volta para usuário, tente novamente',
      });
    }
  }, [saveAuth, addToast, history]);

  const handleLoggedBusiness = useCallback(
    async (business_id: string) => {
      setShowOptions(false);
      try {
        const response = await api.post('business/sessions', { business_id });

        saveAuth({
          ...response.data,
          user,
        });

        addToast({
          type: 'success',
          message: `Logado como ${response.data.business.name}`,
        });

        history.push('/business');
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Ooops... Encontrando um erro',
          description: 'Ocorreu um erro ao entrar em negócio, tente novamente',
        });
      }
    },
    [saveAuth, addToast, user, history],
  );

  return (
    <Container isBusiness={isBusiness}>
      <header>
        <LogoAndSearch>
          <Link to={business ? '/business' : '/'}>
            <img src={imgSmallLogo} alt="goBar" />
          </Link>
          <SearchHeader>
            <FiSearch />
            <input placeholder="Pesquisar no goBar" />
          </SearchHeader>
        </LogoAndSearch>

        <OptionsUserHeader>
          <UserHader>
            <ImgUser>
              <img src={avatar} alt={dataShow.name} />
            </ImgUser>

            <InfoUser>
              <span>{business ? 'Neǵocio' : 'Logado'}</span>
              <strong>{dataShow.name}</strong>
            </InfoUser>
          </UserHader>

          <Menu>
            <ButtonMenu>
              <MdNotifications size={22} />
            </ButtonMenu>

            <ButtonMenu onClick={() => setShowOptions(!showOptions)}>
              <GoTriangleDown
                size={24}
                color={showOptions ? '#E5A43A' : undefined}
                style={{ marginTop: 3 }}
              />
            </ButtonMenu>
            {showOptions && (
              <BoxMenu>
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
                    <LinkOption to="/business/register-product">
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
                        <img
                          src={user.avatar_url || noAvatar}
                          alt={user.name}
                        />
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
                    <h2>
                      {listBusiness.length === 1
                        ? 'Meu Negócio'
                        : 'Meus Negócios'}
                    </h2>
                  </>
                )}
                {listBusiness.map(({ name, avatar_url, id }) => (
                  <BoxInfoMenu
                    key={id}
                    onClick={() => handleLoggedBusiness(id)}
                  >
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
              </BoxMenu>
            )}
          </Menu>
        </OptionsUserHeader>
      </header>
    </Container>
  );
};

export default Header;
