/* All functions here will be available on index.js */
const customFunctions = {
  includeFacebookAPI: () => {
    const facebookAPI = `
      <div id="fb-root"></div>
      <script>(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = "//connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v2.7";fjs.parentNode.insertBefore(js, fjs);}(document, "script", "facebook-jssdk"));</script>
    `;
    body.prepend(facebookAPI);
  },

  hideCarouselIfNotHome: () => {
    if (!body.hasClass('mo-home')) {
      const carouselContainer = body.find('.mo-header-carousel-container');
      carouselContainer.addClass('mo-hide');
    }
  },
}

module.exports = customFunctions;
