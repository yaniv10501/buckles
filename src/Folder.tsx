import * as React from 'react';
import { useRef, useState, useMemo, useContext, createContext } from 'react';
import * as PropTypes from 'prop-types';

export interface FolderProps {
  folderName?: string;
  folderButton?: React.ReactElement | null;
  folderFucntion?: Function;
  folderButtonClass?: string;
  children?: React.ReactChild[] | React.ReactChild;
}

const FolderContext: any = createContext({});

export default function Folder({ folderName, children }: FolderProps) {
  const classNameTheme = useMemo(() => `${folderName}folder`, []);
  const folderBodyRef: React.RefObject<any> = useRef();
  const [isFolded, setIsFolded] = useState(true);
  const [buttonAction, setButtonAction] = useState('Unfold');
  const toggleFolded = () => {
    if (isFolded) {
      setIsFolded(false);
      setButtonAction('Fold');
      const folderBodyElement = folderBodyRef.current
      const folderBodyScrollHeight = folderBodyElement.scrollHeight;
      if (folderBodyScrollHeight === 0) {
        const firstKid = folderBodyElement.firstElementChild
        const childScrollHeight = firstKid.scrollHeight;
        folderBodyElement.style.maxHeight = `${childScrollHeight}px`;
        folderBodyElement.style.height = `${childScrollHeight}px`;
      } else {
        folderBodyElement.style.maxHeight = `${folderBodyScrollHeight}px`;
        folderBodyElement.style.height = `${folderBodyScrollHeight}px`;
        console.log(`folder: ${folderBodyScrollHeight}`);
      }
    } else {
      setIsFolded(true);
      setButtonAction('Unfold');
      folderBodyRef.current.style.maxHeight = '0px';
    }
  };
  return (
    <FolderContext.Provider
      value={{
        classNameTheme,
        folderBodyRef,
        isFolded,
        buttonAction,
        toggleFolded,
      }}
    >
      <div className={`${classNameTheme}`}>{children}</div>
    </FolderContext.Provider>
  );
}

Folder.Header = function FolderHeader({
  folderButton,
  folderFucntion = () => {},
  folderButtonClass,
  children,
}: FolderProps) {
  const { classNameTheme, toggleFolded, buttonAction } = useContext(FolderContext);
  const handleToggleFolded = () => {
    folderFucntion();
    toggleFolded();
  };
  return (
    <div className={`${classNameTheme}__header`}>
      {children}
      <button
        className={`${folderButtonClass ? folderButtonClass : `${classNameTheme}__button`}`}
        type="button"
        onClick={handleToggleFolded}
      >
        {folderButton ? folderButton : buttonAction}
      </button>
    </div>
  );
};

Folder.Body = function FolderBody({ children }: FolderProps) {
  const { classNameTheme, isFolded, folderBodyRef } = useContext(FolderContext);
  return (
    <div
      className={
        isFolded ? `${classNameTheme}__body` : `${classNameTheme}__body folder__body_unfolded`
      }
      ref={folderBodyRef}
    >
      {children}
    </div>
  );
};

Folder.propTypes = {
  folderName: PropTypes.string,
  folderButton: PropTypes.oneOf([PropTypes.node, PropTypes.exact(null)]),
  folderFucntion: PropTypes.func,
  folderButtonClass: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Folder.defaultProps = {
  folderName: '',
  folderButton: null,
  folderFucntion: () => {},
  folderButtonClass: '',
};
