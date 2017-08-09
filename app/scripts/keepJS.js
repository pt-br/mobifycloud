function keepJS() {

  var keepList = {
    head: [
    ],
    body: [
    ],
    noSrc: [
      'cadnews',
    ]
  };

  var siteScripts = {
    head: $('head').find('script[src]'),
    body: $('body').find('script[src]'),
    noSrc: $('script:not([src])')
  };

  var kept = {
    head: [],
    body: [],
    noSrc: []
  };

  var notKept = {
    head: [],
    body: [],
    noSrc: []
  };

  for(var elem in siteScripts) {
    if( elem == 'noSrc' ) {
      console.log(' ');
      console.log('- - - - - > search ',elem);
      console.log('- - - - - > siteScripts['+elem+'].length ',siteScripts[elem].length);
      siteScripts[elem].each(function() {
        var thisScript = $(this);
        var found = false;

        for(var i=0; i<keepList[elem].length;i++) {
          var matcher = new RegExp(keepList[elem][i]);
          var match = matcher.test(thisScript.text());
          if(match) {
            found=true;
          }
        };

        if(found) {
          console.log('- - - - - > keeping '+elem+' script ', thisScript.text());
          thisScript.attr('data-keep', 'true');
          kept[elem].push(thisScript.text());
        }
        else {
          var sIndex = notKept[elem].indexOf(thisScript.text());
          if(sIndex<0) {
            notKept[elem].push(thisScript.text());
          }
        }
      });
    }
  }

  console.log(' ');
  console.log('= = = = > Kept',kept.head.length+kept.body.length,'scripts');
  console.log(kept);
  console.log(' ');
  console.log('X X X > Removed',notKept.head.length+notKept.body.length,'scripts');
  console.log(notKept);
  console.log(' ');
};

module.exports = keepJS;
