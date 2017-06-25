const listTemplates = (function () {
  let currentTemplate = 'simple';
  const msgEmptyList = 'No cards';
  const noImgDiv = `
    <div class="cards-list__no-img-wrap">
      <img class="cards-list__no-img" src="img/logo-magic.png" alt='No img'>
      <span class="cards-list__no-img-label">No image</span>
    </div>
  `;

  function generateTemplate(cards) {
    if (!cards.length) {
      return msgEmptyList;
    }

    return returnSimpleTemplate(cards);
  }

  function manaCost(string) {
    if (!string) return '';

    const regex = /(\{([^)]{1,3})\})/g;

    let matchNumber = parseInt(regex.exec(string)[2], 10);
    let manaValue = matchNumber !== undefined ? matchNumber : 1;

    while (matchNumber = regex.exec(string)) {
      manaValue++;
    }

    return manaValue ? `(${manaValue})` : '';
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

  function returnSimpleTemplate(cards) {
    console.log('cards', cards);
    return cards.map(card => {
      const imgUrl = card.imageUrl || noImgDiv;

      return `
        <div class="cards-list__item">
          <div class="cards-list__img-wrap">
            ${card.imageUrl ? `<img src="${imgUrl}" alt="${card.name}" class="cards-list__img"/>` : noImgDiv}
          </div>

          <header class="cards-list__header">
            <h4 class="cards-list__name">${card.name}</h4>
            <span class="cards-list__mana">${replaceTextShorts(card.manaCost, 'cards-list__attribute-mana')}</span>
            <span class="cards-list__mana-total">${manaCost(card.manaCost)}</span>

            <div class="cards-list__type">${card.type}</div>
            <div class="cards-list__set-rarity">${card.setName} - ${card.rarity}</div>
          </header>

          <div class="cards-list__text">${replaceTextShorts(card.text)}</div>
        </div>`;
    }).join('');    
  }

  return {
    generateTemplate,
  };
}());

export default listTemplates;
