import apiSettings from './settings';
import api from './api';

const listTemplates = (function () {
  const listSetings = apiSettings.list;
  const dom = apiSettings.dom;

  const msgEmptyList = 'No cards';
  const noImgDiv = `
    <div class="cards-list__no-img-wrap">
      <img class="cards-list__no-img" src="img/logo-magic.png" alt='No img'>
      <span class="cards-list__no-img-label">No image</span>
    </div>
  `;

  function getGridTemplate(cards) {
    return cards.map(card => {
      let imgUrl = card.imageUrl || noImgDiv;
      imgUrl = listSetings.showDefaultImg ? 'img/default-card.jpg' : imgUrl;

      return `
        <div class="cards-list__item cards-list__item--grid" data-md-modal="${apiSettings.cardDetails.modalId}" data-card-id="${card.id}">
          <div class="cards-list__img-wrap">
            ${card.imageUrl ? `<img src="${imgUrl}" alt="${card.name}" class="cards-list__img"/>` : noImgDiv}
          </div>

          <header class="cards-list__header">
            <h4 class="cards-list__name">${card.name}</h4>
            <span class="cards-list__mana">${replaceTextShorts(card.manaCost, 'cards-list__attribute-mana')}</span>
            <span class="cards-list__mana-total">${card.cmc ? `(${card.cmc})` : ''}</span>

            <div class="cards-list__type">${card.type}</div>
            <div class="cards-list__set-rarity">${card.setName} - ${card.rarity}</div>
          </header>

          <div class="cards-list__text">${replaceTextShorts(card.text)}</div>
        </div>`;
    }).join('');    
  }  


  function getListTemplate(cards) {
    return cards.map(card => {
      let imgUrl = card.imageUrl || noImgDiv;
      const textParts = ['artist', 'text', 'flavor', 'power', 'toughness'];
      imgUrl = listSetings.showDefaultImg ? 'img/default-card.jpg' : imgUrl;
      
      const text = textParts.map(part => {
        if (!card[part]) return '';

        return `
            <div class="cards-list__text">
              <span class="cards-list__text-label">${part}: </span>
              ${replaceTextShorts(card[part])}
            </div>
         `;
      }).join('');


      return `
        <div class="cards-list__item cards-list__item--list" data-md-modal="${apiSettings.cardDetails.modalId}">
          <div class="cards-list__img-wrap">
            ${card.imageUrl ? `<img src="${imgUrl}" alt="${card.name}" class="cards-list__img"/>` : noImgDiv}
          </div>

          <div class="cards-list__body">
            <header class="cards-list__header">
              <h4 class="cards-list__name">${card.name}</h4>
              <span class="cards-list__mana">${replaceTextShorts(card.manaCost, 'cards-list__attribute-mana')}</span>
              <span class="cards-list__mana-total">${card.cmc ? `(${card.cmc})` : ''}</span>

              <div class="cards-list__type">${card.type}</div>
              <div class="cards-list__set-rarity">${card.setName} - ${card.rarity}</div>
            </header>

            ${text}
          </div>
        </div>`;
    }).join(''); 
  }

  function generateTemplate(cards) {
    if (!cards.length) {
      return msgEmptyList;
    }

    if (listSetings.displayList === 'list') {
      return getListTemplate(cards);
    }

    return getGridTemplate(cards);
  }

  function replaceTextShorts(string, shortClass = 'cards-list__attribute') {
    if (!string) return '';

    const regex = /(\{([^)]{1,3})\})/g;
    const matches = [];
    let match = regex.exec(string);
    
    while (match !== null) {
      matches.push(match[1]);
      match = regex.exec(string);
    }
    
    for (match of matches) {
      const imgName = match
        .replace('{', '')
        .replace('}', '')
        .replace('/', '');
      string = string.replace(match, `<img class="${shortClass}" src="img/attributes/${imgName}.svg" alt="${imgName}">`);
    }

    return string;   
  }

  function changeGrid(e) {
    if (this.classList.contains('list-grid__btn--is-active')) return false;

    document.querySelector('.list-grid__btn--is-active').classList.remove('list-grid__btn--is-active');
    this.classList.add('list-grid__btn--is-active');

    listSetings.displayList = this.dataset.display;
    api.createList();
  }

  function initEvent() {
    dom.changeGridBtn.forEach(btn => {
      btn.addEventListener('click', changeGrid);
    });
  }

  initEvent();

  return {
    generateTemplate,
    replaceTextShorts,
  };
}());

export default listTemplates;
