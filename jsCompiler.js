const fs = require('fs');

/**
  * Thanks to @williammustaffa for this compiler.
  * Original src: https://github.com/williammustaffa/jGame.js/blob/master/compile.js
  *
  */

// Project src
const srcDir = './app/assets/javascript'
const entryPoint = `${srcDir}/main.js`;
// regex to serach @include('file'); declarations
const searchRegex = /include\((\'|\")[^\)]*(\'|\")\)/;

function jsCompiler() {
  // Parse entry point
  let content = parseInclude(entryPoint);
  // write the parsed/replaced content into a single file
  fs.writeFileSync('./app/assets/javascript/bundle/mobifycloud.js', content);
  console.log('JS assets compiled into -> app/assets/javascript/mobifycloud.js');
}

/**
 *  Replaces all @include('file') declarations with file content
 *
 * @param {String} file src
 * @returns {String} File content with 'includes' content
 */
function parseInclude(src) {
  let content = fs.readFileSync(src, 'utf8');
  // verify all include declarations and replace with file content
  while((searchResult = searchRegex.exec(content))) {
    content = content.replace(';', '');
    let includeDeclaration = searchResult[0];
    // get included file path
    let includePath = getPath(includeDeclaration);
    // parse include declaration content
    let includeContent = parseInclude(includePath);
    // replace include with file content
    content = content.replace(includeDeclaration, includeContent);
  }
  return content;
}

/**
 * Retrive the include declaration file path
 *
 * @param {String} include declaration like @include('test.js')
 * @returns {String} path
 */
function getPath(include) {
  return `${srcDir}/${include.replace(/include\((\'|\")|(\'|\")\)/g, '')}`;
}

function insertFileInfo(src, content) {
  let prefix = `/* >> ${src} START */`,
      sufix = `/* << ${src} END */`;
  return  prefix + '\n' + content + '\n' + sufix;
}

module.exports = jsCompiler;