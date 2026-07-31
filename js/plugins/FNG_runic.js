//=============================================================================
// FNG_runic.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 魔封剣の処理
  * @author finga
  * @help 魔封剣の処理
*/

BattleManager.setRunicedMagic = function(skill){
    this._runicedMagic = skill;
}

BattleManager.runicedMagic = function(skill){
    return this._runicedMagic;
}

BattleManager.runicReadies = function(){
    if(!this._runicReadies){
        this._runicReadies = [];
    }
    temp = [];
    for(battler of this._runicReadies){
        if(battler.isStateAffected(61)){
            temp.push(battler);
        };
    }
    this._runicReadies = temp;
    return this._runicReadies;
}

BattleManager.pushRunicReady = function(battler){
    if(!this._runicReadies){
        this._runicReadies = [];
    }
    this._runicReadies.push(battler);
}

BattleManager.runicBattler = function(battler){
    const readies = this.runicReadies();
    if(readies.length > 0){
        return readies[0];
    }
    return null;
}

BattleManager.removeRunicBattler = function(battler){
    const readies = this.runicReadies();
    this._runicReadies = readies.filter(function(a){
        return a != battler;
    });
}

BattleManager.runicBattler = function(battler){
    const readies = this.runicReadies();
    if(readies.length > 0){
        return readies[0];
    }
    return null;
}

BattleManager.getRunicCastId = function(){
    switch(this.runicedMagic().stypeId){
        case 5: //白魔法
            return 115;
        case 6: //黒魔法
            return 116;
        case 7: //時空魔法
            return 117;
        case 8: //青魔法
            return 119;
        case 9: //召喚魔法
            return 118;
        case 19: //魔法剣
            return 120;
        case 26: //魔石
            return 118;
    }
}