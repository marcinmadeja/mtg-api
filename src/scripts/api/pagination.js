const pagination = (function () {
  const headerSettings = {
    page: 1,
    pageSize: 32,
    totalCount: false,
  };

  function setHeaderSettings(header) {
    headerSettings.totalCount = header.get('Total-Count') ? header.get('Total-Count') : false;
  }

  return {
    setHeaderSettings,
  };
}());

export default pagination;
