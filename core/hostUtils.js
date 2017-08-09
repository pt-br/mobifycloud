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

d.on('error', err => {
  console.error(err);
});

const hostUtils = {
  updateHostFile: () => {
    fs.readFile('/etc/hosts', 'utf8', (err, hostsContent) => {
      if (err) {
        return console.log(err);
      }

      originalHosts = hostsContent;

      let newHostsContent = `${hostsContent} # MobifyCloud Development Hosts:`;
      for (let i = 0; i < routesHost.length; i++) {
        newHostsContent = newHostsContent + '\n' + '127.0.0.1' + '\t' + routesHost[i];
      }

      /* Verify if writeFile is successful to avoid Heroku issues */
      d.run(() => {
        fs.writeFile('/etc/hosts', newHostsContent, err => {
          if (err) throw err;
        });
      });
    });
  },

  getRoutes: () => {
    let urlRoutesLength = JSON.stringify(url_map.route.length);
    for (let i = 0; i < urlRoutesLength; i++) {
      routes.push(JSON.stringify(url_map.route[i]));
    }
  },

  cleanupHosts: () => {
    console.log('Restoring original /etc/hosts file...');
    fs.writeFileSync('/etc/hosts', originalHosts);
  },

  getRoutesEndpoint: () => {
    for (let i = 0; i < routes.length; i++) {
      routesEndpoint.push(routes[i].split('=> ')[1].replace('\"', ''));
      return routesEndpoint;
    }
  },

  getRoutesHost: () => {
    for (let i = 0; i < routes.length; i++) {
      routesHost.push(routes[i].split('=> ')[0].replace('\"', ''));
      return routesHost[0];
    }
  },
}

module.exports = hostUtils;