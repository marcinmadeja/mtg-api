import apiSettings from './settings';
import listTemplates from './list-templates';
import modal from './../../assets/modal/modal';

const cardsComparison = (function () {
  const { cardsComparison: comparisonSettings, dom } = apiSettings;
  const selectedCards = JSON.parse(localStorage.getItem('selectedCards')) || [];
  const buttonStates = {
    add: { 
      text: 'Porównaj',
      dataChangeText: 'Usuń z porównywarki',
      action: 'add',
    },
    remove: { 
      text: 'Usuń z porównywarki',
      dataChangeText: 'Porównaj',
      action: 'remove',
    },
  };

  function switchPanel() {
    const panel = this.parentNode;
    const hasClassActive = panel.classList.contains('comparison__panel--is-active');
    if (hasClassActive) {
      panel.classList.remove('comparison__panel--is-active');
    } else {
      panel.classList.add('comparison__panel--is-active');
    }
  }

  function getAddBtn(cardId) {
    const card = selectedCards.find(item => item.id === cardId);
    const currentState = card ? buttonStates.remove : buttonStates.add;

    return `<button 
              type="button" 
              class="${comparisonSettings.addCardClass} 
              btn--small btn" 
              data-card-id="${cardId}" 
              data-action="${currentState.action}" 
              data-text-change="${currentState.dataChangeText}">${currentState.text}</button>`;
  }

  function refreshCompareList() {
    const compareList = document.querySelector('.comparison__list');
    compareList.innerHTML = '';
    if (!selectedCards.length) return false;

    compareList.innerHTML = selectedCards.map(card => `
      <li class="comparison__list-item">
        <img class="comparison__list-img" src="${card.imageUrl}">
        <h6 class="comparison__list-title">${card.name}</h6>
        <button class="comparison__remove-btn" data-card-id="${card.id}" type="button"><i class="fa fa-times" aria-hidden="true"></i></button>
      </li>
    `).join('');

    const comparisonRemoveBtns = document.querySelectorAll('.comparison__remove-btn');
    comparisonRemoveBtns.forEach(button => {
      button.addEventListener('click', function () { removeFromCompare(this.dataset.cardId); });
    });
  }

  function addToCompare(cardId) {
    const card = apiSettings.getCurrentCards().find(item => item.id === cardId);
    const cardInSelectedCards = selectedCards.find(item => item.id === cardId);
    if (!card || cardInSelectedCards) return false;

    selectedCards.push(card);
    localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
    refreshCompareList();
  }

  function removeFromCompare(carId) {
    const cardIndex = selectedCards.findIndex(item => item.id === carId);
    if (cardIndex === undefined) return false;
    selectedCards.splice(cardIndex, 1);
    localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
    refreshCompareList();
  }

  function addEventToCardButton(e) {
    e.stopPropagation();
    const carId = this.dataset.cardId;
    const action = this.dataset.action;
    const currentBtnText = this.textContent;
    const newBtnText = this.dataset.textChange;

    this.textContent = newBtnText;
    this.dataset.textChange = currentBtnText;
    this.dataset.action = action === 'add' ? 'remove' : 'add';

    if (action === 'add') {
      addToCompare(carId);
    } else {
      removeFromCompare(carId);
    }
  }

  function initCardButtonEvents() {
    const buttons = document.querySelectorAll(`.${comparisonSettings.addCardClass}`);
    buttons.forEach(button => { button.addEventListener('click', addEventToCardButton); });
  }

  function addModal() {
    const modalElement = document.createElement('div');
    modalElement.classList.add('md-modal', 'comparison__modal');
    modalElement.setAttribute('id', 'modal-card-compare');
    modalElement.innerHTML = `
      <div class="comparison__modal-dialog md-modal__dialog--full md-modal__dialog">
        <div class="md-modal__content">
          <header class="md-modal__header">
            <h3 class="md-modal__title">Comparison</h3>
            <button class="md-modal__btn-close">&times</button>
          </header>

          <div class="compare-list comparison__modal-body md-modal__body">
            
          </div>
        </div>
      </div>    
    `;

    document.body.appendChild(modalElement);
    modal.initSpecificModal('modal-card-compare');
  }

  function addPanel() {
    const comparisonPanel = document.createElement('aside');
    comparisonPanel.classList.add('comparison__panel');
    comparisonPanel.innerHTML = (`
        <button class="comparison__btn-toggle"><i class="fa fa-refresh" aria-hidden="true"></i></button>
        <div class="comparison__header">
          <button class="comparison__btn-compare btn" data-md-modal="modal-card-compare">Compare choosen cards</button>
        </div>
        <ul class="comparison__list"></ul>
    `);
    document.body.appendChild(comparisonPanel);
  }


  function generateAttributes(card) {
    let attributeText = '';
    const attributes = [
      {
        name: 'name',
        type: 'text',
      },
      {
        name: 'manaCost',
        type: 'withMana',
      },
      {
        name: 'cmc',
        type: 'text',
      },
      {
        name: 'types',
        type: 'array',
      },
      {
        name: 'subtypes',
        type: 'array',
      },
      {
        name: 'rarity',
        type: 'text',
      },
      {
        name: 'setName',
        type: 'text',
      },
      {
        name: 'power',
        type: 'text',
      },
      {
        name: 'toughness',
        type: 'text',
      },
      {
        name: 'text',
        type: 'withMana',
      },      
    ];

    for (const attribute of attributes) {
      let attributeValue = card[attribute.name];
      if (attributeValue === undefined) attributeValue = '';

      if (attribute.type === 'withMana') {
        attributeValue = listTemplates.replaceTextShorts(attributeValue);
      } else if (attribute.type === 'array') {
        attributeValue = Array.from(attributeValue);
        attributeValue = attributeValue.join(' ');
      }

      attributeText += `
          <div class="compare-list__attribute--${attribute.name} compare-list__attribute">
            <div class="compare-list__attribute-name">${attribute.name}</div>
            <div class="compare-list__attribute-value">${attributeValue}</div>
          </div>
      `;
    }

    return attributeText;
  }

  function compareCards() {
    const modalBody = document.querySelector('.comparison__modal-body');

    if (selectedCards.length < 2) {
      modalBody.innerHTML = 'Za mało kart aby porównać';
      return false;
    }

    modalBody.innerHTML = selectedCards.map(card => {
      const imgUrl = card.imageUrl;
      return `
        <div class="compare-list__item">
          <div class="compare-list__img-wrap">
            <img class="compare-list__img" src="${imgUrl}">
          </div>

          <div class="compare-list__body">${generateAttributes(card)}</div>
        </div>
      `;
    }).join('');
  }

  function initComparisonPanel() {
    addPanel();

    const switchPanelBtn = document.querySelector('.comparison__btn-toggle');
    switchPanelBtn.addEventListener('click', switchPanel);

    const compareBtn = document.querySelector('.comparison__btn-compare');
    compareBtn.addEventListener('click', compareCards);

    refreshCompareList();
    addModal();
  }

  initComparisonPanel();

  return {
    getAddBtn,
    initCardButtonEvents,
  };
}());


export default cardsComparison;
