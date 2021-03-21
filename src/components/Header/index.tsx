import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { MdNotifications } from 'react-icons/md';
import { GoTriangleDown } from 'react-icons/go';

import { noBusiness, smallLogo, noAvatar } from '@/assets';

import { useAuth } from '@/hooks';

import Menu from './Menu';

import {
  Container,
  LogoAndSearch,
  SearchHeader,
  OptionsUserHeader,
  UserHader,
  InfoUser,
  ImgUser,
  OptionsHeader,
  ButtonMenu,
} from './styles';

export interface PropsHeader {
  isBusiness?: boolean;
}

const Header: React.FC<PropsHeader> = ({ isBusiness }) => {
  const { business, user } = useAuth();
  const [showOptions, setShowOptions] = useState(false);

  const dataShow = useMemo(() => business || user, [business, user]);

  const avatar = useMemo(() => {
    if (business) return business.avatar_url || noBusiness;
    return user.avatar_url || noAvatar;
  }, [business, user]);

  return (
    <Container isBusiness={isBusiness}>
      <div>
        <LogoAndSearch>
          <Link to={business ? '/business' : '/'}>
            <img src={smallLogo} alt="goBar" />
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

          <OptionsHeader>
            <ButtonMenu type="button">
              <MdNotifications size={22} />
            </ButtonMenu>

            <ButtonMenu type="button" onClick={() => setShowOptions(!showOptions)}>
              <GoTriangleDown size={24} color={showOptions ? '#E5A43A' : undefined} style={{ marginTop: 3 }} />
            </ButtonMenu>

            {showOptions && <Menu dataShow={dataShow} avatar={avatar} setShowOptions={() => setShowOptions(false)} />}
          </OptionsHeader>
        </OptionsUserHeader>
      </div>
    </Container>
  );
};

export { Header };
