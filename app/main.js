const perfectProxy = require('./scripts/perfectProxy.js');
const keepJS = require('./scripts/keepJS.js');
const coreFunctions = require('./scripts/coreFunctions.js')

function mobify(callback, data, mappingUrl, contentType, environment) {

  /* Global DOM variables */
  html = $('html');
  body = $('body');
  head = $('head');

  /* Import perfect proxy checker */
  const isPerfectProxy = perfectProxy(mappingUrl) || false;

  if (!isPerfectProxy) {

    /* Remove or keep script files */
    keepJS();

    /* Import core/custom functions */
    // require('./scripts/core_functions.js');
    require('./scripts/custom_functions.js');

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
    includeFacebookAPI();

    /* Import common sections */
    require('./scripts/sections/header.js')();
    require('./scripts/sections/footer.js')();

    /* Import mappings */
    require('./scripts/mapping.js')(mappingUrl);

    hideCarouselIfNotHome();

    /* Output final content */
    finalHtml = $('html').toString();
    callback(null, finalHtml);
  } else {
    /* Perfect proxy page */

    /* Import core functions */
    require('./scripts/core_functions.js');

    rewriteLinks();

    finalHtml = $('html').toString();
    callback(null, finalHtml);
  }
};

module.exports = mobify;
