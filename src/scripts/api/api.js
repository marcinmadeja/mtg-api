import apiSettings from './settings';
import linkGenerator from './link-generator';
import listTemplates from './list-templates';
import pagination from './pagination';
import sort from './sort';

const mtgApi = (function () {
  const dom = apiSettings.dom;

  function createList(data) {
    const cards = data || [];
    const cardList = dom.cardsList;

    if (!cards.length) {
      cardList.innerHTML = '<p>brak kart</p>';
      return false;
    }

    cardList.innerHTML = listTemplates.generateTemplate(cards);
  }

  function listPromise(url) {
    const postsPromise = fetch(url);
    const sortSelect = dom.sort;

    const list = postsPromise
      .then(data => { 
        pagination.setHeaderSettings(data.headers);
        pagination.createPagination();
        return data.json(); 
      })
      .then(data => {
        apiSettings.setCurrentCards(data.cards);
        const sortedCards = sort.sortElement(sortSelect);
        return createList(sortedCards);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function changeDisplayCards() {
    pagination.changeDisplayCardsAmount();
    initSearch();
  }

  function initSearch(e) {
    if (e) e.preventDefault();

    const url = linkGenerator.generate();
    listPromise(url);
  }

  function generateList() {
    const url = linkGenerator.generate();
    listPromise(url);
  }

  function initRandom() {
    const url = linkGenerator.generateRandom();
    listPromise(url);
  }

  function initEvents() {
    dom.searchBtn.addEventListener('click', initSearch);
    dom.form.addEventListener('submit', initSearch);
    dom.sort.addEventListener('change', function () {
      const sortedCards = sort.sortElement(this);
      createList(sortedCards);
    });

    dom.displayCardsSelect.addEventListener('change', changeDisplayCards);
  }

  function initApi() {
    initRandom();
    initEvents();
  }

  return {
    initApi,
    createList,
    generateList,
  };
}());

export default mtgApi;
