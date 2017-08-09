const router = require('./router');

function mapping(mappingUrl) {
  const pageTypes = [];

 /* Map URLs here */
  pageTypes.push(
    {
      type: "home",
      url: /(index|^\/$|^\/\?)/gi,
      appFile: ["./pages/home/home.js"]
    },
    {
      type: "pdp",
      url: /produto\-/gi,
      appFile: ["./pages/browse/pdp.js"]
    },
    {
      type: "404",
      url: /menu/g,
      appFile: ["./pages/browse/menu.js"]
    },
    {
      type: "checkout",
      url: /checkout/g,
      appFile: ["./pages/checkout/checkout.js"]
    },
  );

  /* Router will import a file according to mapping */
  router(pageTypes, mappingUrl, 'mapping');
};

module.exports = mapping;