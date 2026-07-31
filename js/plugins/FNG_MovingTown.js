//=============================================================================
// FNG_MovingTown.js
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc フィールド移動用の選択肢用ウィンドウを表示します
 * @author finga
 * @url
 *
 * @help フィールド移動用の選択肢用ウィンドウを表示します
 */
 
 //-----------------------------------------------------------------------------
// Window_TownCommand
//
// The window for selecting a command on the menu screen.

function Window_TownCommand() {
    this.initialize(...arguments);
}

Window_TownCommand.prototype = Object.create(Window_Command.prototype);
Window_TownCommand.prototype.constructor = Window_TownCommand;

Window_TownCommand.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
};
