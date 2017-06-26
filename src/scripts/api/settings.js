const apiSettings = (function () {
  const form = document.querySelector('.js__search-form');
  const currentCards = [];

  const list = {
    onlyWithImg: true,
    paginationCurrentPage: 1,
    paginationTotalPages: 0,
    pages: 1,
    displayCardsAmount: 8,
    totalCount: false,
  };  

  const dom = {
    form,
    searchBtn: document.querySelector('.js__search-btn'),
    cardsList: document.querySelector('.cards-list'),
    searchName: form.querySelectorAll('[name="search-card"]'),
    searchColorIdentity: form.querySelectorAll('[name="colorIdentity"]'),
    sort: document.querySelector('.js-sort'),
    cardsCountWrap: document.querySelector('.cards-count'),
    displayCardsSelect: document.querySelector('.js-change-display-cards'),
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
    getCurrentCards,
    setCurrentCards,
  };
}());

export default apiSettings;
