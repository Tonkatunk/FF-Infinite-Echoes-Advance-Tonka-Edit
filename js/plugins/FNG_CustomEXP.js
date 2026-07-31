//=============================================================================
// FNG_CustomEXP.js
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 経験値曲線をFF6っぽくします
 *              
 * @author finga
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */
 
 Game_Actor.prototype.expForLevel = function(level) {
    if(level==1||level>99){
        return 0;
    }
    return Math.round(
        level*level*(269-2.6907*(99-level))
    );
};

//経験値の数値からレベルを返す
Game_Actor.prototype.levelFromExp = function(exp) {
    for(let level =1;level<99;level++){
        if(this.expForLevel(level+1)>=exp){
            return level;
        }
    }
    return 99;
};

//レベルの値を正常に返すようにする
Object.defineProperty(Game_Actor.prototype, "level", {
    get: function() {
        this._level = this.levelFromExp(this._exp[this._classId]);
        if(this._classId==17){
            console.log(this._level,this._exp[this._classId]);
        }
        return this._level;
    },
    configurable: true
});