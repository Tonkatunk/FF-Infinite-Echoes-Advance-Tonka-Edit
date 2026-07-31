//=============================================================================
// FNG_MenuNameWindow.js
//=============================================================================

/*:ja
 * @plugindesc メニュー画面でメニューの名前を右上に表示するスクリプトです
 * @author finga
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */
    
//-----------------------------------------------------------------------------
// Window_MenuName
//
// メニュー画面時の名前を右上に表示します。

function Window_MenuName(x,y,width,height) {
    this.initialize.call(this,x,y,width,height);
}

Window_MenuName.prototype = Object.create(Window_Base.prototype);
Window_MenuName.prototype.constructor = Window_MenuName;

Window_MenuName.prototype.drawMenuName = function(name) {
    this.contents.clear();
    this.changeTextColor(this.systemColor());
    this.drawText(name, 0,this.height/2-this.padding*2, this.width-this.padding*2,'center');
};
    
//-----------------------------------------------------------------------------        
