import api from './api';
import apiSettings from './settings';
import utilities from './utilities';

const pagination = (function () {
  const headerSettings = apiSettings.list;
  const cardsCountWrap = apiSettings.dom.cardsCountWrap;
  const dom = apiSettings.dom;
  const listSetings = apiSettings.list;

  function setHeaderSettings(header) {
    headerSettings.totalCount = header.get('Total-Count') ? header.get('Total-Count') : false;

    if (headerSettings.totalCount === false || headerSettings.totalCount === undefined) {
      cardsCountWrap.innerHTML = '';
      return false;
    }

    if (cardsCountWrap) {
      cardsCountWrap.innerHTML = `
        <div class="cards-count__msg">Founded ${headerSettings.totalCount} ${headerSettings.totalCount <= 1 ? 'card' : 'cards'}</div>
      `;
    }
  }

  function createPaginationWrap() {
    let paginationDiv = document.querySelector('.pagination');
    if (paginationDiv) {
      utilities.removeNode(paginationDiv);
    }

    if (listSetings.totalCount <= 0) {
      return false;
    }

    const paginationContent = document.createElement('div');
    paginationContent.classList.add('pagination', 'container');
    utilities.insertAfter(paginationContent, document.querySelector('.cards-list'));

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
        isLast: false,
      });
    }

    const lastElement = list.length - 1;

    /* add last */
    if (list[lastElement].isLast && !list[lastElement].isCurrent) {
      list.push({
        type: 'next',
        content: '>',
        isCurrent: false,
        isFirst: false,
        isLast: false,
      });
    }

    return list;
  }

  function addDotsElement(list) {
    for (let i = 0; i < list.length; i++) {
      const currentElement = list[i];
      const prevElement = list[i - 1];
      
      if (prevElement && (currentElement.content - prevElement.content > 1)) {
        list.splice(i, 0, {
          type: 'dots',
          content: '...',
          isCurrent: false,
          isFirst: false,
          isLast: false,
        });
      }
    }
  }

  function createPaginationList() {
    const list = [];
    const listCurrent = [];

    if (listSetings.paginationTotalPages <= 6) {
      for (let i = 1; i <= listSetings.paginationTotalPages; i++) {
        list.push({
          type: 'number',
          content: i,
          isCurrent: listSetings.paginationCurrentPage === i,
          isFirst: i === 1,
          isLast: i === listSetings.paginationTotalPages,
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
      isLast: false,
    });

    if (listSetings.paginationTotalPages > 1) {
      list.push({
        type: 'number',
        content: listSetings.paginationTotalPages,
        isCurrent: listSetings.paginationCurrentPage === listSetings.paginationTotalPages,
        isFirst: false,
        isLast: true,
      });      
    }

    // add current if first element is current
    if (listSetings.paginationCurrentPage === 1) {
      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage + 1,
        isCurrent: false,
        isFirst: false,
        isLast: false,
      });

      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage + 2,
        isCurrent: false,
        isFirst: false,
        isLast: false,
      });
      // add current if second element is current
    } else if (listSetings.paginationCurrentPage === 2) {
      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage,
        isCurrent: true,
        isFirst: false,
        isLast: false,
      });

      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage + 1,
        isCurrent: false,
        isFirst: false,
        isLast: false,
      });
      // add current if penultimate element is current
    } else if (listSetings.paginationCurrentPage === (listSetings.paginationTotalPages - 1)) {
      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage - 1,
        isCurrent: false,
        isFirst: false,
        isLast: false,
      });

      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage,
        isCurrent: true,
        isFirst: false,
        isLast: false,
      });
      // add current if last element is current
    } else if (listSetings.paginationCurrentPage === listSetings.paginationTotalPages) {
      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage - 2,
        isCurrent: false,
        isFirst: false,
        isLast: false,
      });

      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage - 1,
        isCurrent: false,
        isFirst: false,
        isLast: false,
      });
      // others
    } else {
      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage - 1,
        isCurrent: false,
        isFirst: false,
        isLast: false,
      });

      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage,
        isCurrent: true,
        isFirst: false,
        isLast: false,
      });

      listCurrent.push({
        type: 'number',
        content: listSetings.paginationCurrentPage + 1,
        isCurrent: false,
        isFirst: false,
        isLast: false,
      });      
    }

    // insert current elements between first and last
    list.splice(1, 0, ...listCurrent);
    addNavigationButtons(list);
    addDotsElement(list);
    return list;      
  }

  function createPaginationItem(element) {
    const item = element.type !== 'dots' ? document.createElement('button') : document.createElement('span');
    const textNode = document.createTextNode(element.content);
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
    const pageNumber = parseInt(this.dataset.page, 10);
    if (!pageNumber) {
      return false;
    }

    listSetings.paginationCurrentPage = pageNumber;
    api.generateList();
  }

  function createPagination() {
    const paginationContent = createPaginationWrap();
    if (!paginationContent) return false;
    // listSetings.paginationTotalPages = 8;
    // listSetings.paginationCurrentPage = 3;    
    const paginationElements = createPaginationList();

    for (const element of paginationElements) {
      const item = createPaginationItem(element);
      paginationContent.appendChild(item);
      item.addEventListener('click', goToPage);
    }
  }

  function changeDisplayCardsAmount() {
    const displayAmount = parseInt(dom.displayCardsSelect.value, 10);
    if (displayAmount) {
      listSetings.displayCardsAmount = displayAmount;
    }
  }

  return {
    setHeaderSettings,
    createPagination,
    changeDisplayCardsAmount,
  };
}());

export default pagination;
