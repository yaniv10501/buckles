const waitForScrollEnd = (element: HTMLElement) => {
  let lastChangedFrame = 0;
  let lastX = element.scrollLeft;

  return new Promise<void>((resolve) => {
    function tick(frames: number) {
      if (frames >= 500 || frames - lastChangedFrame > 20) {
        resolve();
      } else {
        if (element.scrollLeft !== lastX) {
          lastChangedFrame = frames;
          lastX = element.scrollLeft;
        }
        requestAnimationFrame(tick.bind(null, frames + 1));
      }
    }
    tick(0);
  });
};

export default waitForScrollEnd;
