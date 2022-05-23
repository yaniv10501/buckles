const closeFromContainer = (
  event: any,
  setTargetOpen: Function,
  options?: { isKey?: boolean; targetClass?: string | RegExp }
) => {
  if (options.isKey) {
    if (event.key.toLowerCase() === 'escape') {
      setTargetOpen(false);
    }
  } else {
    if (event.target.className.includes(options.targetClass)) {
      setTargetOpen(false);
    }
  }
};

export { closeFromContainer };
