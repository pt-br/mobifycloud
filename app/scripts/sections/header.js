const header = {
  init: () => {
    constructor();
    initSearch();
    initMenu();
    initCarousel();
  },
};

const constructor = () => {
  headerContainer = body.find('#top').first();
  const headerLogo = headerContainer.find('#top-content-logo');

  headerContainer.addClass('mo-header-container');
  headerLogo.before('<div class="mo-menu-button fa fa-bars fa-2x"/>');
}

const initSearch = () => {
  const searchContainer = body.find('#fmbusca');
  const searchInput = searchContainer.find('#fm-q');
  const searchButton = searchContainer.find('#btn-buscar');

  searchContainer.addClass('mo-search-container');

  searchInput.addClass('mo-search-input');
  searchInput.attr('placeholder', 'Procurando algo?');

  searchButton.addClass('mo-search-button fa fa-search');
  searchButton.removeAttr('href');
}

const initMenu = () => {
  const menuContent = body.find('#menu-content');
  const menuMapLinksContainer = menuContent.find('#Map');
  const menuMapLinks = menuContent.find('area');

  menuMapLinksContainer.prepend('<ul class="mo-menu-container"/>');
  const menuContainer = menuMapLinksContainer.find('.mo-menu-container');

  /* Turn area into <a> elements */
  menuMapLinks.map(function(i, el) {
    const currentMap = $(this);
    const altText = currentMap.attr('alt');
    const href = currentMap.attr('href');
    const linkContainer = $('<li class="mo-menu-item"/>');

    currentMap.before(linkContainer);

    const currentLinkContainer = currentMap.prev('li');
    currentLinkContainer.append(currentMap);

    /* Move current link */
    menuContainer.append(currentLinkContainer);
    currentMap.replaceWith(`<a href="${href}">${altText}</a>`);
  })

  menuContent.prepend(menuContainer);
  menuContent.children('img').addClass('mo-hide');

  body.prepend('<div class="mo-site-wrap"/>');
  const siteContainer = body.find('.mo-site-wrap');
  const siteElements = siteContainer.nextAll();

  siteElements.map(function(i, el) {
    const currentElement = $(this);
    siteContainer.append(currentElement);
  })

  siteContainer.prepend('<div class="mo-site-mask"/>')

  body.prepend(menuContainer);
}

const initCarousel = () => {
  const carouselContainer = body.find('.ws_images');
  const carouselScroll = carouselContainer.find('ul');
  const carouselItem = carouselScroll.find('li');
  const carouselImage = carouselItem.find('img');
  const wowSliderText = body.find('.ws_script');

  wowSliderText.remove();

  carouselImage.map(function(i, el) {
    const currentImage = $(this);
    const currentSrc = currentImage.attr('src');
    const currentParent = currentImage.parents('li');

    currentParent.css('background', `url(${currentSrc})`);
    currentImage.remove();
  });

  carouselItem.find('a').remove();

  carouselContainer.addClass('mo-header-carousel-container');
  carouselContainer.attr('data-ur-set', 'carousel');
  carouselContainer.attr('data-ur-fill', '1');
  carouselContainer.attr('data-ur-infinite', 'enabled');
  carouselContainer.attr('data-ur-autoscroll', 'enabled');

  carouselScroll.addClass('mo-header-carousel-scroll');
  carouselScroll.attr('data-ur-carousel-component', 'scroll_container');

  carouselItem.addClass('mo-header-carousel-item');
  carouselItem.attr('data-ur-carousel-component', 'item');
}

module.exports = header;