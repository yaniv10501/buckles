/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import * as PropTypes from 'prop-types';
import NavMenuItem from './NavMenuItem';
import useScreen from './useScreen';

export interface MenuProps {
  menuName?: string;
  menuButtons: Array<{ name: string; link: string }>;
  activeButton: string;
  setActiveButton: Function;
  menuOpen?: boolean | null;
  setMenuOpen?: Function | null;
  theme?: string;
  isNav?: boolean;
}

export default function Menu({
  menuName,
  menuButtons,
  activeButton,
  setActiveButton,
  menuOpen,
  setMenuOpen,
  theme,
  isNav,
}: MenuProps) {
  const { isMobile } = useScreen();
  const [isMenuOpen, setIsMenuOpen] =
    menuOpen !== null && setMenuOpen !== null ? [menuOpen, setMenuOpen] : useState(false);
  const handleNavClick = (event) => {
    const tabName = event.target.name;
    setActiveButton(tabName);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    if (isNav) {
      window.history.pushState({}, '', tabName);
    }
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
    <ul className={`${menuName}menu${isMenuOpen ? ' menu_open' : ''}`}>
      {menuButtons.map((button) => (
        <NavMenuItem
          key={button.name}
          menuName={menuName}
          button={button}
          handleClick={handleNavClick}
          activeButton={activeButton}
          theme={theme}
        />
      ))}
    </ul>
  );
}

Menu.propTypes = {
  menuName: PropTypes.string,
  menuButtons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeButton: PropTypes.string.isRequired,
  setActiveButton: PropTypes.func.isRequired,
  menuOpen: PropTypes.oneOf([PropTypes.bool, PropTypes.exact(null)]),
  setMenuOpen: PropTypes.oneOf([PropTypes.func, PropTypes.exact(null)]),
  theme: PropTypes.string,
  isNav: PropTypes.bool,
};

Menu.defaultProps = {
  menuName: '',
  menuOpen: null,
  setMenuOpen: null,
  theme: 'menu',
  isNav: false,
};
