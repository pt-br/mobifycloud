function router(pageTypes, mappingUrl, mode) {
  if (mode === 'mapping') {
    for (let i = 0; i < pageTypes.length; i++) {
      const url = pageTypes[i].url;
      if (mappingUrl.match(url) ) {
        // import all files associated with this pageInfo mapping
        const filepath = pageTypes[i].appFile[0];
        console.log(`[Router] -->  Importing page file: ${filepath}`);
        const page = require(filepath);
        page.init();
      } else {
        /* No mapping found */
      }
    }
  } else {
    for (let i = 0; i < pageTypes.length; i++) {
      const url = pageTypes[i].url;
      if (mappingUrl.match(url)) {
        console.log(`[Router] --> Perfect proxy for ${mappingUrl}`);
        return true;
      } else {
        /* No mapping found */
      }
    }
  }
};

module.exports = router;
