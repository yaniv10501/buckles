/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { closeFromContainer } from './utils';
import useScreen from './useScreen';
import menuIcon from '../images/mobile-menu.svg';
import Menu from './Menu';
import Folder from './Folder';

export interface NavMenuProps {
  menuName: string;
  menuButtons: Array<{ name: string; link: string }>;
  theme?: string;
}

export default function NavMenu({ menuName, menuButtons, theme }: NavMenuProps) {
  const { isMobile } = useScreen();
  const [activeButton, setActiveButton] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleMobileMenuClick = () => {
    console.log(isMenuOpen);
    setIsMenuOpen((menuOpenState) => !menuOpenState);
  };
  const handleNavClick = (event) => {
    const tabName = event.target.name;
    setActiveButton(tabName);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    window.history.pushState({}, '', tabName);
  };
  const handleContainerClick = (event) => {
    closeFromContainer(event, setIsMenuOpen, {
      targetClass: 'menu_open',
    });
  };
  const handleContainerKeyDown = (event) => {
    closeFromContainer(event, setIsMenuOpen, {
      isKey: true,
    });
  };
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);
  useEffect(() => {
    setActiveButton(window.location.pathname.replace('/', ''));
  }, []);
  return (
    <nav className={`${menuName}menu-wrapper`}>
      {isMobile ? (
        <>
          <Folder>
            <Folder.Header
              folderButton={
                <img className={`${menuName}menu-mobile-icon`} src={menuIcon} alt="menu button" />
              }
              folderFucntion={handleMobileMenuClick}
              folderButtonClass={`${menuName}menu-mobile-button`}
            />
            <Folder.Body>
              <Menu
                menuButtons={menuButtons}
                activeButton={activeButton}
                setActiveButton={setActiveButton}
                menuOpen={isMenuOpen}
                setMenuOpen={setIsMenuOpen}
                theme={theme}
                isNav
              />
            </Folder.Body>
          </Folder>
        </>
      ) : (
        <Menu
          menuButtons={menuButtons}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          menuOpen={isMenuOpen}
          setMenuOpen={setIsMenuOpen}
          theme={theme}
          isNav
        />
      )}
    </nav>
  );
}

NavMenu.propTypes = {
  menuName: PropTypes.string,
  menuButtons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
    })
  ).isRequired,
  theme: PropTypes.string,
};

NavMenu.defaultProps = {
  menuName: '',
  theme: 'nav',
};
