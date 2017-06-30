import modal from './../../assets/modal/modal';
import apiSettings from './settings';
import listTemplates from './list-templates';

const cardDetails = (function () {
  const cardModal = document.getElementById(apiSettings.cardDetails.modalId);
  const cardTitle = cardModal.querySelector('.card-details__title');
  const cardBody = cardModal.querySelector('.card-details__body');
  const noImgDiv = `
    <div class="card-details__no-img-wrap">
      <img class="card-details__no-img" src="img/logo-magic.png" alt='No img'>
      <span class="card-details__no-img-label">No image</span>
    </div>
  `;  
  const listSetings = apiSettings.list;

  function generateTextParts(card) {
    const textParts = ['artist', 'text', 'flavor', 'power', 'toughness', 'color', 'layout', 'printings', 'multiverseid'];
    const text = textParts.map(part => {
      if (!card[part]) return '';

      if (Array.isArray(card[part])) {
        card[part] = card[part].join(', ');
      }

      return `
          <div class="card-details__text">
            <h5 class="card-details__text-label">${part}:</h5>
            ${listTemplates.replaceTextShorts(card[part])}
          </div>
        `;
    }).join('');

    return text;
  }

  function generateList(listDetails) {
    const { card, name, title, text } = listDetails;
    if (!card[name]) return '';

    const list = card[name].map(item => `
      <li class="card-details__list-item">
        <span class="card-details__list-title">${item[title]}: </span>
        ${item[text]}
      </li>
    `).join('');

    return `
      <div class="card-details__text">
        <h5 class="card-details__text-label">${name}:</h5>    
        <ul class="card-details__list">${list}</ul>
      </div>
    `;    
  }

  function generateCardDetails(id) {
    const card = apiSettings.getCurrentCards().find(item => item.id === id);
    if (!card) return false;

    let imgUrl = card.imageUrl || noImgDiv;
    imgUrl = listSetings.showDefaultImg ? 'img/default-card.jpg' : imgUrl;

    const text = generateTextParts(card);
    const rulings = generateList({ card, name: 'rulings', title: 'date', text: 'text' });
    const foreignNames = generateList({ card, name: 'foreignNames', title: 'language', text: 'name' });
    const legalities = generateList({ card, name: 'legalities', title: 'format', text: 'legality' });

    cardTitle.innerHTML = card.name;
    cardBody.innerHTML = `
      <div class="card-details__img-wrap">
        ${card.imageUrl ? `<img src="${imgUrl}" alt="${card.name}" class="card-details__img"/>` : noImgDiv}
      </div>

      <div class="card-details__details">
          <header class="card-details__header">
            <h4 class="card-details__name">${card.name}</h4>
            <span class="card-details__mana">${listTemplates.replaceTextShorts(card.manaCost, 'card-details__attribute-mana')}</span>
            <span class="card-details__mana-total">${card.cmc ? `(${card.cmc})` : ''}</span>

            <div class="card-details__type">${card.type}</div>
            <div class="card-details__set-rarity">${card.setName} - ${card.rarity}</div>
          </header>

          ${listTemplates.replaceTextShorts(text)}
          ${rulings}
          ${legalities}
          ${foreignNames}
      </div>
    `;
  }

  function addEventToCards() {
    const cards = document.querySelectorAll(`.${apiSettings.cardDetails.cardClass}`);
    cards.forEach(card => {
      card.addEventListener('click', function () {
        modal.onClickOpen.call(this);
        generateCardDetails(this.dataset.cardId);
      });
    });
  }

  return {
    addEventToCards,
  };
}());

export default cardDetails;
