import apiSettings from './settings';

const pagination = (function () {
  const headerSettings = apiSettings.list;

  function setHeaderSettings(header) {
    headerSettings.totalCount = header.get('Total-Count') ? header.get('Total-Count') : false;
  }

  function createPagination() {

  }

  return {
    setHeaderSettings,
    createPagination,
  };
}());

export default pagination;
