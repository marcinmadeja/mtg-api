import apiSettings from './settings';

const searchState = (function () {
  const { dom, state } = apiSettings;
  const searchBtn = dom.searchBtn;
  const elementsToDisable = [dom.searchBtn, dom.cardList];

  const loaderDom = `
    <div class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
    </div>
  `;

  function addLoader(button) {
    button.dataset.text = button.textContent;
    button.innerHTML = loaderDom;
  }

  function removeLoader(button) {
    button.innerHTML = button.dataset.text;
    button.dataset.text = '';
  }

  function disableElements() {
    elementsToDisable.forEach(element => {
      if (element) {
        element.classList.add(state.disableElementClass); 
      }
    });
  }

  function enableElements() {
    elementsToDisable.forEach(element => {
      if (element) {
        element.classList.remove(state.disableElementClass);
      }
    });
  }

  function searchingInProgress() {
    state.isSearchInProgress = true;
    addLoader(searchBtn);
    disableElements();
  }

  function searchingEnded() {
    state.isSearchInProgress = false;
    removeLoader(searchBtn);
    enableElements();
  }

  return {
    searchingInProgress,
    searchingEnded,
  };
}());

export default searchState;
