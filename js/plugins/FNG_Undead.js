//=============================================================================
// FNG_Undead.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc ゾンビ状態を実装する
  * @author finga
  * @help ゾンビ状態を実装する
*/

//種族ゾンビ特効が有効ならアンデッド族とみなす
Game_Battler.prototype.isUndead = function() {
    const rate = this.elementRate(22);
    if(rate > 1){
        return true;
    }
    return false;
}

const _Game_Enemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y) {
    _Game_Enemy_setup.apply(this,arguments);
    if(this.isUndead()){ //種族がアンデッドの場合、
        this.addState(36); //ゾンビ状態を自動付与
    }
};

//仕様効果欄のHP回復は無効化
Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
    let value = (target.mhp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if(this.item().meta.raise&&target.isAlive()){
        value = 0;
    }
    if(target.isStateAffected(36)){
        value = 0;
    }
    if (value !== 0) {
        target.gainHp(value);
        this.makeSuccess(target);
    }
};

const _Game_Action_itemEffectRemoveState = Game_Action.prototype.itemEffectRemoveState;
Game_Action.prototype.itemEffectRemoveState = function(target, effect) {
    //ゾンビ状態なら蘇生は無効
    if(target.isStateAffected(36)&&effect.dataId==1&&this.item().meta.raise){
        return;
    }
    _Game_Action_itemEffectRemoveState.apply(this,arguments);
};