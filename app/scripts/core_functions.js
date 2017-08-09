/**
 * These are the core functions of the application
 * Do not create custom functions on this file, use custom_functions.js instead.
 */

removeAllStyles = function() {
  html.find('link[rel="stylesheet"], style').remove();
}

removeJS = function() {
  html.find("script").each(function(i, elem) {
    if (!($(this).attr("data-keep") || $(this).attr("data-keep") === 'false')) {
      $(this).remove();
    }
  });
}

insertVendorScripts = function() {
  /* TODO: Optimize this, read all files from /vendor folder */
  head.append('<script src="//' + hostPath + '/vendor/jquery-2.1.3.js"></script>');
  head.append('<script src="//' + hostPath + '/vendor/jquery.DOMNodeAppear.js"></script>');
  head.append('<script src="//' + hostPath + '/vendor/uranium.js"></script>');
}

insertMainJS = function() {
  head.append('<script src="//' + hostPath + '/scripts/mobifycloud.js"></script>');
}

insertMainStyle = function() {
  head.append('<link rel="stylesheet" href="//' + hostPath + '/styles/style.css">');
}

setBodyEnvironment = function(environment) {
  body.attr('data-environment', environment);
}

absolutizeSrcs = function() {
  html.find('img, script').attr('src', function(i, attr) {
      return attr ? exports.absolutize(attr) : null;
  });
}

absolutize = function(href) {
  href = href.trim();
  if (/^(?![a-zA-Z]+:)(?!\/\/)(?!$)/.test(href)) {
      return '//' + env.source_host + (href[0] === '/' ? '' : exports.slashPath()) + href;
  }
  return href;
}

rewriteLinks = function() {
  html.find('a, head base[href]').attr('href', function(_, attr) {
      return attr ? rewriteLink(attr) : null;
  });
  html.find('form').attr('action', function(_, attr) {
      return attr ? rewriteLink(attr) : null;
  });
}

rewriteLink = function(link) {
  link = link.trim();
  if (/^mailto:/.test(link)) {
      return link;
  }
  return link.replace(/((?:(?:(?:http(?:s?)):)?(?:\/\/)?(?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]*)(?:\.[\.a-zA-Z0-9\-]*)|localhost))(?:\:[0-9]+)?)/, function(originalUrl) {
      var rewritten = rewriterCore(originalUrl);
      return rewritten;
  });
}

rewriterCore = function (originalUrl) {
  var untouchedUrl = originalUrl
  var isHttp, isHttps = false
  var httpRegex = new RegExp('http://', 'gi');
  var httpsRegex = new RegExp('http://', 'gi');
  var hostOriginRegex = new RegExp('^' + hostOrigin, 'gi');

  originalUrl.match(httpRegex) ? isHttp = true : null;
  originalUrl.match(httpsRegex) ? isHttps = true : null;

  originalUrl = originalUrl.replace(/www\./, '')
                 .replace(httpRegex, '')
                 .replace(httpsRegex, '');

  // console.log("HOST PATH: " + hostPath);
  // console.log("PROXIED DOMAIN: " + hostOrigin);
  // console.log("HOST VAR: " + hostVar);
  // console.log("ORIGINAL LINK: " + originalUrl);

  if ( hostPath.match(/\//g) ) {

  }

  if ( originalUrl.match(hostOriginRegex) ) {
    originalUrl = isHttps ? '//' + hostPath : '//' + hostPath;
    // console.log("HOST PATH: " + hostPath);
    // console.log("ORIGINAL LINK: " + originalUrl);
    // console.log("FINAL LINK: " + originalUrl);
    return originalUrl;
  } else {
    //console.log("UNTOUCHED LINK: " + untouchedUrl);
    return untouchedUrl;
  }
}

mobileMetaTag = function() {
  head.append('<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">');
}

removeHtmlComments = function() {
  function isComment(index, node) {
    return node.type === 'comment'
  }
  $.root().contents().filter(isComment).remove();
  head.contents().filter(isComment).remove();
  body.contents().filter(isComment).remove();
}

module.exports = {
  removeAllStyles: removeAllStyles,
  removeJS: removeJS,
  insertVendorScripts: insertVendorScripts,
  insertMainStyle: insertMainStyle,
  insertMainJS: insertMainJS,
  removeHtmlComments: removeHtmlComments,
  setBodyEnvironment: setBodyEnvironment,
  mobileMetaTag: mobileMetaTag,
  rewriteLinks: rewriteLinks
};
