const waitForResizeEnd = () => {
  let lastChangedFrame = 0;
  let lastWidth = window.innerWidth;

  return new Promise<void>((resolve) => {
    function tick(frames: number) {
      if (frames >= 500 || frames - lastChangedFrame > 20) {
        resolve();
      } else {
        if (window.innerWidth !== lastWidth) {
          lastChangedFrame = frames;
          lastWidth = window.innerWidth;
        }
        requestAnimationFrame(tick.bind(null, frames + 1));
      }
    }
    tick(0);
  });
};

export default waitForResizeEnd;