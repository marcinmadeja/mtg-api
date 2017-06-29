const modal = (function () {
  const settings = {
    initFromStart: true,
    showModalClass: 'md-modal--show',
    overlayClass: 'md-modal__overlay',
    triggerButtonData: 'data-md-modal',
    triggerBtnDataset: 'mdModal',
  };

  function openModal(id) {

  }

  function onButtonClick(e) {
    e.preventDefault();
    const modalId = this.dataset[settings.triggerBtnDataset];
    const modalElement = document.getElementById(modalId);
    if (!modalId || !modalElement) return false;
    
    modalElement.classList.add(settings.showModalClass);
  }

  function initAllButtons() {
    const buttons = document.querySelectorAll(`[${settings.triggerButtonData}]`);
    buttons.forEach(btn => {
      btn.addEventListener('click', onButtonClick);
    });
  }

  function closeModal() {
    const visibleModal = document.querySelector(`.${settings.showModalClass}`);
    if (!visibleModal) return false;

    visibleModal.classList.remove(settings.showModalClass);
  }

  function init() {
    if (settings.initFromStart) initAllButtons();

    document.querySelector(`.${settings.overlayClass}`).addEventListener('click', closeModal);
  }

  init();

  return {
    init,
  };
}());


export default modal;
