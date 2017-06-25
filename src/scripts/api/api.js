import linkGenerator from './link-generator';
import dom from './dom';
import listTemplates from './list-templates';
import pagination from './pagination';

const mtgApi = (function () {
  let currentCards;

  function createList(data) {
    const cards = data.cards || [];
    if (!cards.length) {
      dom.cardsList.innerHTML = '<p>brak kart</p>';
      return false;
    }

    dom.cardsList.innerHTML = listTemplates.generateTemplate(cards);
  }

  function listPromise(url) {
    const postsPromise = fetch(url);

    const list = postsPromise
      .then(data => { 
        pagination.setHeaderSettings(data.headers);
        return data.json(); 
      })
      .then(data => {
        currentCards = data;
        return createList(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function initSearch(e) {
    e.preventDefault();
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
  }

  function initApi() {
    initRandom();
    initEvents();
  }

  return {
    initApi,
  };
}());

export default mtgApi;
