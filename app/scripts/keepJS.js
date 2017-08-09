function keepJS() {
  const keepList = {
    head: [
    ],
    body: [],
    noSrc: [
      'cadnews',
    ]
  };

  const siteScripts = {
    head: $('head').find('script[src]'),
    body: $('body').find('script[src]'),
    noSrc: $('script:not([src])')
  };

  const kept = {
    head: [],
    body: [],
    noSrc: []
  };

  const notKept = {
    head: [],
    body: [],
    noSrc: []
  };

  for (let elem in siteScripts) {
    if (elem == 'noSrc') {
      console.log(' ');
      console.log('- - - - - > search ',elem);
      console.log('- - - - - > siteScripts['+elem+'].length ',siteScripts[elem].length);
      siteScripts[elem].each(function() {
        const thisScript = $(this);
        let found = false;

        for (let i = 0; i < keepList[elem].length; i++) {
          const matcher = new RegExp(keepList[elem][i]);
          const match = matcher.test(thisScript.text());
          if (match) {
            found = true;
          }
        };

        if (found) {
          console.log(`- - - - - > keeping ${elem} script `, thisScript.text());
          thisScript.attr('data-keep', 'true');
          kept[elem].push(thisScript.text());
        }
        else {
          var sIndex = notKept[elem].indexOf(thisScript.text());
          if (sIndex < 0) {
            notKept[elem].push(thisScript.text());
          }
        }
      });
    }
  }

  console.log(`= = = = > Kept ${kept.head.length+kept.body.length} scripts`);
  console.log(kept);
};

module.exports = keepJS;
