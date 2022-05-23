import '../styles/index.css';
import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

export { default as Slider } from './Slider';
export type { SliderProps } from './Slider';

export { default as NavMenu } from './NavMenu';
export type { NavMenuProps } from './NavMenu';

export { default as NavMenuItem } from './NavMenuItem';
export type { NavMenuItemProps } from './NavMenuItem';

export { default as Folder } from './Folder';
export type { FolderProps } from './Folder';
