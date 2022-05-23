import { useState, useEffect, useMemo } from 'react';

const useScreen = (): {
  isMobile: boolean;
  isTablet: boolean;
  isComputer: boolean;
  isLargeScreen: boolean;
  isWideScreen: boolean;
  isMobileLandView: boolean;
  windowWidth: number;
  windowHeight: number;
} => {
  const [windowWidth, setWindowWidth] = useState(null);
  const [windowHeight, setWindowHeight] = useState(null);
  const isMobile = useMemo(() => windowWidth <= 768, [windowWidth]);
  const isTablet = useMemo(() => windowWidth <= 992, [windowWidth]);
  const isComputer = useMemo(() => windowWidth > 992, [windowWidth]);
  const isLargeScreen = useMemo(() => (isComputer ? windowWidth <= 1920 : false), [windowWidth]);
  const isWideScreen = useMemo(() => windowWidth > 1920, [windowWidth]);
  const isPortrait = useMemo(() => windowHeight > windowWidth, [windowHeight, windowWidth]);
  const isMobileLandView = useMemo(
    () => (isComputer ? false : !isPortrait),
    [isComputer, isPortrait]
  );

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  return {
    isMobile,
    isTablet,
    isComputer,
    isLargeScreen,
    isWideScreen,
    isMobileLandView,
    windowWidth,
    windowHeight,
  };
};

export default useScreen;
