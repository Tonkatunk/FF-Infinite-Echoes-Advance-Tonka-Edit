//=============================================================================
// FNG_CustomChoiceList.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 選択肢ウィンドウを正常に表示できるようにします
  * @author finga
  * @help 選択肢ウィンドウを正常に表示できるようにします
*/

Window_ChoiceList.prototype.windowHeight = function() {
    return this.numVisibleRows()*$TILE*11/16+$TILE*10/16+4;
};

Window_ChoiceList.prototype.lineHeight = function() {
    return $TILE*11/16;
};

Window_ChoiceList.prototype.maxChoiceWidth = function() {
  let maxWidth = 96;
  const choices = $gameMessage.choices();
  if(choices.length >= 2 && choices[0] == "はい" && choices[1] == "いいえ"){
     maxWidth = this.textSizeEx("　いいえ").width;
  }
  for (const choice of choices) {
      const textWidth = this.textSizeEx(choice).width+16;
      const choiceWidth = Math.ceil(textWidth) + this.itemPadding() * 2;
      if (maxWidth < choiceWidth) {
          maxWidth = choiceWidth;
      }
  }
  return maxWidth;
};

Window_ChoiceList.prototype.itemRect = function(index) {
  const maxCols = this.maxCols();
  const itemWidth = this.itemWidth();
  const itemHeight = this.itemHeight();
  const colSpacing = this.colSpacing();
  const rowSpacing = this.rowSpacing();
  const col = index % maxCols;
  const row = Math.floor(index / maxCols);
  const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX()+10;
  const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
  const width = itemWidth - colSpacing - 10;
  const height = itemHeight - rowSpacing;
  return new Rectangle(x, y, width, height);
};

Window_ChoiceList.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    this.drawTextEx(this.commandName(index), rect.x+4, rect.y, rect.width+4);
};