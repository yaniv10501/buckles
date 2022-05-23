import * as React from 'react';
import { useEffect, useRef, useState, useMemo } from 'react';
import * as PropTypes from 'prop-types';
import waitForScrollEnd from './waitForScrollEnd';
import waitForResizeEnd from './waitForResizeEnd';

export interface SliderProps {
  isLoading: boolean | null;
  children: React.ReactChild[] | React.ReactChild;
}

const sliderInterval = (
  setCurrentSliderItem: Function,
  sliderRef: React.RefObject<any>,
  children: React.ReactChild[] | React.ReactChild
) =>
  setInterval(() => {
    setCurrentSliderItem((currentSliderItemState: number) => {
      const { scrollLeft: currentScrollLeft } = sliderRef.current;
      const currentSliderWidth = sliderRef.current.clientWidth;
      if (!Array.isArray(children) || currentSliderItemState < children.length - 1) {
        sliderRef.current.scroll({
          top: 0,
          left: currentScrollLeft + currentSliderWidth,
          behavior: 'smooth',
        });
        return currentSliderItemState + 1;
      }
      sliderRef.current.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      return 0;
    });
  }, 5000);

export default function Slider({ isLoading, children }: SliderProps) {
  const sliderRef: React.RefObject<any> = useRef();
  const [scrollStart, setScrollStart] = useState(false);
  const [resizeStart, setResizeStart] = useState(false);
  const [autoTimeout, setAutoTimeout] = useState(null);
  const [currentSliderItem, setCurrentSliderItem] = useState(0);

  const isButtonActive = (index: number) =>
    useMemo(() => index === currentSliderItem, [currentSliderItem]);

  const handleSliderButton = (event: React.MouseEvent) => {
    const { name, id } = event.target as HTMLTextAreaElement;
    const selectedIndex = Number(name || id);
    if (autoTimeout) {
      clearInterval(autoTimeout);
    }
    if (sliderRef) {
      const { scrollLeft } = sliderRef.current;
      const sliderWidth = sliderRef.current.clientWidth;
      const targetLeft = sliderWidth * selectedIndex;
      if (scrollLeft > targetLeft || scrollLeft < targetLeft) {
        sliderRef.current.scroll({
          left: targetLeft,
          behavior: 'smooth',
        });
      }
      setCurrentSliderItem(selectedIndex);
      setAutoTimeout(sliderInterval(setCurrentSliderItem, sliderRef, children));
    }
  };

  const handleItemScroll = () => {
    if (autoTimeout) {
      clearInterval(autoTimeout);
      setAutoTimeout(null);
    }
  };

  const handleSliderScroll = () => {
    if (autoTimeout) {
      clearInterval(autoTimeout);
    }
    if (!scrollStart) {
      setScrollStart(true);
    }
  };

  useEffect(() => {
    if (scrollStart) {
      waitForScrollEnd(sliderRef.current).then(() => {
        let currentIndex: number;
        const isChildrenArray = Array.isArray(children);
        const { scrollLeft } = sliderRef.current;
        const sliderWidth = sliderRef.current.clientWidth;
        const isPerfect = isChildrenArray
          ? children.some((kid, index) => {
              const result = scrollLeft === sliderWidth * index;
              if (result) {
                currentIndex = index;
              }
              return result;
            })
          : scrollLeft === 0;
        if (!isPerfect) {
          const halfSlider = sliderWidth / 2;
          if (isChildrenArray) {
            children.some((kid, index) => {
              const kidLeft = sliderWidth * index;
              if (scrollLeft < kidLeft + halfSlider) {
                currentIndex = index;
                sliderRef.current.scroll({
                  top: 0,
                  left: kidLeft,
                  behavior: 'smooth',
                });
                return true;
              }
              return false;
            });
          } else {
            sliderRef.current.scroll({
              top: 0,
              left: 0,
              behavior: 'smooth',
            });
          }
        }
        setCurrentSliderItem(currentIndex);
        setScrollStart(false);
        if (autoTimeout) {
          clearInterval(autoTimeout);
          setAutoTimeout(null);
        }
      });
    }
  }, [scrollStart]);

  useEffect(() => {
    if (!autoTimeout && !isLoading) {
      setAutoTimeout(sliderInterval(setCurrentSliderItem, sliderRef, children));
    }
  }, [autoTimeout, isLoading]);

  useEffect(() => {
    if (resizeStart) {
      waitForResizeEnd().then(() => {
        setResizeStart(false);
        if (autoTimeout) {
          clearInterval(autoTimeout);
          setAutoTimeout(null);
        }
        if (sliderRef) {
          const sliderWidth = sliderRef.current.clientWidth;
          sliderRef.current.scroll({
            top: 0,
            left: sliderWidth * currentSliderItem,
            behavior: 'smooth',
          });
        }
      });
    }
  }, [resizeStart]);

  useEffect(() => {
    if (!isLoading) {
      if (sliderRef) {
        sliderRef.current.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    }
  }, [isLoading]);

  useEffect(() => {
    const handleWindowResize = () => {
      if (autoTimeout) {
        clearInterval(autoTimeout);
      }
      if (!resizeStart) {
        setResizeStart(true);
      }
    };
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  return (
    <div className="slider">
      <ul
        className="slider__main no-scroll-bar"
        ref={sliderRef}
        onScrollCapture={handleSliderScroll}
      >
        {Array.isArray(children) &&
          children.length > 0 &&
          children.map((childElement: React.ReactChildren | React.ReactChild, index: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index} className="slider__item" onScroll={handleItemScroll}>
              {childElement}
            </li>
          ))}
        {children && !Array.isArray(children) && (
          <li className="slider__item" onScroll={handleItemScroll}>
            {children}
          </li>
        )}
      </ul>
      <ul className="slider__buttons">
        {Array.isArray(children) &&
          children.length > 0 &&
          children.map((childElement: React.ReactChildren | React.ReactChild, index: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index} className="slider__button">
              <button
                className="slider__button-outer"
                name={`${index}`}
                type="button"
                onClick={handleSliderButton}
              >
                {isButtonActive(index) ? (
                  <div className="slider__button-inner active" id={`${index}`} />
                ) : (
                  ''
                )}
              </button>
            </li>
          ))}
        {children && !Array.isArray(children) && (
          <li className="slider__button">
            <button
              className="slider__button-outer"
              name="0"
              type="button"
              onClick={handleSliderButton}
            >
              <div className={`slider__button-inner${isButtonActive(0) ? ' active' : ''}`} id="0" />
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

Slider.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};
