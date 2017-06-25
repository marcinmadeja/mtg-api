const form = document.querySelector('.js__search-form');

const dom = {
  form,
  searchBtn: document.querySelector('.js__search-btn'),
  cardsList: document.querySelector('.cards-list'),
  searchName: form.querySelectorAll('[name="search-card"]'),
  searchColorIdentity: form.querySelectorAll('[name="colorIdentity"]'),
};

export default dom;
