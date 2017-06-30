import apiSettings from './settings';
import linkGenerator from './link-generator';
import listTemplates from './list-templates';
import pagination from './pagination';
import sort from './sort';
import modal from './../../assets/modal/modal';
import cardDetails from './card-details';

const mtgApi = (function () {
  const { dom, list: listSettings } = apiSettings;

  function createList() {
    const cardList = dom.cardsList;
    const sortSelect = dom.sort;
    const sortedCards = sort.sortElement(sortSelect);

    cardList.innerHTML = listTemplates.generateTemplate(sortedCards);
    cardDetails.addEventToCards();
  }

  function listPromise(url) {
    const postsPromise = fetch(url);

    postsPromise
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

  function showAdvancedMenu() {
    if (dom.searchAdvanced.classList.contains('search__advanced--is-active')) {
      dom.searchAdvanced.classList.remove('search__advanced--is-active');
      listSettings.advancedSearch = false;
    } else {
      dom.searchAdvanced.classList.add('search__advanced--is-active');
      listSettings.advancedSearch = true;
    }
  }

  function changeDisplayCards() {
    pagination.changeDisplayCardsAmount();
    initSearch();
  }

  function initSearch(e) {
    if (e) e.preventDefault();
    console.log('aaaaaaaaaa');

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

    dom.form.addEventListener('submit', () => {
      console.log('xxxxxxxxx');
    });

    dom.displayCardsSelect.addEventListener('change', changeDisplayCards);
    dom.expandBtn.addEventListener('click', showAdvancedMenu);
  }

  function initAdvancedFormSelects() {
    dom.advancedSelects.forEach(select => {
      const linkPart = select.dataset.link;
      const postsPromise = fetch(linkGenerator.generateSpecialLink(linkPart));

      postsPromise
        .then(data => data.json())
        .then(data => {
          if (data[linkPart]) {
            data[linkPart].forEach(item => {
              item = linkPart === 'sets' ? item.name : item;
              const option = document.createElement('option');
              const textNode = document.createTextNode(item);

              option.appendChild(textNode);
              option.value = item;
              select.appendChild(option);
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }

  function initApi() {
    initRandom();
    initEvents();
    initAdvancedFormSelects();
  }

  return {
    initApi,
    createList,
    generateList,
  };
}());

export default mtgApi;
