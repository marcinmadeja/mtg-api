import apiSettings from './settings';

const pagination = (function () {
  const headerSettings = apiSettings.list;
  const cardsCountWrap = apiSettings.dom.cardsCountWrap;
  const dom = apiSettings.dom;
  const listSetings = apiSettings.list;

  function setHeaderSettings(header) {
    headerSettings.totalCount = header.get('Total-Count') ? header.get('Total-Count') : false;

    if (headerSettings.totalCount === false || headerSettings.totalCount === undefined) {
      cardsCountWrap.innerHTML = '';
      return false;
    }

    if (cardsCountWrap) {
      cardsCountWrap.innerHTML = `
        <div class="cards-count__msg">Founded ${headerSettings.totalCount} ${headerSettings.totalCount <= 1 ? 'card' : 'cards'}</div>
      `;
    }
  }

  function preparePagination() {
    
  }

  function createPagination() {

  }

  function changeDisplayCardsAmount() {
    const displayAmount = parseInt(dom.displayCardsSelect.value, 10);
    if (displayAmount) {
      listSetings.displayCardsAmount = displayAmount;
    }
  }

  return {
    setHeaderSettings,
    createPagination,
    changeDisplayCardsAmount,
  };
}());

export default pagination;
