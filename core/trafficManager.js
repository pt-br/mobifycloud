const cheerio = require('cheerio');
const proxy = require('express-http-proxy');
const mobify = require('../app/main.js');

hostOrigin = '';
hostPath = '';
hostVar = '';
environment = '';

const proxyOptions = {
  preIntercept: res => {
    // If we must preIntercept something
    //console.log(res.fetchedUrls);
  },

  decorateRequest: req => {
    req.headers[ 'Accept-Encoding' ] = 'utf8';
    delete req.headers['if-modified-since'];
    delete req.headers['if-none-match'];
    return req;
  },

  intercept: (rsp, data, req, res, callback) => {
    let contentType = res._headers['content-type'];
    let mappingUrl = req.originalUrl;

    // hostPath = req.headers['referer'];
    // console.log('loganderson ' + hostPath)

    if (contentType) {
      if (contentType.match(/html/g)) {
        if (typeof req.headers['referer'] === 'string') {
          hostPath = req.headers['referer'];
          //console.log('Host REFER: ', hostPath);
        } else {
          hostPath = req.headers['host'];
          //console.log('Host Without refer: ', hostPath);
        }

        hostPath = hostPath.replace(/^https\:\/\//g, '')
          .replace(/^http\:\/\//g, '')
          .replace(/(\/.*)/g, '');

        /* Convert data into UTF-8 String */
        data = data.toString('utf8');

        /* Load Html into Cheerio to be our manageable DOM */
        $ = cheerio.load(data, { decodeEntities: false });

        /* Verify Redirect from Casa da Construção and manually rewrite it */
        if (data.match(/window\.location\.assign\(\"guaiba\/index\.php\"\)/gi)) {
          data = data.replace(/\index\.php/gi, 'index.php?id_loja=4');
        }

        /* Verify if contains <html> */
        if (data.match(/\<html/gi)) {
          // Start App core module
          mobify(callback, data, mappingUrl, contentType, environment);
        } else {
          callback(null, data);
        }
      } else {
        callback(null, data);
      }
    }
  }
}

const trafficManager = {
  proxify: (app, siteDomains) => {
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      // intercept OPTIONS method
      if ('OPTIONS' === req.method) {
        res.sendStatus(200);
      }

      /* Proxy Router */
      hostOrigin = req.headers['host'];

      /* Verify if Development */
      if (hostOrigin.match(/mlocal/g)) { //mlocal.konsole.studio
        environment = 'development';
        hostVar = 'mlocal.';
        hostOrigin = hostOrigin.replace(/\mlocal\./g, ''); //konsole.studio
      }
      /* Verify if Heroku*/
      else if (hostOrigin.match(/herokuapp/g)) { //appft-konsole-studio.herokuapp.com
        environment = 'heroku';
        hostVar = 'appft-';
        hostOrigin = hostOrigin.replace(/\.herokuapp\.com/gi, '') //appft-konsole-studio
          .replace(/appft\-stage\-/gi, '') //konsole-studio
          .replace(/appft\-/gi, '')
          .replace(/\-/gi, '.'); //konsole.studio
      }
      /* Verify if Digital Ocean */
      else if (hostOrigin.match(/first\-touch/g)) { //pampaburger.com.br.first-touch.site
        environment = 'digital-ocean';
        hostVar = 'm.';
        hostOrigin = hostOrigin.replace(/\.first\-touch\.site/gi, '') //pampaburger.com.br
      }
      /* Verify if Stage */
      else if (hostOrigin.match(/mstage\./g)) { //mstage.konsole.studio
        environment = 'stage';
        hostVar = 'mstage.';
        hostOrigin = hostOrigin.replace(/\mstage\./g, ''); //konsole.studio
      }
      /* Verify if Production */
      else if (hostOrigin.match(/(m\.|mobile\.)/g)) { //m.konsole.studio / mobile.konsole.studio
        environment = 'production';
        if ( hostOrigin.match(/m\./g) ) {
          hostVar = 'm.';
        } else {
          hostVar = 'mobile.';
        }
        hostOrigin = hostOrigin.replace(/(\m\.|mobile\.)/g, ''); //konsole.studio
      }

      for (let i = 0; i < siteDomains.length; i++) {
        let hostOriginRegExp = new RegExp('^' + hostOrigin, 'gi');
        let currentEndpoint = siteDomains[i];
        // console.log('CURRENT HOST ORIGIN: ' + hostOrigin);
        // console.log('CURRENT MATCHING ENDPOINT:' + currentEndpoint);
        if (currentEndpoint.match(hostOriginRegExp)) { // konsole.studio == konsole.studio
          //console.log('[Proxy] Incoming path: ' + currentEndpoint);
          proxyInstance = proxy(currentEndpoint, proxyOptions);
          proxyInstance(req, res, next);
        }
      }
    });
  },
}

module.exports = trafficManager;