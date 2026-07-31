//=============================================================================
// FNG_BattleSpeed.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc バトルスピードを再定義する
  * @author finga
  * @help バトルスピードを再定義する。コンフィグによってスピードを変える
*/

Game_Unit.prototype.tpbReferenceTime = function() {
    if(BattleManager.fastForwarding()){
      return 30;
    }
    return 60 + Number($gameVariables.value(1002)) * 30;
};