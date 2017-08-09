const home = {
  init: () => {
    constructor();
    initFacebookLike();
    initPromocoes();
    initMaisAcessados();
    initDestaqueCarousel();
    initBlog();
    initNewsletter();
    initGlobalRemover();
  },
};

const constructor = () => {
  body.addClass('mo-home');
  homeContainer = body.find('#meio');
  homeContainer.addClass('mo-home-container')
};

const initFacebookLike = () => {
  const facebookLink = homeContainer.find('a[href*="facebook.com/casada.construcao"]');
  const facebookContainer = facebookLink.parent();
  const facebookLikeAPI = `
    <div class="fb-like"
      data-href="https://www.facebook.com/casada.construcao.7"
      data-width="300px"
      data-layout="standard"
      data-action="like"
      data-show-faces="true"
      data-share="false"
    >
    </div>
  `

  facebookLink.remove();

  facebookContainer.addClass('mo-facebookLike-container')
  facebookContainer.append(facebookLikeAPI);
};

const initPromocoes = () => {
  const promoContainer = homeContainer.find('#capa-promocoes');
  const productContainer = promoContainer.find('a');
  const productImage = promoContainer.find('.cp-prod-foto');
  const promoHeader = '<div class="mo-home-header">Promoções</div>';
  let detailsWrapper = '<div class="mo-product-details-wrapper"/>';

  promoContainer.find('.mbc').remove();
  promoContainer.addClass('mo-promo-container');
  promoContainer.prepend(promoHeader);

  productContainer.addClass('mo-product-container clearfix');

  productImage.addClass('mo-product-image');
  productImage.after(detailsWrapper);

  detailsWrapper = promoContainer.find('.mo-product-details-wrapper');

  /* Move details into each wrapper */
  detailsWrapper.map((i, el) => {
    const currentWrapper = $(this);
    const detailElements = currentWrapper.nextAll();
    detailElements.map((i, el) => {
      var currentDetail = $(this);
      currentWrapper.append(currentDetail);
    });
  });
};

const initMaisAcessados = () => {
  const acessadosContainer = homeContainer.find('#mais_acessados');
  const productContainer = acessadosContainer.find('a');
  const productImage = acessadosContainer.find('.ma-prod-foto');
  const promoHeader = '<div class="mo-home-header">Mais Acessados</div>';
  let detailsWrapper = '<div class="mo-product-details-wrapper"/>';

  acessadosContainer.prev('.mbc').remove();

  acessadosContainer.addClass('mo-acessados-container');
  acessadosContainer.prepend(promoHeader);

  productContainer.addClass('mo-product-container clearfix');

  productImage.addClass('mo-product-image');
  productImage.after(detailsWrapper);

  detailsWrapper = acessadosContainer.find('.mo-product-details-wrapper');

  /* Move details into each wrapper */
  detailsWrapper.map((i, el) => {
    const currentWrapper = $(this);
    const detailElements = currentWrapper.nextAll();
    detailElements.map((i, el) => {
      const currentDetail = $(this);
      currentWrapper.append(currentDetail);
    });
  });
};

const initDestaqueCarousel = () => {
  const carouselContainer = homeContainer.find('#capa-destaque');
  /* Hide carousel to simplify information on homepage */
  carouselContainer.addClass('mo-hide');
};

const initBlog = () => {
  const blogContainer = homeContainer.find('#capa-blog-posts');
  const postContainer = blogContainer.find('.cb-post');
  const postTitle = postContainer.find('.cb-p-tit');
  const postPreview = postContainer.find('.cb-p-descr');
  const postButton = postContainer.find('.cb-p-lm');
  const blogHeader = '<div class="mo-home-header">Blog Casa da Construção</div>';

  body.find('#capa-blog').remove();

  blogContainer.prepend(blogHeader);

  blogContainer.addClass('mo-blog-container');
  postContainer.addClass('mo-post-container')
  postTitle.addClass('mo-post-title');
  postPreview.addClass('mo-post-preview');
  postButton.addClass('mo-post-button');
};

const initNewsletter = () => {
  const newsletterContainer = homeContainer.find('#capa-cadastro');
  const newsletterInput = newsletterContainer.find('#cademail');
  const newsletterButton = newsletterContainer.find('a');
  const newsletterHeader = '<div class="mo-home-header">Receba as novidades da Casa</div>';
  let newsletterWrapper = '<div class="mo-newsletter-wrapper"/>';

  newsletterContainer.addClass('mo-newsletter-container');
  newsletterInput.addClass('mo-newsletter-input');
  newsletterButton.addClass('mo-newsletter-button fa fa-paper-plane');

  newsletterButton.removeAttr('href');

  newsletterInput.attr('placeholder', 'Email');

  newsletterContainer.prepend(newsletterWrapper);

  newsletterWrapper = newsletterContainer.find('.mo-newsletter-wrapper');

  var newsletterElements = newsletterWrapper.nextAll();

  newsletterElements.map(function(i, el) {
    var currentElement = $(this);
    newsletterWrapper.append(currentElement);
  });

  newsletterContainer.prepend(newsletterHeader);
};

const initGlobalRemover = () => {
  const capaGrupo = homeContainer.find('#capa-grupo');
  const imageLinksContainer = homeContainer.find('#col-dir');

  capaGrupo.remove();
  imageLinksContainer.remove();
}

module.exports = home;
