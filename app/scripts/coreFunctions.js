/**
 * These are the core functions of the application
 * Do not create custom functions on this file, use custom_functions.js instead.
 */

const rewriterCore = originalUrl => {
  let isHttp, isHttps = false
  const untouchedUrl = originalUrl
  const httpRegex = new RegExp('http://', 'gi');
  const httpsRegex = new RegExp('http://', 'gi');
  const hostOriginRegex = new RegExp(`^${hostOrigin}`, 'gi');

  originalUrl.match(httpRegex) ? isHttp = true : null;
  originalUrl.match(httpsRegex) ? isHttps = true : null;

  originalUrl = originalUrl.replace(/www\./, '')
    .replace(httpRegex, '')
    .replace(httpsRegex, '');

  // console.log("HOST PATH: " + hostPath);
  // console.log("PROXIED DOMAIN: " + hostOrigin);
  // console.log("HOST VAR: " + hostVar);
  // console.log("ORIGINAL LINK: " + originalUrl);

  if (hostPath.match(/\//g)) {}

  if (originalUrl.match(hostOriginRegex)) {
    originalUrl = isHttps ? `//${hostPath}` : `//${hostPath}`;
    // console.log("HOST PATH: " + hostPath);
    // console.log("ORIGINAL LINK: " + originalUrl);
    // console.log("FINAL LINK: " + originalUrl);
    return originalUrl;
  } else {
    //console.log("UNTOUCHED LINK: " + untouchedUrl);
    return untouchedUrl;
  }
}

const rewriteLink = link => {
  link = link.trim();
  if (/^mailto:/.test(link)) {
    return link;
  }
  return link.replace(/((?:(?:(?:http(?:s?)):)?(?:\/\/)?(?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]*)(?:\.[\.a-zA-Z0-9\-]*)|localhost))(?:\:[0-9]+)?)/, function(originalUrl) {
    const rewritten = rewriterCore(originalUrl);
    return rewritten;
  });
}

const absolutize = href => {
  href = href.trim();
  if (/^(?![a-zA-Z]+:)(?!\/\/)(?!$)/.test(href)) {
      return '//' + env.source_host + (href[0] === '/' ? '' : exports.slashPath()) + href;
  }
  return href;
}

const coreFunctions = {
  removeAllStyles: () => {
    html.find('link[rel="stylesheet"], style').remove();
  },

  removeJS: () => {
    html.find('script').each((i, elem) => {
      if (!($(elem).attr('data-keep') || $(elem).attr('data-keep') === 'false')) {
        $(elem).remove();
      }
    });
  },

  insertVendorScripts: () => {
    /* TODO: Optimize this, read all files from /vendor folder */
    head.append(`<script src="//${hostPath}/vendor/jquery-2.1.3.min.js"></script>`);
    head.append(`<script src="//${hostPath}/vendor/jquery.DOMNodeAppear.js"></script>`);
    head.append(`<script src="//${hostPath}/vendor/uranium.min.js"></script>`);
  },

  insertMainJS: () => {
    head.append(`<script src="//${hostPath}/scripts/mobifycloud.js"></script>`);
  },

  insertMainStyle: () => {
    head.append(`<link rel="stylesheet" href="//${hostPath}/styles/style.css">`);
  },

  setBodyEnvironment: environment => {
    body.attr('data-environment', environment);
  },

  absolutizeSrcs: () => {
    html.find('img, script').attr('src', (i, attr) => {
      return attr ? absolutize(attr) : null;
    });
  },

  rewriteLinks: () => {
    html.find('a, head base[href]').attr('href', (_, attr) => {
      return attr ? rewriteLink(attr) : null;
    });
    html.find('form').attr('action', (_, attr) => {
      return attr ? rewriteLink(attr) : null;
    });
  },

  mobileMetaTag: () => {
    head.append('<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">');
  },

  removeHtmlComments: () => {
    $.root().contents().filter((index, node) => node.type === 'comment').remove();
    head.contents().filter((index, node) => node.type === 'comment').remove();
    body.contents().filter((index, node) => node.type === 'comment').remove();
  }
}

module.exports = coreFunctions;
