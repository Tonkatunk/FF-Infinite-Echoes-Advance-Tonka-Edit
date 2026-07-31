//=============================================================================
// FNG_MessageWindow.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc メッセージウィンドウの大きさを変更する
  * @author finga
  * @help メッセージウィンドウの大きさを変更する
*/

Scene_Message.prototype.messageWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(3, false) + $DOT*11;
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Message.prototype.goldWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.calcWindowHeight(1, true)+ $DOT*2;
    const wx = Graphics.boxWidth - ww;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

Window_Message.prototype.drawIcon = function(iconIndex, x, y) {
    Window_Base.prototype.drawIcon.call(this,iconIndex, x-$TILE/4, y+$TILE/4);
};

Window_NameBox.prototype.windowHeight = function() {
    return this.fittingHeight(1)+ $DOT*1;
};

Window_NameBox.prototype.refresh = function() {
    const rect = this.baseTextRect();
    this.contents.clear();
    this.drawTextEx(this._name, rect.x, rect.y+$DOT*1, rect.width);
};