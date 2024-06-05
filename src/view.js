import onChange from 'on-change';

export default (state) => {
  const watchedState = onChange(state, (path, current) => {
    const input = document.getElementById('url-input');
    const form = document.querySelector('form');
    const feedback = document.querySelector('.feedback');
    if (path === 'form.error') {
      feedback.textContent = current;
      input.classList.add('is-invalid');
    }
    if (path === 'loadedURL') {
      form.reset();
      input.focus();
      feedback.textContent = '';
      if (input.classList.contains('is-invalid')) {
        input.classList.remove('is-invalid');
      }
    }
  });
  return watchedState;
};
