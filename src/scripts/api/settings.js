const apiSettings = (function () {
  const form = document.querySelector('.js__search-form');
  const currentCards = [];

  const cardDetails = {
    modalId: 'modal-card-details',
    cardClass: 'cards-list__item',
  };

  const list = {
    onlyWithImg: true,
    paginationCurrentPage: 1,
    paginationTotalPages: 0,
    pages: 1,
    displayCardsAmount: 8,
    totalCount: 0,
    displayList: 'grid',
    showDefaultImg: true,
    advancedSearch: false,
  };  

  const dom = {
    form,
    searchBtn: document.querySelector('.js__search-btn'),
    cardsList: document.querySelector('.cards-list'),
    searchName: form.querySelectorAll('[name="search-card"]'),
    searchColorIdentity: form.querySelectorAll('[name="colorIdentity"]'),
    sort: document.querySelector('.js-sort'),
    cardsCountWrap: document.querySelector('.cards-count'),
    cardListSection: document.querySelector('.cards-list__section'),
    displayCardsSelect: document.querySelector('.js-change-display-cards'),
    changeGridBtn: document.querySelectorAll('.list-grid__btn'),
    expandBtn: document.querySelector('.btn-expand'),
    searchAdvanced: document.querySelector('.search__advanced'),
    selectFormats: document.querySelector('.js-select-formats'),
    advancedSelects: document.querySelectorAll('.js-advanced-selects'),
    itemCompare: document.querySelectorAll('[data-item-compare]'),
  };

  function getCurrentCards() {
    return currentCards;
  }

  function setCurrentCards(cards) {
    cards = Array.from(cards);
    currentCards.length = 0;
    currentCards.push(...cards);
  }
 
  return {
    list,
    dom,
    cardDetails,
    getCurrentCards,
    setCurrentCards,
  };
}());

export default apiSettings;
