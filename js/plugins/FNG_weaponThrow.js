//=============================================================================
// FNG_weaponThrow.js
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 「投げる」コマンドで、武器を投げられるようにします
 * @author finga
 * @url
 */

Game_Actor.prototype.setThrowWeapon = function(weapon){
    this._throwWeapon = weapon;
}

Game_Actor.prototype.throwWeapon = function(){
    return this._throwWeapon;
}

Game_Actor.prototype.thatk = function(){
    if(!this.throwWeapon()){
        return 0;
    }
    return this.throwWeapon().params[2]*2;
}

Game_Actor.prototype.startThrowMotion = function(sx,sy,ex,ey){
    this._throwFrom = {x:sx,y:sy};
    this._throwTo = {x:ex,y:ey};
    this._startThrowMotion = true;
}

Game_Actor.prototype.throwFromCoordinate = function(){
    return this._throwFrom;
}

Game_Actor.prototype.throwToCoordinate = function(){
    return this._throwTo;
}

Game_Actor.prototype.resetThrowMotion = function(){
    this._startThrowMotion = false;
}

Game_Actor.prototype.isStartingThrowMotion = function(){
    return this._startThrowMotion;
}

Game_Actor.prototype.thelm = function(){
    if(!this.throwWeapon()){
        return [];
    }
    var elements = [];
    for(trait of this.throwWeapon().traits){
        if(trait.code == Game_BattlerBase.TRAIT_ATTACK_ELEMENT){
            elements.push(trait.dataId);
        }
    }
    //貫通属性を付加
    if(!elements.includes(19)){
        elements.push(19);
    }
    return elements;
}
 
const _BattleManager_finishActorInput2 = BattleManager.finishActorInput;
BattleManager.finishActorInput = function() {
    //武器投げの場合、武器を消費
   
    const action = BattleManager.inputtingAction();
    if(action){
        const weapon = action.subject().throwWeapon();        
        if(DataManager.isSkill(action.item())&&action.item().meta.throw){
            $gameParty.loseItem(action.subject().throwWeapon(),1);
        }
    }
    _BattleManager_finishActorInput2.apply(this,arguments);
};