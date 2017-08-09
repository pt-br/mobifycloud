const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

function generateSpriteSheet() {
  const spritesLocation = path.join(__dirname, '../app/assets/images/sprites/');
  const spritesheetFile = path.join(__dirname, '../app/assets/stylesheets/sprites/sprites.scss');
  const spriteBackgroundLocation = '/sprites/';
  let spriteSheetContent = '';
  let spriteSheetMessage = '';
  const classTemplate = `
.$CLASS_NAME {
  background: url('${spriteBackgroundLocation} $IMAGE_NAME') no-repeat;
  width: $IMAGE_WIDTHpx;
  height: $IMAGE_HEIGHTpx;
  display: inline-block;
}`;

  let spriteFiles = fs.readdirSync(spritesLocation);
  for (let i = 0; i < spriteFiles.length; i++) {
    let spriteFile = spriteFiles[i];
    let spriteName = spriteFile.replace(/\..*/gi, '');
    let dimensions = sizeOf(spritesLocation + spriteFile);
    const spriteWidth = dimensions.width;
    const spriteHeigth = dimensions.height;
    spriteSheetMessage = '/* This file is auto generated. Your changes do not have any effect. */\n';
    let newSpriteClass = classTemplate.replace(/\$CLASS_NAME/g, `sprite-${spriteName}`)
      .replace(/\$IMAGE_NAME/g, spriteFile)
      .replace(/\$IMAGE_WIDTH/g, spriteWidth)
      .replace(/\$IMAGE_HEIGHT/g, spriteHeigth);

    spriteSheetContent = `${spriteSheetContent} ${newSpriteClass}`;
  }

  spriteSheetContent = `${spriteSheetMessage} ${spriteSheetContent}`;

  /* Export sprites.scss file */
  fs.writeFileSync(spritesheetFile, spriteSheetContent);
}

module.exports = generateSpriteSheet;