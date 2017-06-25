import dom from './dom';

const linkGenerator = (function () {
  const apiUrl = 'https://api.magicthegathering.io/v1/cards';
  const settings = {
    onlyWithImg: true,
    pages: 1,
    pageSize: 32,
    randomPageSize: 8,
  };

  function addSettingsUrl() {
    let settingsParts = [];

    if (settings.pages && settings.pageSize) {
      settingsParts.push(`page=${settings.pages}&pageSize=${settings.pageSize}`);
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
    return `${apiUrl}?random=true&pageSize=${settings.randomPageSize}&contains=imageUrl`;
  }

  return {
    generate,
    generateRandom,
  };
}());

export default linkGenerator;
