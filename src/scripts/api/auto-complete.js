import apiSettings from './settings';
import linkGenerator from './link-generator';

const autoComplete = (function () {
  const { dom, autoCompleteSetts: settings } = apiSettings;

  function prepareElements(element) {
    const parent = element.parentNode;
    const autoCompleteWrapper = document.createElement('div');
    parent.classList.add('autocomplete__content');
    autoCompleteWrapper.classList.add('autocomplete');
    autoCompleteWrapper.innerHTML = `<ul class="${settings.listClass}"></ul>`;
    parent.appendChild(autoCompleteWrapper);
    element.setAttribute('autocomplete', 'off');
  }

  function hideSuggestions(input) {
    const activeInputParent = this.parentNode;
    const listElement = activeInputParent.querySelector(`.${settings.listClass}`);
    listElement.innerHTML = '';
  }

  function searchSuggestions() {
    const value = this.value;
    if (value.length < 3) return false;
    sendPromis(linkGenerator.generateAutocompleteUrl());
  }

  function sendPromis(url) {
    const postsPromise = fetch(url);
    postsPromise
      .then(data => data.json())
      .then(data => {
        displaySuggestions(data.cards);
      })
      .catch((err) => {
        console.error(err);
      });
  }  

  function displaySuggestions(cards) {
    const activeInputParent = document.activeElement.parentNode;
    const listElement = activeInputParent.querySelector(`.${settings.listClass}`);
    if (!cards.length || !listElement) {
      listElement.innerHTML = '';
      return false;
    }

    listElement.innerHTML = cards.map(card => `<li class="${settings.listItemClass}">${card.name}</li>`).join('');
  }

  function initAutocomplete() {
    dom.autoCompleteInputs.forEach(input => {
      prepareElements(input);
      input.addEventListener('focus', searchSuggestions);
      input.addEventListener('blur', hideSuggestions);
      input.addEventListener('keyup', searchSuggestions);
    });
  }

  initAutocomplete();

  return {
    initAutocomplete,
  };
}());

export default autoComplete;
