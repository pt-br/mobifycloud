const express = require('express');
const app = express();
const sassMiddleware = require('node-sass-middleware');
const http = require('follow-redirects').http;
const https = require('follow-redirects').https;
const path = require('path');

const jsCompiler = require('./jsCompiler');
const hostUtils = require('./core/hostUtils');
const hostCleaner = require('./core/hostCleaner');
const generateSpriteSheet = require('./core/generateSpriteSheet');
const trafficManager = require('./core/trafficManager');

/* Hosts section */
hostCleaner(hostUtils.cleanupHosts); // Watch for server changes and hosts restoring
hostUtils.getRoutes();
const routesEndpoint = hostUtils.getRoutesEndpoint();
const routeHost = hostUtils.getRoutesHost();

app.use(sassMiddleware({
  /* Options */
  src: path.join(__dirname, '/app/assets/stylesheets'),
  dest: `${__dirname}/app/assets/stylesheets/css`,
  debug: true,
  force: true,
  outputStyle: 'nested',
  prefix:  '/styles'  // Where prefix is at <link rel="stylesheets" href="styles/style.css"/>
}));

app.use('/vendor', express.static(`${__dirname}/app/assets/javascript/vendor`));
app.use('/sprites', express.static(`${__dirname}/app/assets/images/sprites`));
app.use('/fonts', express.static(`${__dirname}/app/assets/fonts`));
app.use('/scripts', express.static(`${__dirname}/app/assets/javascript/bundle`));
app.use(express.static(path.join(__dirname, '/app/assets/stylesheets/css')));

trafficManager.proxify(app, routesEndpoint);

const httpServer = http.createServer(app);
const httpPort = process.env.PORT || 80;
httpServer.listen(httpPort, function() {
  generateSpriteSheet();
  hostUtils.updateHostFile();
  jsCompiler();
  console.log(`Access your project on: ${routeHost}`);
});
