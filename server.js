var express = require('express');
var app = express();
cheerio = require('cheerio');

var sassMiddleware = require('node-sass-middleware');
var sizeOf = require('image-size');

var http = require('follow-redirects').http;
var https = require('follow-redirects').https;

proxy = require('express-http-proxy');

var domain = require('domain');
var d = domain.create();

fs = require('fs');
var path = require('path');

var cleanup = require('./cleanup').Cleanup(cleanupHosts);
var url_map = require('./url_map.json');

d.on('error', function(err) {
  console.error(err);
});

/* Site Route */
var routes = [];
var routesEndpoint = [];
var routesHost = [];

var originalHosts = '';

hostOrigin = '';
hostPath = '';
hostVar = '';
environment = '';

getRoutes();
getRoutesEndpoint();
getRoutesHost();

/* Site routes */
function getRoutes() {
  var urlRoutesLength = JSON.stringify(url_map.route.length);
  for( var i = 0; i < urlRoutesLength; i++ ) {
    routes.push(JSON.stringify(url_map.route[i]));
  }
}

function getRoutesEndpoint() {
  //routeEndpoint = routes[0].split('=> ')[1].replace('\"', '');
  for( var i = 0; i < routes.length; i++ ) {
    routesEndpoint.push(routes[i].split('=> ')[1].replace('\"', ''));
  }
}

function getRoutesHost() {
  //routeHost = routes[0].split('=> ')[0].replace('\"', '');
  for( var i = 0; i < routes.length; i++ ) {
    routesHost.push(routes[i].split('=> ')[0].replace('\"', ''));
  }
}

function updateHostFile() {
  fs.readFile('/etc/hosts', 'utf8', function (err, hostsContent) {
    if (err) {
      return console.log(err);
    }

    originalHosts = hostsContent;

    newHostsContent = hostsContent + '\n# MobifyCloud Development Hosts:';
    //newHostsContent = newHostsContent + '\n' + '127.0.0.1' + '\t' + routeHost;
    for( var i = 0; i < routesHost.length; i++ ) {
      newHostsContent = newHostsContent + '\n' + '127.0.0.1' + '\t' + routesHost[i];
    }

    /* Verify if writeFile is successful to avoid Heroku issues */
    d.run(function() {
      fs.writeFile('/etc/hosts', newHostsContent, function (err) {
        if (err) throw err;
      });
    });
  });
}

function cleanupHosts() {
  console.log('Restoring original /etc/hosts file...');
    fs.writeFileSync('/etc/hosts', originalHosts);
};

 /**
  * Thanks to @williammustaffa for this compiler.
  * Original src: https://github.com/williammustaffa/jGame.js/blob/master/compile.js
  *
  */
function compileJS() {
  // Project src
  var srcDir = "./app/assets/javascript/"
  var entryPoint = srcDir + "main.js";
  // regex to serach @include("file"); declarations
  var searchRegex = /include\(\"[^\)]*\"\)/;
  // Parse entry point
  var content = parseInclude(entryPoint);
  // write the parsed/replaced content into a single file
  fs.writeFileSync("./app/assets/javascript/bundle/monifycloud.js", content);

  /**
   *  Replaces all @include("file") declarations with file content
   *
   * @param {String} file src
   * @returns {String} File content with "includes" content
   */
  function parseInclude(src) {
    var content = fs.readFileSync(src, "utf8");
    // verify all include declarations and replace with file content
    while((searchResult = searchRegex.exec(content))) {
      content = content.replace(';', '');
      var includeDeclaration = searchResult[0];
      // get included file path
      var includePath = getPath(includeDeclaration);
      // parse include declaration content
      var includeContent = parseInclude(includePath);
      // replace include with file content
      content = content.replace(includeDeclaration, includeContent);
    }
    return content;
  }

  /**
   * Retrive the include declaration file path
   *
   * @param {String} include declaration like @include("test.js")
   * @returns {String} path
   */
  function getPath(include) {
    return srcDir + include.replace(/include\(\"|\"\)/g, "");
  }

  function insertFileInfo(src, content) {
    var prefix = "/* >> " + src + " START */",
        sufix = "/* << " + src + " END */";
    //
    return  prefix + "\n" + content + "\n" + sufix;
  }
  console.log("JS assets compiled into -> app/assets/javascript/mobifycloud.js");
}

function generateSpriteSheet() {
  var spritesLocation = path.join(__dirname, './app/assets/images/sprites/');
  var spritesheetFile = path.join(__dirname, './app/assets/stylesheets/sprites/sprites.scss');
  var spriteBackgroundLocation = '/sprites/';
  var spriteSheetContent = '';
  var classTemplate = '.$CLASS_NAME {\n' +
                     '  background: url(\'' + spriteBackgroundLocation + '$IMAGE_NAME\') no-repeat;\n' +
                     '  width: $IMAGE_WIDTHpx;\n' +
                     '  height: $IMAGE_HEIGHTpx;\n' +
                     '  display: inline-block;\n' +
                     '}\n';

  var spriteFiles = fs.readdirSync(spritesLocation);
  for( var i=0; i < spriteFiles.length; i++ ) {
    var spriteFile = spriteFiles[i];
    var spriteName = spriteFile.replace(/\..*/gi, '');
    var dimensions = sizeOf(spritesLocation + spriteFile);
    spriteWidth = dimensions.width;
    spriteHeigth = dimensions.height;
    var spriteSheetMessage = '/* This file is auto generated. Your changes do not have any effect. */\n';
    var newSpriteClass = classTemplate.replace(/\$CLASS_NAME/g, 'sprite-' + spriteName)
                                      .replace(/\$IMAGE_NAME/g, spriteFile)
                                      .replace(/\$IMAGE_WIDTH/g, spriteWidth)
                                      .replace(/\$IMAGE_HEIGHT/g, spriteHeigth);

    spriteSheetContent = spriteSheetContent + newSpriteClass;
  }

  spriteSheetContent = spriteSheetMessage + spriteSheetContent;

  /* Export sprites.scss file */
  fs.writeFileSync(spritesheetFile, spriteSheetContent);
}

app.use(sassMiddleware({
  /* Options */
  src: path.join(__dirname, '/app/assets/stylesheets'),
  dest: __dirname + '/app/assets/stylesheets/css',
  debug: true,
  force: true,
  outputStyle: 'nested',
  prefix:  '/styles'  // Where prefix is at <link rel="stylesheets" href="styles/style.css"/>
}));

app.use("/vendor", express.static(__dirname + '/app/assets/javascript/vendor'));
app.use("/sprites", express.static(__dirname + '/app/assets/images/sprites'));
app.use("/fonts", express.static(__dirname + '/app/assets/fonts'));
app.use("/scripts", express.static(__dirname + '/app/assets/javascript/bundle'));
app.use(express.static(path.join(__dirname, '/app/assets/stylesheets/css')));

/* Request handler */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // intercept OPTIONS method
  if( 'OPTIONS' == req.method ) {
    res.sendStatus(200);
  }

  /* Proxy Router */
  hostOrigin = req.headers['host'];

  /* Verify if Development */
  if ( hostOrigin.match(/mlocal/g) ) { //mlocal.konsole.studio
    environment = 'development';
    hostVar = 'mlocal.';
    hostOrigin = hostOrigin.replace(/\mlocal\./g, ''); //konsole.studio
  }
  /* Verify if Heroku*/
  else if( hostOrigin.match(/herokuapp/g) ) { //appft-konsole-studio.herokuapp.com
    environment = 'heroku';
    hostVar = 'appft-';
    hostOrigin = hostOrigin.replace(/\.herokuapp\.com/gi, '') //appft-konsole-studio
                           .replace(/appft\-stage\-/gi, '') //konsole-studio
                           .replace(/appft\-/gi, '')
                           .replace(/\-/gi, '.'); //konsole.studio
  }
  /* Verify if Digital Ocean */
  else if( hostOrigin.match(/first\-touch/g) ) { //pampaburger.com.br.first-touch.site
    environment = 'digital-ocean';
    hostVar = 'm.';
    hostOrigin = hostOrigin.replace(/\.first\-touch\.site/gi, '') //pampaburger.com.br
  }
  /* Verify if Stage */
  else if ( hostOrigin.match(/mstage\./g) ) { //mstage.konsole.studio
    environment = 'stage';
    hostVar = 'mstage.';
    hostOrigin = hostOrigin.replace(/\mstage\./g, ''); //konsole.studio
  }
  /* Verify if Production */
  else if ( hostOrigin.match(/(m\.|mobile\.)/g) ) { //m.konsole.studio / mobile.konsole.studio
    environment = 'production';
    if ( hostOrigin.match(/m\./g) ) {
      hostVar = 'm.';
    } else {
      hostVar = 'mobile.';
    }
    hostOrigin = hostOrigin.replace(/(\m\.|mobile\.)/g, ''); //konsole.studio
  }

  for( var i=0; i < routesEndpoint.length; i++ ) {
    var hostOriginRegExp = new RegExp('^' + hostOrigin, 'gi');
    var currentEndpoint = routesEndpoint[i];
    // console.log('CURRENT HOST ORIGIN: ' + hostOrigin);
    // console.log('CURRENT MATCHING ENDPOINT:' + currentEndpoint);
    if( currentEndpoint.match(hostOriginRegExp) ) { // konsole.studio == konsole.studio
      //console.log('[Proxy] Incoming path: ' + currentEndpoint);
      proxyInstance = proxy(currentEndpoint, proxyOptions);
      proxyInstance(req, res, next);
    }
  }
});

proxyOptions = {

  preIntercept: function(res) {
    // If we must preIntercept something
    //console.log(res.fetchedUrls);
  },

  decorateRequest: function(req) {
    req.headers[ 'Accept-Encoding' ] = 'utf8';
    delete req.headers['if-modified-since'];
    delete req.headers['if-none-match'];
    return req;
  },

  intercept: function(rsp, data, req, res, callback) {
    var contentType = res._headers['content-type'];
    var mappingUrl = req.originalUrl;

    // hostPath = req.headers['referer'];
    // console.log('loganderson ' + hostPath)

    if ( contentType ) {
      if( contentType.match(/html/g) ) {

        if( typeof req.headers['referer'] == 'string' ) {
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
        $ = cheerio.load(data, {decodeEntities: false});

        /* Verify Redirect from Casa da Construção and manually rewrite it */
        if( data.match(/window\.location\.assign\(\"guaiba\/index\.php\"\)/gi) ) {
          data = data.replace(/\index\.php/gi, 'index.php?id_loja=4');
        }

        /* Verify if contains <html> */
        if( data.match(/\<html/gi) ) {
          // Start App core module
          require('./app/main.js')(callback, data, mappingUrl, contentType, environment);
        } else {
          callback(null, data);
        }
      } else {
        callback(null, data);
      }
    }
  }
}

var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

var httpPort = process.env.PORT || 80;
httpServer.listen(httpPort, function() {
  generateSpriteSheet();
  updateHostFile();
  compileJS();
  console.log('Access your project on: ' + routesHost[0]);
});
