import apiSettings from './settings';
import linkGenerator from './link-generator';
import listTemplates from './list-templates';
import pagination from './pagination';
import sort from './sort';

const mtgApi = (function () {
  const dom = apiSettings.dom;

  function createList() {
    const cards = apiSettings.getCurrentCards();
    const cardList = dom.cardsList;
    const sortSelect = dom.sort;
    const sortedCards = sort.sortElement(sortSelect);

    cardList.innerHTML = listTemplates.generateTemplate(sortedCards);
  }

  function listPromise(url) {
    const postsPromise = fetch(url);

    const list = postsPromise
      .then(data => { 
        pagination.setHeaderSettings(data.headers);
        pagination.createPagination();
        return data.json(); 
      })
      .then(data => {
        apiSettings.setCurrentCards(data.cards);
        return createList();
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
      createList(apiSettings.getCurrentCards());
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
