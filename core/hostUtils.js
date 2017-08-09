const fs = require('fs');
const domain = require('domain');
const siteConfig = require('../siteConfig.json');

const d = domain.create();
/* Site Route */
let siteDomains = [];
let developmentDomain = [];
let originalHosts = '';
const { developmentPrefix } = siteConfig.routes;

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

      let newHostsContent = '\n'+ hostsContent + '\n# MobifyCloud Development Hosts:';
      siteDomains.map((domain) => {
        newHostsContent = newHostsContent + '\n' + '127.0.0.1' + '\t' + `${developmentPrefix}.${domain}`;
      });

      /* Verify if writeFile is successful to avoid Heroku issues */
      d.run(() => {
        fs.writeFile('/etc/hosts', newHostsContent, err => {
          if (err) throw err;
        });
      });
    });
  },

  getSiteDomains: () => {
    const domains = siteConfig.routes.siteDomain;
    domains.map((domain) => {
      siteDomains.push(domain);
    });

    return siteDomains;
  },

  cleanupHosts: () => {
    console.log('Restoring original /etc/hosts file...');
    fs.writeFileSync('/etc/hosts', originalHosts);
  },

  getDevelopmentDomain: () => {
    const firstDomain = siteConfig.routes.siteDomain[0];
    return `${developmentPrefix}.${firstDomain}`;
  },
}

module.exports = hostUtils;