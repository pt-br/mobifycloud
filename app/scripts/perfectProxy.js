const router = require('./router');

function perfectProxy(mappingUrl) {
  const pageTypes = [];

 /* Perfect proxy URLs here */
  pageTypes.push(
    {
      type: "lojas",
      url: /lojas/g
    }
  );

  /* Router will catch perfect proxied pages */
  const isPerfectProxy = router(pageTypes, mappingUrl, 'perfect_proxy');
  return isPerfectProxy;
};

module.exports = perfectProxy;
