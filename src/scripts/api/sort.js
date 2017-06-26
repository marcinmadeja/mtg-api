import mtgApi from './api';

const sort = (function () {
  function sortElement(select) {
    const field = select.value || '';
    const sortType = select.selectedOptions[0].dataset.sortType || 'asc';
    const currentCards = mtgApi.getCurrentCards();

    if (!field.length) {
      return currentCards;
    }

    const sortedCard = currentCards.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

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
    sortElement,
  };  
}());

export default sort;
