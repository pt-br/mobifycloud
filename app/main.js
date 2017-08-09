const coreFunctions = require('./scripts/coreFunctions.js');
const customFunctions = require('./scripts/customFunctions.js');
const keepJS = require('./scripts/keepJS.js');
const mapping = require('./scripts/mapping.js')
const perfectProxy = require('./scripts/perfectProxy.js');

/* Site specific */
const header = require('./scripts/sections/header.js');
const footer = require('./scripts/sections/footer.js')

function mobify(callback, data, mappingUrl, contentType, environment) {

  /* Global DOM variables */
  html = $('html');
  body = $('body');
  head = $('head');

  /* Import perfect proxy checker */
  const isPerfectProxy = perfectProxy(mappingUrl) || false;

  if (!isPerfectProxy) {

    /* Keep necessary JS files */
    keepJS();

    /* Core functions execution */
    coreFunctions.removeAllStyles();
    coreFunctions.removeJS();
    coreFunctions.removeHtmlComments();
    coreFunctions.setBodyEnvironment(environment);
    coreFunctions.rewriteLinks();
    coreFunctions.mobileMetaTag();
    coreFunctions.insertVendorScripts();
    coreFunctions.insertMainJS();
    coreFunctions.insertMainStyle();

    /* Custom functions execution */
    customFunctions.includeFacebookAPI();

    /* Init common sections */
    header.init();
    footer.init();

    /* Exec mappings */
    mapping(mappingUrl);

    customFunctions.hideCarouselIfNotHome();

    /* Output final content */
    const finalHtml = $('html').toString();
    callback(null, finalHtml);
  } else {
    /* Perfect proxy page */

    /* Core functions execution */
    coreFunctions.rewriteLinks();

    const finalHtml = $('html').toString();
    callback(null, finalHtml);
  }
};

module.exports = mobify;
