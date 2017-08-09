const fs = require('fs');
const domain = require('domain');
const url_map = require('../url_map.json');

const d = domain.create();
/* Site Route */
let routes = [];
let routesEndpoint = [];
let routesHost = [];

let originalHosts = '';

let hostOrigin = '';
let hostPath = '';
let hostVar = '';
let environment = '';

d.on('error', function(err) {
  console.error(err);
});

const hostUtils = {
  updateHostFile: function() {
    fs.readFile('/etc/hosts', 'utf8', function (err, hostsContent) {
      if (err) {
        return console.log(err);
      }

      const originalHosts = hostsContent;

      let newHostsContent = hostsContent + '\n# MobifyCloud Development Hosts:';
      for (let i = 0; i < routesHost.length; i++) {
        newHostsContent = newHostsContent + '\n' + '127.0.0.1' + '\t' + routesHost[i];
      }

      /* Verify if writeFile is successful to avoid Heroku issues */
      d.run(function() {
        fs.writeFile('/etc/hosts', newHostsContent, function (err) {
          if (err) throw err;
        });
      });
    });
  },
  getRoutes: function() {
    let urlRoutesLength = JSON.stringify(url_map.route.length);
    for (let i = 0; i < urlRoutesLength; i++) {
      routes.push(JSON.stringify(url_map.route[i]));
    }
  },
  cleanupHosts: function() {
    console.log('Restoring original /etc/hosts file...');
    fs.writeFileSync('/etc/hosts', originalHosts);
  },
  getRoutesEndpoint: function() {
    for (let i = 0; i < routes.length; i++) {
      routesEndpoint.push(routes[i].split('=> ')[1].replace('\"', ''));
      return routesEndpoint;
    }
  },
  getRoutesHost: function() {
    for (let i = 0; i < routes.length; i++) {
      routesHost.push(routes[i].split('=> ')[0].replace('\"', ''));
      return routesHost[0];
    }
  },
}

module.exports = hostUtils;