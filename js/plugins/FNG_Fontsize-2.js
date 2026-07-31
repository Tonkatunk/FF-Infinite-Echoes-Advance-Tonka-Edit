//=============================================================================
// FNG_Fontsize-2
//=============================================================================

//-----------------------------------------------------------------------------
// Window_Base
//
// The superclass of all windows within the game.

// フォントサイズを設定の-2する
// これによりフォントサイズを10未満に設定できる

Window_Base.prototype.resetFontSettings = function() {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = $gameSystem.mainFontSize() - 2;
    this.resetTextColor();
};

Scene_Base.prototype.mainFontSize = function() {
    return Number($gameSystem.mainFontSize()) - 2;
};