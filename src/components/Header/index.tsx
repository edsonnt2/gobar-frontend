import React from 'react';

import { FiSearch, FiPower } from 'react-icons/fi';
import imgSmallLogo from '../../assets/small-logo.svg';

import {
  Container,
  LogoAndSearch,
  SearchHeader,
  OptionsUserHeader,
  UserHader,
  InfoUser,
  ImgUser,
} from './styles';
import { useAuth } from '../../hooks/Auth';

const Header: React.FC = () => {
  const { signOut } = useAuth();
  return (
    <Container>
      <div>
        <LogoAndSearch>
          <img src={imgSmallLogo} alt="goBar" />
          <SearchHeader>
            <FiSearch />
            <input placeholder="Pesquisar no goBar" />
          </SearchHeader>
        </LogoAndSearch>

        <OptionsUserHeader>
          <UserHader>
            <ImgUser>
              <img
                src="https://avatars3.githubusercontent.com/u/59709305?s=400&u=5bcb9acd0dd31bb89a9cdd1013b0ab8dcdd20f53&v=4"
                alt="Edson Rodrigo"
              />
            </ImgUser>

            <InfoUser>
              <span>Bem-vindo</span>
              <strong>Edson Rodrigo</strong>
            </InfoUser>
          </UserHader>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </OptionsUserHeader>
      </div>
    </Container>
  );
};

export default Header;
