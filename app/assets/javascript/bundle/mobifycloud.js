/* All scripts here will be compiled into mobifycloud.js */
jQuery(document).ready(function() {
  /* Variable declarations */
  var menuButton = jQuery('.mo-menu-button');
  var siteMask = jQuery('.mo-site-mask');
  var carouselContainer = jQuery('.mo-header-carousel-scroll');

  /* Event declarations */
  menuButton.on('click', function() {
    handleMenu();
  });

  siteMask.on('click', function() {
    handleMenu();
  });

  carouselContainer.DOMNodeAppear(function() {
    carouselContainer.css('transform', 'translate3d(0px, 0px, 0px)');
  });

  /* Function declarations */
  function handleMenu() {
    var siteContainer = jQuery('.mo-site-wrap');
    var siteMask = jQuery('.mo-site-mask');
    var menuContainer = jQuery('.mo-menu-container ');
    if( !siteContainer.hasClass('mo-nav-opened') ) {
      siteContainer.addClass('mo-nav-opened');
      siteMask.addClass('active');
      menuContainer.addClass('active');
    } else {
      siteContainer.removeClass('mo-nav-opened');
      siteMask.removeClass('active');
      setTimeout(function() {
        menuContainer.removeClass('active');
      }, 200);

    }
  }
});

