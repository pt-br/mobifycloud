const footer = {
  init: () => {
    constructor();
  },
};

constructor = () => {
  const footerContainer = body.find('#footer');
  const footerContent = footerContainer.find('#footer-menu');

  footerContainer.addClass('mo-footer');
  footerContent.addClass('mo-footer-content');

  const desktopHost = footerContent.find('div');
  desktopHost.remove();
}

module.exports = footer;