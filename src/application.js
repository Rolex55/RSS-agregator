import * as yup from 'yup';
import i18n from 'i18next';
import ru from './locales/ru';
import view from './view';

export default () => {
  const state = {
    form: {
      state: 'filling',
      valid: true,
      data: '',
      error: '',
    },
    loadedURL: [],
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance
    .init({
      lng: 'ru',
      debug: 'true',
      resources: { ru },
    })
    .then(() => {
      document.querySelector('.display-3').textContent =
        i18nInstance.t('interface.h1');
      document.querySelector('.lead').textContent =
        i18nInstance.t('interface.p');
      document.querySelector('label').textContent =
        i18nInstance.t('interface.label');
      document.querySelector('.col-auto > button').textContent =
        i18nInstance.t('interface.button');
    });

  const watchedState = view(state);

  yup.setLocale({
    mixed: {
      notOneOf: i18nInstance.t('errors.existsURL'),
    },
    string: {
      url: i18nInstance.t('errors.invalidURL'),
    },
  });

  const schema = yup.string().required().url();

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    schema
      .notOneOf(watchedState.loadedURL)
      .validate(url)
      .then((validUrl) => watchedState.loadedURL.push(validUrl))
      .catch((err) => {
        [watchedState.form.error] = err.errors;
      });
  });
};
