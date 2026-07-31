//-----------------------------------------------------------------------------
// FNG_BattleActorSkip.js
//
// バトル時、コマンドウィンドウをスキップし別のアクターへ入力を移す。

Scene_Battle.prototype.commandCancel = function() {
    BattleManager.changeCurrentActor(true);
    this._actorCommandWindow.close();
};