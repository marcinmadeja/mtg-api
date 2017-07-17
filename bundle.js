webpackJsonp([1],{

/***/ 121:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _modal = __webpack_require__(89);

var _modal2 = _interopRequireDefault(_modal);

var _settings = __webpack_require__(28);

var _settings2 = _interopRequireDefault(_settings);

var _listTemplates = __webpack_require__(61);

var _listTemplates2 = _interopRequireDefault(_listTemplates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cardDetails = function () {
  var cardModal = document.getElementById(_settings2.default.cardDetails.modalId);
  var cardTitle = cardModal.querySelector('.card-details__title');
  var cardBody = cardModal.querySelector('.card-details__body');
  var noImgDiv = '\n    <div class="card-details__no-img-wrap">\n      <img class="card-details__no-img" src="img/logo-magic.png" alt=\'No img\'>\n      <span class="card-details__no-img-label">No image</span>\n    </div>\n  ';
  var listSetings = _settings2.default.list;

  function generateTextParts(card) {
    var textParts = ['artist', 'text', 'flavor', 'power', 'toughness', 'color', 'layout', 'printings', 'multiverseid'];
    var text = textParts.map(function (part) {
      if (!card[part]) return '';

      if (Array.isArray(card[part])) {
        card[part] = card[part].join(', ');
      }

      return '\n          <div class="card-details__text">\n            <h5 class="card-details__text-label">' + part + ':</h5>\n            ' + _listTemplates2.default.replaceTextShorts(card[part]) + '\n          </div>\n        ';
    }).join('');

    return text;
  }

  function generateList(listDetails) {
    var card = listDetails.card,
        name = listDetails.name,
        title = listDetails.title,
        text = listDetails.text;

    if (!card[name]) return '';

    var list = card[name].map(function (item) {
      return '\n      <li class="card-details__list-item">\n        <span class="card-details__list-title">' + item[title] + ': </span>\n        ' + item[text] + '\n      </li>\n    ';
    }).join('');

    return '\n      <div class="card-details__text">\n        <h5 class="card-details__text-label">' + name + ':</h5>    \n        <ul class="card-details__list">' + list + '</ul>\n      </div>\n    ';
  }

  function generateCardDetails(id) {
    var card = _settings2.default.getCurrentCards().find(function (item) {
      return item.id === id;
    });
    if (!card) return false;

    var imgUrl = card.imageUrl || noImgDiv;
    imgUrl = listSetings.showDefaultImg ? 'img/default-card.jpg' : imgUrl;

    var text = generateTextParts(card);
    var rulings = generateList({ card: card, name: 'rulings', title: 'date', text: 'text' });
    var foreignNames = generateList({ card: card, name: 'foreignNames', title: 'language', text: 'name' });
    var legalities = generateList({ card: card, name: 'legalities', title: 'format', text: 'legality' });

    cardTitle.innerHTML = card.name;
    cardBody.innerHTML = '\n      <div class="card-details__img-wrap">\n        ' + (card.imageUrl ? '<img src="' + imgUrl + '" alt="' + card.name + '" class="card-details__img"/>' : noImgDiv) + '\n      </div>\n\n      <div class="card-details__details">\n          <header class="card-details__header">\n            <h4 class="card-details__name">' + card.name + '</h4>\n            <span class="card-details__mana">' + _listTemplates2.default.replaceTextShorts(card.manaCost, 'card-details__attribute-mana') + '</span>\n            <span class="card-details__mana-total">' + (card.cmc ? '(' + card.cmc + ')' : '') + '</span>\n\n            <div class="card-details__type">' + card.type + '</div>\n            <div class="card-details__set-rarity">' + card.setName + ' - ' + card.rarity + '</div>\n          </header>\n\n          ' + _listTemplates2.default.replaceTextShorts(text) + '\n          ' + rulings + '\n          ' + legalities + '\n          ' + foreignNames + '\n      </div>\n    ';
  }

  function addEventToCards() {
    var cards = document.querySelectorAll('.' + _settings2.default.cardDetails.cardClass);
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        _modal2.default.onClickOpen.call(this);
        generateCardDetails(this.dataset.cardId);
      });
    });
  }

  return {
    addEventToCards: addEventToCards
  };
}();

exports.default = cardDetails;

/***/ }),

/***/ 122:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _settings = __webpack_require__(28);

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var linkGenerator = function () {
  var baseLink = 'https://api.magicthegathering.io/v1/';
  var carsdUrl = baseLink + 'cards';
  var dom = _settings2.default.dom;
  var settings = _settings2.default.list;

  function generateRandom() {
    return carsdUrl + '?random=true&pageSize=' + settings.displayCardsAmount + '&contains=imageUrl';
  }

  function generateSpecialLink(linkPart) {
    return '' + baseLink + linkPart;
  }

  function addSettingsUrl() {
    var settingsParts = [];

    if (settings.pages && settings.displayCardsAmount) {
      settingsParts.push('page=' + settings.paginationCurrentPage + '&pageSize=' + settings.displayCardsAmount);
    }

    if (settings.onlyWithImg) {
      settingsParts.push('contains=imageUrl');
    }

    return settingsParts.join('&');
  }

  function addName() {
    var name = dom.form.querySelector('[name="name"]').value;
    var checked = Array.from(dom.searchName).find(function (checkbox) {
      return checkbox.checked;
    });

    if (!name.length) return '';

    return checked.value + '=' + name;
  }

  function addColors() {
    var colors = Array.from(dom.searchColorIdentity).filter(function (color) {
      return color.checked;
    }).map(function (color) {
      return color.value;
    });

    if (!colors.length) return '';

    return 'colorIdentity=' + colors.join(',');
  }

  function generateSpecialSelectUrl() {
    var urls = [];
    var selects = dom.advancedSelects;

    selects.forEach(function (select) {
      var value = select.value;
      var name = select.name;

      if (value.length) {
        urls.push(name + '=' + value);
      }
    });

    return urls;
  }

  function generateItemCompareUrl() {
    var items = dom.itemCompare;
    var urlParts = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        var type = item.dataset.itemCompare;
        var valueElement = document.querySelector('[name="' + type + '-compare"]');
        var compareOperatorElement = document.querySelector('[name="' + type + '-compare-oprerator"]');
        if (!type.length || !valueElement || !compareOperatorElement) return false;

        var value = valueElement.value;
        var compareOperator = compareOperatorElement.value;

        if (value) urlParts.push(type + '=' + compareOperator + value);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return urlParts;
  }

  function generate() {
    var url = carsdUrl + '?';
    var urlParts = [];

    urlParts.push(addName(), addColors(), addSettingsUrl());

    if (settings.advancedSearch) {
      var _urlParts, _urlParts2;

      (_urlParts = urlParts).push.apply(_urlParts, _toConsumableArray(generateSpecialSelectUrl()));
      (_urlParts2 = urlParts).push.apply(_urlParts2, _toConsumableArray(generateItemCompareUrl()));
    }

    urlParts = urlParts.filter(function (part) {
      return part.length;
    }).join('&');
    urlParts = encodeURI(urlParts);
    url += urlParts;

    console.log('url', url);

    return url;
  }

  function generateAutocompleteUrl() {
    var namePart = encodeURI(addName());
    var url = carsdUrl + '?' + namePart + '&pageSize=8&page1&contains=imageUrl';

    return url;
  }

  return {
    generate: generate,
    generateRandom: generateRandom,
    generateSpecialLink: generateSpecialLink,
    generateItemCompareUrl: generateItemCompareUrl,
    generateAutocompleteUrl: generateAutocompleteUrl
  };
}();

exports.default = linkGenerator;

/***/ }),

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = __webpack_require__(60);

var _api2 = _interopRequireDefault(_api);

var _settings = __webpack_require__(28);

var _settings2 = _interopRequireDefault(_settings);

var _utilities = __webpack_require__(126);

var _utilities2 = _interopRequireDefault(_utilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pagination = function () {
  var cardsCountWrap = _settings2.default.dom.cardsCountWrap;
  var dom = _settings2.default.dom;
  var listSetings = _settings2.default.list;

  function setHeaderSettings(header) {
    listSetings.totalCount = header.get('Total-Count') ? header.get('Total-Count') : false;

    if (listSetings.totalCount === false || listSetings.totalCount === undefined) {
      cardsCountWrap.innerHTML = '';
      return false;
    }

    if (cardsCountWrap) {
      cardsCountWrap.innerHTML = '\n        <div class="cards-count__msg">Founded ' + listSetings.totalCount + ' ' + (listSetings.totalCount <= 1 ? 'card' : 'cards') + '</div>\n      ';
    }
  }

  function createPaginationWrap() {
    var paginationDiv = document.querySelector('.pagination');
    if (paginationDiv) {
      _utilities2.default.removeNode(paginationDiv);
    }

    if (listSetings.totalCount <= 0) {
      return false;
    }

    var paginationContent = document.createElement('div');
    paginationContent.classList.add('pagination', 'container');
    _utilities2.default.insertAfter(paginationContent, document.querySelector('.cards-list'));

    listSetings.paginationTotalPages = Math.ceil(listSetings.totalCount / listSetings.displayCardsAmount);

    if (listSetings.paginationTotalPages === 1) {
      return false;
    }

    return paginationContent;
  }

  function addNavigationButtons(list) {
    /* add first */
    if (list[0].isFirst && !list[0].isCurrent) {
      list.unshift({
        type: 'prev',
        content: '<',
        isCurrent: false,
        isFirst: false,
        isLast: false
      });
    }

    var lastElement = list.length - 1;

    /* add last */
    if (list[lastElement].isLast && !list[lastElement].isCurrent) {
      list.push({
        type: 'next',
        content: '>',
        isCurrent: false,
        isFirst: false,
        isLast: false
      });
    }

    return list;
  }

  function addDotsElement(list) {
    for (var i = 0; i < list.length; i++) {
      var currentElement = list[i];
      var prevElement = list[i - 1];

      if (prevElement && currentElement.content - prevElement.content > 1) {
        list.splice(i, 0, {
          type: 'dots',
          content: '...',
          isCurrent: false,
          isFirst: false,
          isLast: false
        });
      }
    }
  }

  function createPaginationList() {
    var list = [];
    var listCurrent = [];

    if (listSetings.paginationTotalPages <= 6) {
      for (var i = 1; i <= listSetings.paginationTotalPages; i++) {
        list.push({
          type: 'number',
          content: i,
          isCurrent: listSetings.paginationCurrentPage === i,
          isFirst: i === 1,
          isLast: i === listSetings.paginationTotalPages
        });
      }
      addNavigationButtons(list);
      return list;
    }

    // dodam pierwszy i ostatni element
    list.push({
      type: 'number',
      content: 1,
      isCurrent: listSetings.paginationCurrentPage === 1,
      isFirst: true,
      isLast: false
    });

    if (listSetings.paginationTotalPages > 1) {
      list.push({
        type: 'number',
        content: listSetings.paginationTotalPages,
        isCurrent: listSetings.paginationCurrentPage === listSetings.paginationTotalPages,
        isFirst: false,
        isLast: true
      });
    }

    // add current if first element is current
    if (listSetings.paginationCurrentPage === 1) {
      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage + 1,
        isCurrent: false,
        isFirst: false,
        isLast: false
      });

      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage + 2,
        isCurrent: false,
        isFirst: false,
        isLast: false
      });
      // add current if second element is current
    } else if (listSetings.paginationCurrentPage === 2) {
      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage,
        isCurrent: true,
        isFirst: false,
        isLast: false
      });

      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage + 1,
        isCurrent: false,
        isFirst: false,
        isLast: false
      });
      // add current if penultimate element is current
    } else if (listSetings.paginationCurrentPage === listSetings.paginationTotalPages - 1) {
      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage - 1,
        isCurrent: false,
        isFirst: false,
        isLast: false
      });

      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage,
        isCurrent: true,
        isFirst: false,
        isLast: false
      });
      // add current if last element is current
    } else if (listSetings.paginationCurrentPage === listSetings.paginationTotalPages) {
      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage - 2,
        isCurrent: false,
        isFirst: false,
        isLast: false
      });

      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage - 1,
        isCurrent: false,
        isFirst: false,
        isLast: false
      });
      // others
    } else {
      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage - 1,
        isCurrent: false,
        isFirst: false,
        isLast: false
      });

      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage,
        isCurrent: true,
        isFirst: false,
        isLast: false
      });

      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage + 1,
        isCurrent: false,
        isFirst: false,
        isLast: false
      });
    }

    // insert current elements between first and last
    list.splice.apply(list, [1, 0].concat(listCurrent));
    addNavigationButtons(list);
    addDotsElement(list);
    return list;
  }

  function createPaginationItem(element) {
    var item = element.type !== 'dots' ? document.createElement('button') : document.createElement('span');
    var textNode = document.createTextNode(element.content);
    item.appendChild(textNode);
    item.classList.add('pagination__item');

    if (element.type !== 'dots') {
      item.classList.add('pagination__item--btn');
    } else {
      item.classList.add('pagination__item--dots');
    }

    // add data attribute
    if (element.type === 'number') {
      item.dataset.page = element.content === listSetings.paginationCurrentPage ? 0 : element.content;
    } else if (element.type === 'prev') {
      item.dataset.page = listSetings.paginationCurrentPage - 1;
    } else if (element.type === 'next') {
      item.dataset.page = listSetings.paginationCurrentPage + 1;
    }

    if (element.isCurrent) {
      item.classList.add('pagination__item--current');
    }

    return item;
  }

  function goToPage(e) {
    var pageNumber = parseInt(this.dataset.page, 10);
    if (!pageNumber) {
      return false;
    }

    listSetings.paginationCurrentPage = pageNumber;
    _api2.default.generateList();
  }

  function createPagination() {
    var paginationContent = createPaginationWrap();
    if (!paginationContent) return false;
    var paginationElements = createPaginationList();

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = paginationElements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var element = _step.value;

        var item = createPaginationItem(element);
        paginationContent.appendChild(item);
        item.addEventListener('click', goToPage);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  function changeDisplayCardsAmount() {
    var displayAmount = parseInt(dom.displayCardsSelect.value, 10);
    if (displayAmount) {
      listSetings.displayCardsAmount = displayAmount;
    }
  }

  return {
    setHeaderSettings: setHeaderSettings,
    createPagination: createPagination,
    changeDisplayCardsAmount: changeDisplayCardsAmount
  };
}();

exports.default = pagination;

/***/ }),

/***/ 124:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _settings = __webpack_require__(28);

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchState = function () {
  var dom = _settings2.default.dom,
      state = _settings2.default.state;

  var searchBtn = dom.searchBtn;
  var elementsToDisable = [dom.searchBtn, dom.cardList];

  var loaderDom = '\n    <div class="spinner">\n      <div class="rect1"></div>\n      <div class="rect2"></div>\n      <div class="rect3"></div>\n      <div class="rect4"></div>\n      <div class="rect5"></div>\n    </div>\n  ';

  function addLoader(button) {
    button.dataset.text = button.textContent;
    button.innerHTML = loaderDom;
  }

  function removeLoader(button) {
    button.innerHTML = button.dataset.text;
    button.dataset.text = '';
  }

  function disableElements() {
    elementsToDisable.forEach(function (element) {
      if (element) {
        element.classList.add(state.disableElementClass);
      }
    });
  }

  function enableElements() {
    elementsToDisable.forEach(function (element) {
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
    searchingInProgress: searchingInProgress,
    searchingEnded: searchingEnded
  };
}();

exports.default = searchState;

/***/ }),

/***/ 125:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _settings = __webpack_require__(28);

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var sort = function () {
  function sortElement(select) {
    var field = select.value || '';
    var sortType = select.selectedOptions[0].dataset.sortType || 'asc';
    var cards = [].concat(_toConsumableArray(_settings2.default.getCurrentCards()));

    if (!field.length) {
      return cards;
    }

    var sortedCard = cards.sort(function (a, b) {
      var aVal = a[field];
      var bVal = b[field];

      if (!(field in a) || !(field in b)) {
        return 1;
      }

      if (sortType === 'asc') {
        return aVal > bVal ? 1 : -1;
      }

      return aVal < bVal ? 1 : -1;
    });

    return sortedCard;
  }

  return {
    sortElement: sortElement
  };
}();

exports.default = sort;

/***/ }),

/***/ 126:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var utilities = function () {
  function insertAfter(newNode, referenceNode) {
    var parent = referenceNode.parentNode;
    parent.insertBefore(newNode, referenceNode.nextSibling);
  }

  function removeNode(node) {
    var parent = node.parentNode;
    return parent.removeChild(node);
  }

  return {
    insertAfter: insertAfter,
    removeNode: removeNode
  };
}();

exports.default = utilities;

/***/ }),

/***/ 127:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _api = __webpack_require__(60);

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_api2.default.initApi();

/***/ }),

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var apiSettings = function () {
  var form = document.querySelector('.js__search-form');
  var currentCards = [];

  var cardsComparison = {
    addCardClass: 'comparison__add-btn'
  };

  var autoCompleteSetts = {
    listClass: 'autocomplete__list',
    listItemClass: 'autocomplete__list-item'
  };

  var state = {
    isSearchInProgress: false,
    disableElementClass: 'js__search-element--is-disabled'
  };

  var cardDetails = {
    modalId: 'modal-card-details',
    cardClass: 'cards-list__item'
  };

  var list = {
    onlyWithImg: true,
    paginationCurrentPage: 1,
    paginationTotalPages: 0,
    pages: 1,
    displayCardsAmount: 8,
    totalCount: 0,
    displayList: 'grid',
    showDefaultImg: false,
    advancedSearch: false
  };

  var dom = {
    form: form,
    searchBtn: document.querySelector('.js__search-btn'),
    cardsList: document.querySelector('.cards-list'),
    searchName: form.querySelectorAll('[name="search-card"]'),
    searchColorIdentity: form.querySelectorAll('[name="colorIdentity"]'),
    sort: document.querySelector('.js-sort'),
    cardList: document.querySelector('.cards-list '),
    cardsCountWrap: document.querySelector('.cards-count'),
    cardListSection: document.querySelector('.cards-list__section'),
    displayCardsSelect: document.querySelector('.js-change-display-cards'),
    changeGridBtn: document.querySelectorAll('.list-grid__btn'),
    expandBtn: document.querySelector('.btn-expand'),
    searchAdvanced: document.querySelector('.search__advanced'),
    selectFormats: document.querySelector('.js-select-formats'),
    advancedSelects: document.querySelectorAll('.js-advanced-selects'),
    itemCompare: document.querySelectorAll('[data-item-compare]'),
    autoCompleteInputs: document.querySelectorAll('.js-autocomplete--input')
  };

  function getCurrentCards() {
    return currentCards;
  }

  function setCurrentCards(cards) {
    cards = Array.from(cards);
    currentCards.length = 0;
    currentCards.push.apply(currentCards, _toConsumableArray(cards));
  }

  return {
    list: list,
    dom: dom,
    cardDetails: cardDetails,
    getCurrentCards: getCurrentCards,
    setCurrentCards: setCurrentCards,
    state: state,
    autoCompleteSetts: autoCompleteSetts,
    cardsComparison: cardsComparison
  };
}();

exports.default = apiSettings;

/***/ }),

/***/ 60:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _settings = __webpack_require__(28);

var _settings2 = _interopRequireDefault(_settings);

var _linkGenerator = __webpack_require__(122);

var _linkGenerator2 = _interopRequireDefault(_linkGenerator);

var _listTemplates = __webpack_require__(61);

var _listTemplates2 = _interopRequireDefault(_listTemplates);

var _pagination = __webpack_require__(123);

var _pagination2 = _interopRequireDefault(_pagination);

var _sort = __webpack_require__(125);

var _sort2 = _interopRequireDefault(_sort);

var _cardDetails = __webpack_require__(121);

var _cardDetails2 = _interopRequireDefault(_cardDetails);

var _searchState = __webpack_require__(124);

var _searchState2 = _interopRequireDefault(_searchState);

var _cardsComparison = __webpack_require__(90);

var _cardsComparison2 = _interopRequireDefault(_cardsComparison);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mtgApi = function () {
  var dom = _settings2.default.dom,
      listSettings = _settings2.default.list,
      state = _settings2.default.state;


  function createList() {
    var cardList = dom.cardsList;
    var sortSelect = dom.sort;
    var sortedCards = _sort2.default.sortElement(sortSelect);

    cardList.innerHTML = _listTemplates2.default.generateTemplate(sortedCards);
    _cardDetails2.default.addEventToCards();
    _cardsComparison2.default.initCardButtonEvents();
  }

  function listPromise(url) {
    if (state.isSearchInProgress) return;

    var postsPromise = fetch(url);
    _searchState2.default.searchingInProgress();

    postsPromise.then(function (data) {
      _pagination2.default.setHeaderSettings(data.headers);
      _pagination2.default.createPagination();
      return data.json();
    }).then(function (data) {
      _settings2.default.setCurrentCards(data.cards);
      _searchState2.default.searchingEnded();
      return createList();
    }).catch(function (err) {
      console.error(err);
      _searchState2.default.searchingEnded();
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
    _pagination2.default.changeDisplayCardsAmount();
    initSearch();
  }

  function initSearch(e) {
    if (e) e.preventDefault();

    var url = _linkGenerator2.default.generate();
    listPromise(url);
  }

  function generateList() {
    var url = _linkGenerator2.default.generate();
    listPromise(url);
  }

  function initRandom() {
    var url = _linkGenerator2.default.generateRandom();
    listPromise(url);
  }

  function initEvents() {
    dom.searchBtn.addEventListener('click', initSearch);
    dom.form.addEventListener('submit', initSearch);
    dom.sort.addEventListener('change', function () {
      createList(_settings2.default.getCurrentCards());
    });

    dom.displayCardsSelect.addEventListener('change', changeDisplayCards);
    dom.expandBtn.addEventListener('click', showAdvancedMenu);
  }

  function initAdvancedFormSelects() {
    dom.advancedSelects.forEach(function (select) {
      var linkPart = select.dataset.link;
      var postsPromise = fetch(_linkGenerator2.default.generateSpecialLink(linkPart));

      postsPromise.then(function (data) {
        return data.json();
      }).then(function (data) {
        if (data[linkPart]) {
          data[linkPart].forEach(function (item) {
            item = linkPart === 'sets' ? item.name : item;
            var option = document.createElement('option');
            var textNode = document.createTextNode(item);

            option.appendChild(textNode);
            option.value = item;
            select.appendChild(option);
          });
        }
      }).catch(function (err) {
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
    initApi: initApi,
    createList: createList,
    generateList: generateList
  };
}();

exports.default = mtgApi;

/***/ }),

/***/ 61:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _settings = __webpack_require__(28);

var _settings2 = _interopRequireDefault(_settings);

var _api = __webpack_require__(60);

var _api2 = _interopRequireDefault(_api);

var _cardsComparison = __webpack_require__(90);

var _cardsComparison2 = _interopRequireDefault(_cardsComparison);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var listTemplates = function () {
  var listSetings = _settings2.default.list,
      dom = _settings2.default.dom,
      comparisonSettings = _settings2.default.cardsComparison;


  var msgEmptyList = 'No cards';
  var noImgDiv = '\n    <div class="cards-list__no-img-wrap">\n      <img class="cards-list__no-img" src="img/logo-magic.png" alt=\'No img\'>\n      <span class="cards-list__no-img-label">No image</span>\n    </div>\n  ';

  function getGridTemplate(cards) {
    return cards.map(function (card) {
      var imgUrl = card.imageUrl || noImgDiv;
      imgUrl = listSetings.showDefaultImg ? 'img/default-card.jpg' : imgUrl;

      return '\n        <div class="cards-list__item cards-list__item--grid" data-md-modal="' + _settings2.default.cardDetails.modalId + '" data-card-id="' + card.id + '">\n          <div class="cards-list__img-wrap">\n            ' + (card.imageUrl ? '<img src="' + imgUrl + '" alt="' + card.name + '" class="cards-list__img"/>' : noImgDiv) + '\n          </div>\n\n          <header class="cards-list__header">\n            <h4 class="cards-list__name">' + card.name + '</h4>\n            <span class="cards-list__mana">' + replaceTextShorts(card.manaCost, 'cards-list__attribute-mana') + '</span>\n            <span class="cards-list__mana-total">' + (card.cmc ? '(' + card.cmc + ')' : '') + '</span>\n\n            <div class="cards-list__type">' + card.type + '</div>\n            <div class="cards-list__set-rarity">' + card.setName + ' - ' + card.rarity + '</div>\n          </header>\n\n          <div class="cards-list__text">' + replaceTextShorts(card.text) + '</div>\n          ' + _cardsComparison2.default.getAddBtn(card.id) + '\n        </div>';
    }).join('');
  }

  function getListTemplate(cards) {
    return cards.map(function (card) {
      var imgUrl = card.imageUrl || noImgDiv;
      var textParts = ['artist', 'text', 'flavor', 'power', 'toughness'];
      imgUrl = listSetings.showDefaultImg ? 'img/default-card.jpg' : imgUrl;

      var text = textParts.map(function (part) {
        if (!card[part]) return '';

        return '\n            <div class="cards-list__text">\n              <span class="cards-list__text-label">' + part + ': </span>\n              ' + replaceTextShorts(card[part]) + '\n            </div>\n         ';
      }).join('');

      return '\n        <div class="cards-list__item cards-list__item--list" data-md-modal="' + _settings2.default.cardDetails.modalId + '">\n          <div class="cards-list__img-wrap">\n            ' + (card.imageUrl ? '<img src="' + imgUrl + '" alt="' + card.name + '" class="cards-list__img"/>' : noImgDiv) + '\n          </div>\n\n          <div class="cards-list__body">\n            <header class="cards-list__header">\n              <h4 class="cards-list__name">' + card.name + '</h4>\n              <span class="cards-list__mana">' + replaceTextShorts(card.manaCost, 'cards-list__attribute-mana') + '</span>\n              <span class="cards-list__mana-total">' + (card.cmc ? '(' + card.cmc + ')' : '') + '</span>\n\n              <div class="cards-list__type">' + card.type + '</div>\n              <div class="cards-list__set-rarity">' + card.setName + ' - ' + card.rarity + '</div>\n            </header>\n\n            ' + text + '\n            ' + _cardsComparison2.default.getAddBtn(card.id) + '\n          </div>\n        </div>';
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

  function replaceTextShorts(string) {
    var shortClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'cards-list__attribute';

    if (!string) return '';

    var regex = /(\{([^)]{1,3})\})/g;
    var matches = [];
    var match = regex.exec(string);

    while (match !== null) {
      matches.push(match[1]);
      match = regex.exec(string);
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = matches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        match = _step.value;

        var imgName = match.replace('{', '').replace('}', '').replace('/', '');
        string = string.replace(match, '<img class="' + shortClass + '" src="img/attributes/' + imgName + '.svg" alt="' + imgName + '">');
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return string;
  }

  function changeGrid(e) {
    if (this.classList.contains('list-grid__btn--is-active')) return false;

    document.querySelector('.list-grid__btn--is-active').classList.remove('list-grid__btn--is-active');
    this.classList.add('list-grid__btn--is-active');

    listSetings.displayList = this.dataset.display;
    _api2.default.createList();
  }

  function initEvent() {
    dom.changeGridBtn.forEach(function (btn) {
      btn.addEventListener('click', changeGrid);
    });
  }

  initEvent();

  return {
    generateTemplate: generateTemplate,
    replaceTextShorts: replaceTextShorts
  };
}();

exports.default = listTemplates;

/***/ }),

/***/ 89:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var modal = function () {
  var settings = {
    initFromStart: true,
    animationName: 'md-modal--effect-1',
    modalClass: 'md-modal',
    bodyClass: 'md-modal--open',
    showModalClass: 'md-modal--show',
    overlayClass: 'md-modal__overlay',
    triggerButtonData: 'data-md-modal',
    triggerBtnDataset: 'mdModal',
    closeBtn: 'md-modal__btn-close'
  };

  function removeOverlay() {
    document.querySelectorAll('.' + settings.overlayClass).forEach(function (overlay) {
      overlay.parentNode.removeChild(overlay);
    });
  }

  function addOverlay() {
    removeOverlay();
    var existingOverlay = document.querySelector('.' + settings.overlayClass);
    var overlay = document.createElement('div');
    overlay.classList.add(settings.overlayClass);
    document.body.appendChild(overlay);
  }

  function openModal(modalId) {
    var modalElement = document.getElementById(modalId);
    if (!modalId) return false;

    modalElement.classList.add(settings.showModalClass);
    document.body.classList.add(settings.bodyClass);
    modalElement.style.display = 'block';
    setTimeout(function () {
      modalElement.classList.add(settings.animationName);
      addOverlay();
    }, 50);
  }

  function onClickOpen() {
    var modalId = this.dataset[settings.triggerBtnDataset];
    openModal(modalId);
  }

  function initAllButtons() {
    var buttons = document.querySelectorAll('[' + settings.triggerButtonData + ']');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', onClickOpen);
    });
  }

  function closeModal() {
    var visibleModal = document.querySelector('.' + settings.showModalClass);
    if (!visibleModal) return false;

    visibleModal.classList.remove(settings.showModalClass);
    document.body.classList.remove(settings.bodyClass);
    visibleModal.classList.remove(settings.animationName);

    setTimeout(function () {
      visibleModal.style.display = 'none';
      removeOverlay();
    }, 300);
  }

  function clickModalContent(e) {
    if (this === e.target) {
      closeModal();
    }
  }

  function initSpecificModal(modalId) {
    var buttons = document.querySelectorAll('[' + settings.triggerButtonData + '="' + modalId + '"]');
    var modalElement = document.getElementById(modalId);
    var closeBtn = modalElement.querySelector('.' + settings.closeBtn);
    if (!buttons || !modalElement || !closeBtn) return false;

    buttons.forEach(function (button) {
      button.addEventListener('click', onClickOpen);
    });
    modalElement.addEventListener('click', clickModalContent);
    closeBtn.addEventListener('click', closeModal);
  }

  function init() {
    if (settings.initFromStart) initAllButtons();

    document.querySelectorAll('.' + settings.closeBtn).forEach(function (button) {
      button.addEventListener('click', closeModal);
    });

    document.querySelectorAll('.md-modal').forEach(function (modalElement) {
      modalElement.addEventListener('click', clickModalContent);
    });
  }

  init();

  return {
    init: init,
    closeModal: closeModal,
    openModal: openModal,
    onClickOpen: onClickOpen,
    initSpecificModal: initSpecificModal
  };
}();

exports.default = modal;

/***/ }),

/***/ 90:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _settings = __webpack_require__(28);

var _settings2 = _interopRequireDefault(_settings);

var _listTemplates = __webpack_require__(61);

var _listTemplates2 = _interopRequireDefault(_listTemplates);

var _modal = __webpack_require__(89);

var _modal2 = _interopRequireDefault(_modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cardsComparison = function () {
  var comparisonSettings = _settings2.default.cardsComparison,
      dom = _settings2.default.dom;

  var selectedCards = JSON.parse(localStorage.getItem('selectedCards')) || [];
  var buttonStates = {
    add: {
      text: 'Porównaj',
      dataChangeText: 'Usuń z porównywarki',
      action: 'add'
    },
    remove: {
      text: 'Usuń z porównywarki',
      dataChangeText: 'Porównaj',
      action: 'remove'
    }
  };

  function switchPanel() {
    var panel = this.parentNode;
    var hasClassActive = panel.classList.contains('comparison__panel--is-active');
    if (hasClassActive) {
      panel.classList.remove('comparison__panel--is-active');
    } else {
      panel.classList.add('comparison__panel--is-active');
    }
  }

  function getAddBtn(cardId) {
    var card = selectedCards.find(function (item) {
      return item.id === cardId;
    });
    var currentState = card ? buttonStates.remove : buttonStates.add;

    return '<button \n              type="button" \n              class="' + comparisonSettings.addCardClass + ' \n              btn--small btn" \n              data-card-id="' + cardId + '" \n              data-action="' + currentState.action + '" \n              data-text-change="' + currentState.dataChangeText + '">' + currentState.text + '</button>';
  }

  function refreshCompareList() {
    var compareList = document.querySelector('.comparison__list');
    compareList.innerHTML = '';
    if (!selectedCards.length) return false;

    compareList.innerHTML = selectedCards.map(function (card) {
      return '\n      <li class="comparison__list-item">\n        <img class="comparison__list-img" src="' + card.imageUrl + '">\n        <h6 class="comparison__list-title">' + card.name + '</h6>\n        <button class="comparison__remove-btn" data-card-id="' + card.id + '" type="button"><i class="fa fa-times" aria-hidden="true"></i></button>\n      </li>\n    ';
    }).join('');

    var comparisonRemoveBtns = document.querySelectorAll('.comparison__remove-btn');
    comparisonRemoveBtns.forEach(function (button) {
      button.addEventListener('click', function () {
        removeFromCompare(this.dataset.cardId);
      });
    });
  }

  function addToCompare(cardId) {
    var card = _settings2.default.getCurrentCards().find(function (item) {
      return item.id === cardId;
    });
    var cardInSelectedCards = selectedCards.find(function (item) {
      return item.id === cardId;
    });
    if (!card || cardInSelectedCards) return false;

    selectedCards.push(card);
    localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
    refreshCompareList();
  }

  function removeFromCompare(carId) {
    var cardIndex = selectedCards.findIndex(function (item) {
      return item.id === carId;
    });
    if (cardIndex === undefined) return false;
    selectedCards.splice(cardIndex, 1);
    localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
    refreshCompareList();
  }

  function addEventToCardButton(e) {
    e.stopPropagation();
    var carId = this.dataset.cardId;
    var action = this.dataset.action;
    var currentBtnText = this.textContent;
    var newBtnText = this.dataset.textChange;

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
    var buttons = document.querySelectorAll('.' + comparisonSettings.addCardClass);
    buttons.forEach(function (button) {
      button.addEventListener('click', addEventToCardButton);
    });
  }

  function addModal() {
    var modalElement = document.createElement('div');
    modalElement.classList.add('md-modal', 'comparison__modal');
    modalElement.setAttribute('id', 'modal-card-compare');
    modalElement.innerHTML = '\n      <div class="comparison__modal-dialog md-modal__dialog--full md-modal__dialog">\n        <div class="md-modal__content">\n          <header class="md-modal__header">\n            <h3 class="md-modal__title">Comparison</h3>\n            <button class="md-modal__btn-close">&times</button>\n          </header>\n\n          <div class="compare-list comparison__modal-body md-modal__body">\n            \n          </div>\n        </div>\n      </div>    \n    ';

    document.body.appendChild(modalElement);
    _modal2.default.initSpecificModal('modal-card-compare');
  }

  function addPanel() {
    var comparisonPanel = document.createElement('aside');
    comparisonPanel.classList.add('comparison__panel');
    comparisonPanel.innerHTML = '\n        <button class="comparison__btn-toggle"><i class="fa fa-refresh" aria-hidden="true"></i></button>\n        <div class="comparison__header">\n          <button class="comparison__btn-compare btn" data-md-modal="modal-card-compare">Compare choosen cards</button>\n        </div>\n        <ul class="comparison__list"></ul>\n    ';
    document.body.appendChild(comparisonPanel);
  }

  function generateAttributes(card) {
    var attributeText = '';
    var attributes = [{
      name: 'name',
      type: 'text'
    }, {
      name: 'manaCost',
      type: 'withMana'
    }, {
      name: 'cmc',
      type: 'text'
    }, {
      name: 'types',
      type: 'array'
    }, {
      name: 'subtypes',
      type: 'array'
    }, {
      name: 'rarity',
      type: 'text'
    }, {
      name: 'setName',
      type: 'text'
    }, {
      name: 'power',
      type: 'text'
    }, {
      name: 'toughness',
      type: 'text'
    }, {
      name: 'text',
      type: 'withMana'
    }];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var attribute = _step.value;

        var attributeValue = card[attribute.name];
        if (attributeValue === undefined) attributeValue = '';

        if (attribute.type === 'withMana') {
          attributeValue = _listTemplates2.default.replaceTextShorts(attributeValue);
        } else if (attribute.type === 'array') {
          attributeValue = Array.from(attributeValue);
          attributeValue = attributeValue.join(' ');
        }

        attributeText += '\n          <div class="compare-list__attribute--' + attribute.name + ' compare-list__attribute">\n            <div class="compare-list__attribute-name">' + attribute.name + '</div>\n            <div class="compare-list__attribute-value">' + attributeValue + '</div>\n          </div>\n      ';
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return attributeText;
  }

  function compareCards() {
    var modalBody = document.querySelector('.comparison__modal-body');

    if (selectedCards.length < 2) {
      modalBody.innerHTML = 'Za mało kart aby porównać';
      return false;
    }

    modalBody.innerHTML = selectedCards.map(function (card) {
      var imgUrl = card.imageUrl;
      return '\n        <div class="compare-list__item">\n          <div class="compare-list__img-wrap">\n            <img class="compare-list__img" src="' + imgUrl + '">\n          </div>\n\n          <div class="compare-list__body">' + generateAttributes(card) + '</div>\n        </div>\n      ';
    }).join('');
  }

  function initComparisonPanel() {
    addPanel();

    var switchPanelBtn = document.querySelector('.comparison__btn-toggle');
    switchPanelBtn.addEventListener('click', switchPanel);

    var compareBtn = document.querySelector('.comparison__btn-compare');
    compareBtn.addEventListener('click', compareCards);

    refreshCompareList();
    addModal();
  }

  initComparisonPanel();

  return {
    getAddBtn: getAddBtn,
    initCardButtonEvents: initCardButtonEvents
  };
}();

exports.default = cardsComparison;

/***/ })

},[127]);
//# sourceMappingURL=bundle.js.map