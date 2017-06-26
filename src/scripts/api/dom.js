const form = document.querySelector('.js__search-form');

const dom = {
  form,
  searchBtn: document.querySelector('.js__search-btn'),
  cardsList: document.querySelector('.cards-list'),
  searchName: form.querySelectorAll('[name="search-card"]'),
  searchColorIdentity: form.querySelectorAll('[name="colorIdentity"]'),
  sort: document.querySelector('.js-sort'),
};

export default dom;
