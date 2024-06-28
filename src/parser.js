import { uniqueId } from 'lodash';

export default (data) => {
  const parser = new DOMParser();
  const domEl = parser.parseFromString(data, 'application/xml');
  if (domEl.querySelector('parsererror')) {
    throw new Error('Ресурс не содержит валидный RSS');
  }
  const feedTitle = domEl.querySelector('title').textContent;
  const feedDescription = domEl.querySelector('description').textContent;
  const posts = domEl.querySelectorAll('item');
  const feedPosts = Array.from(posts).map((post) => {
    const postTitle = post.querySelector('title').textContent;
    const postLink = post.querySelector('link').textContent;
    return { title: postTitle, link: postLink, id: uniqueId() };
  });
  return { feedTitle, feedDescription, feedPosts };
};
