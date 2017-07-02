import apiSettings from './settings';
import linkGenerator from './link-generator';
import listTemplates from './list-templates';
import pagination from './pagination';
import sort from './sort';
import modal from './../../assets/modal/modal';
import cardDetails from './card-details';
import searchState from './search-state';

const mtgApi = (function () {
  const { dom, list: listSettings, state } = apiSettings;


  function createList() {
    const cardList = dom.cardsList;
    const sortSelect = dom.sort;
    const sortedCards = sort.sortElement(sortSelect);

    cardList.innerHTML = listTemplates.generateTemplate(sortedCards);
    cardDetails.addEventToCards();
  }

  function listPromise(url) {
    if (state.isSearchInProgress) return;
    
    const postsPromise = fetch(url);
    searchState.searchingInProgress();

    postsPromise
      .then(data => { 
        pagination.setHeaderSettings(data.headers);
        pagination.createPagination();
        return data.json(); 
      })
      .then(data => {
        apiSettings.setCurrentCards(data.cards);
        searchState.searchingEnded();
        return createList();
      })
      .catch((err) => {
        console.error(err);
        searchState.searchingEnded();
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
