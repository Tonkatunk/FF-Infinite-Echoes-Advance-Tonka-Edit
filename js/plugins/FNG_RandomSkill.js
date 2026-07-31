//=============================================================================
// FNG_RandomSkill.js
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc ランダムに様々な技に分岐する技を実装します
 * @author finga
 * @url
 *
 * @help ランダムに様々な技に分岐する技を実装します
 * 
 */

Game_Action.prototype.setRandomSkill = function(){
    var skillId;
    var random = this.item().meta.random;
    if(!random){
        return;
    }
    switch(random){
        case "animal":
            skillId = this.getAnimalSkillId(); break;
        case "adlib":
            skillId = this.getAdlibSkillId(); break;
        case "adlibp":
            skillId = this.getAdlibpSkillId(); break;
        case "gaia":
            skillId = this.getGaiaSkillId(); break;
    }
    this._item.setObject($dataSkills[skillId]);
    this.makeTargets();
    
}

Game_Action.prototype.getAnimalSkillId = function(){
    var range = 10

    if(this._subject&&this._subject.isActor()&&this._subject.hasSkill(220)){
        range = range + 1
    }
    return Math.floor(Math.random() * range)+826;
}

Game_Action.prototype.getAdlibSkillId = function(){
    return Math.floor(Math.random() * 4)+841;
}

Game_Action.prototype.getAdlibpSkillId = function(){
    if(Math.random()*2<1){
        return 841;        
    }
    return Math.floor(Math.random() * 3)+842;
}

Game_Action.prototype.getGaiaSkillId = function(){
    const floor = $gameVariables.value(1);
    const at = [0,0,0,0,1,1,1,2,2,3];
    const rand = Math.floor(Math.random() * 10);
    var skillIds = [1701,1701,1701,1701];
    if(floor >= 1 && floor <= 4){
        //かまいたち、てんじょう、大音響、ブービートラップ
        skillIds = [1701,1702,1703,1704];
    }
    return skillIds[at[rand]];
}