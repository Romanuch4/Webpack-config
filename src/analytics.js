const createAnalytics = () => {
  let counter = 0;
  let isDestroyed = false;

  const listener = () => counter++;

  document.addEventListener('click', listener);

  return {
    destroy() {
      document.removeEventListener('click', listener);
      isDestroyed = true;
    },

    getCount() {
      isDestroyed ? 'Thats all': 
      console.log(counter);
    },
  };
};

window.analytics = createAnalytics();