const modal = (function () {
  const settings = {
    initFromStart: true,
    animationName: 'md-modal--effect-1',
    modalClass: 'md-modal',
    bodyClass: 'md-modal--open',
    showModalClass: 'md-modal--show',
    overlayClass: 'md-modal__overlay',
    triggerButtonData: 'data-md-modal',
    triggerBtnDataset: 'mdModal',
    closeBtn: 'md-modal__btn-close',
  };

  function removeOverlay() {
    document.querySelectorAll(`.${settings.overlayClass}`).forEach(overlay => {
      overlay.parentNode.removeChild(overlay);
    });
  }

  function addOverlay() {
    removeOverlay();
    const existingOverlay = document.querySelector(`.${settings.overlayClass}`);
    const overlay = document.createElement('div');
    overlay.classList.add(settings.overlayClass);
    document.body.appendChild(overlay);
  }

  function openModal(modalId) {
    const modalElement = document.getElementById(modalId);
    if (!modalId) return false;
    
    modalElement.classList.add(settings.showModalClass);
    document.body.classList.add(settings.bodyClass);
    modalElement.style.display = 'block';
    setTimeout(() => {
      modalElement.classList.add(settings.animationName);
      addOverlay();
    }, 50);
  }

  function onClickOpen() {
    const modalId = this.dataset[settings.triggerBtnDataset];
    openModal(modalId);
  }

  function initAllButtons() {
    const buttons = document.querySelectorAll(`[${settings.triggerButtonData}]`);
    buttons.forEach(btn => {
      btn.addEventListener('click', onClickOpen);
    });
  }

  function closeModal() {
    const visibleModal = document.querySelector(`.${settings.showModalClass}`);
    if (!visibleModal) return false;

    visibleModal.classList.remove(settings.showModalClass);
    document.body.classList.remove(settings.bodyClass);
    visibleModal.classList.remove(settings.animationName);
  
    setTimeout(() => {
      visibleModal.style.display = 'none';
      removeOverlay();  
    }, 300);
  }

  function clickModalContent(e) {   
    if (this === e.target) {
      closeModal();
    }
  }

  function init() {
    if (settings.initFromStart) initAllButtons();

    document.querySelectorAll(`.${settings.closeBtn}`).forEach(button => {
      button.addEventListener('click', closeModal);
    });

    document.querySelectorAll('.md-modal').forEach(modalElement => {
      modalElement.addEventListener('click', clickModalContent);
    });
  }

  init();

  return {
    init,
    closeModal,
    openModal,
    onClickOpen,
  };
}());


export default modal;
