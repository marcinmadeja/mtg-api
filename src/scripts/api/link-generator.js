import apiSettings from './settings';

const linkGenerator = (function () {
  const baseLink = 'https://api.magicthegathering.io/v1/';
  const carsdUrl = `${baseLink}cards`;
  const dom = apiSettings.dom;
  const settings = apiSettings.list;

  function generateRandom() {
    return `${carsdUrl}?random=true&pageSize=${settings.displayCardsAmount}&contains=imageUrl`;
  }

  function generateSpecialLink(linkPart) {
    return `${baseLink}${linkPart}`;
  }

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

  function generateSpecialSelectUrl() {
    const urls = [];
    const selects = dom.advancedSelects;
    
    selects.forEach(select => {
      const value = select.value;
      const name = select.name;

      if (value.length) {
        urls.push(`${name}=${value}`);
      }
    });

    return urls;
  }

  function generate() {
    let url = `${carsdUrl}?`;
    let urlParts = [];

    urlParts.push(
        addName(),
        addColors(),
        addSettingsUrl());

    if (settings.advancedSearch) {
      urlParts.push(...generateSpecialSelectUrl());
    }

    urlParts = urlParts.filter(part => part.length).join('&');
    urlParts = encodeURI(urlParts);
    url += urlParts;

    console.log('url', url);

    return url;
  }

  return {
    generate,
    generateRandom,
    generateSpecialLink,
  };
}());

export default linkGenerator;
