import * as React from 'react';
import { useMemo } from 'react';
import * as PropTypes from 'prop-types';

export interface NavMenuItemProps {
  key: string | number;
  menuName: string;
  button: { name: string; link: string };
  handleClick: any;
  activeButton: string;
  theme: string;
}

export default function NavMenuItem({
  menuName,
  button,
  handleClick,
  activeButton,
  theme,
}: NavMenuItemProps) {
  const themeClass = useMemo(() => {}, []);
  return (
    <li className={`${menuName}menu-item`}>
      <button
        className={`${menuName}menu-button ${button.link === activeButton ? 'active' : ''}`}
        onClick={handleClick}
        name={button.link}
        type="button"
      >
        {button.name}
      </button>
    </li>
  );
}

NavMenuItem.propTypes = {
  menuName: PropTypes.string.isRequired,
  button: PropTypes.instanceOf(Object).isRequired,
  handleClick: PropTypes.func.isRequired,
  activeButton: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
};
