import apiSettings from './settings';

const linkGenerator = (function () {
  const apiUrl = 'https://api.magicthegathering.io/v1/cards';
  const dom = apiSettings.dom;
  const settings = apiSettings.list;

  function addSettingsUrl() {
    let settingsParts = [];

    if (settings.pages && settings.displayCardsAmount) {
      settingsParts.push(`page=${settings.paginationCurrentPage}&pageSize=${settings.displayCardsAmount}`);
    }

    if (settings.onlyWithImg) {
      settingsParts.push('contains=imageUrl');
    }

    return settingsParts.join('&');
  }

  function addName() {
    const name = dom.form.querySelector('[name="name"]').value;
    const checked = Array.from(dom.searchName).find(checkbox => checkbox.checked);
    
    if (!name.length) return '';

    return `${checked.value}=${name}`;
  }

  function addColors() {
    const colors = Array.from(dom.searchColorIdentity)
      .filter(color => color.checked)
      .map(color => color.value);
      
    if (!colors.length) return '';

    return `colorIdentity=${colors.join(',')}`;
  }

  function generate() {
    let url = `${apiUrl}?`;
    let urlParts = [];

    urlParts.push(
        addName(),
        addColors(),
        addSettingsUrl());

    url += urlParts.filter(part => part.length).join('&');

    console.log(url);

    return url;
  }

  function generateRandom() {
    return `${apiUrl}?random=true&pageSize=${settings.displayCardsAmount}&contains=imageUrl`;
  }

  return {
    generate,
    generateRandom,
  };
}());

export default linkGenerator;
