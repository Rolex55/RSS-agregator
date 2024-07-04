import onChange from 'on-change';

const setAttributes = (element, options) => {
  Object.entries(options).forEach(([attr, value]) => {
    element.setAttribute(attr, value);
  });
};

const renderFeeds = (feeds) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  const feedsElements = feeds.map((feed) => {
    const { title, description } = feed;
    const li = document.createElement('li');
    li.classList.add('list-group', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    h3.textContent = title;
    p.textContent = description;
    li.append(h3, p);
    return li;
  });
  ul.append(...feedsElements);
  return ul;
};

const renderPosts = (posts, readPostsId) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  const postsElements = posts.map((post) => {
    const { title, link, id } = post;
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between');
    li.classList.add('align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    a.classList.add(readPostsId.includes(id) ? 'fw-normal' : 'fw-bold');
    setAttributes(a, {
      href: link, 'data-id': id, target: '_blank', rel: 'noopener noreferrer',
    });
    a.textContent = title;
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    setAttributes(button, {
      type: 'button', 'data-id': id, 'data-bs-toggle': 'modal', 'data-bs-target': '#modal',
    });
    button.textContent = 'Просмотр';
    li.append(a);
    li.append(button);
    return li;
  });
  ul.append(...postsElements);
  return ul;
};

const renderCard = (title, content) => {
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const h2 = document.createElement('h2');
  card.classList.add('card', 'border-0');
  cardBody.classList.add('card-body');
  h2.classList.add('card-title', 'h4');
  h2.textContent = title;
  cardBody.append(h2);
  card.append(cardBody, content);
  return card;
};

const renderModal = (post, modalContainer) => {
  const titleContainer = modalContainer.querySelector('.modal-title');
  const body = modalContainer.querySelector('.modal-body');
  const a = modalContainer.querySelector('a');
  const {
    title, link, description, id,
  } = post;
  const postEl = document.querySelector(`[data-id='${id}']`);
  titleContainer.textContent = title;
  body.textContent = description;
  a.setAttribute('href', link);
  postEl.classList.remove('fw-bold');
  postEl.classList.add('fw-normal');
};

export default (i18nInstance, state) => {
  const watchedState = onChange(state, (path, current) => {
    const input = document.getElementById('url-input');
    const form = document.querySelector('form');
    const feedback = document.querySelector('.feedback');
    const feedsContainer = document.querySelector('.feeds');
    const postsContainer = document.querySelector('.posts');
    const modalContainer = document.querySelector('.modal-content');
    switch (path) {
      case 'form.errors':
        feedback.textContent = current;
        feedback.classList.add('text-danger');
        input.classList.add('is-invalid');
        break;
      case 'loadedURL':
        form.reset();
        input.focus();
        feedback.textContent = i18nInstance.t('messages.successURL');
        if (feedback.classList.contains('text-danger')) {
          feedback.classList.remove('text-danger');
          input.classList.remove('is-invalid');
        }
        break;
      case 'feeds':
        feedsContainer.textContent = '';
        feedsContainer.append(renderCard(i18nInstance.t('interface.feeds'), renderFeeds(current)));
        break;
      case 'posts':
        postsContainer.textContent = '';
        postsContainer.append(renderCard(i18nInstance.t('interface.posts'), renderPosts(current, state.readPostsId)));
        break;
      case 'currentPost':
        renderModal(current, modalContainer);
        break;
      default:
        throw Error('unexpected Error');
    }
  });
  return watchedState;
};
