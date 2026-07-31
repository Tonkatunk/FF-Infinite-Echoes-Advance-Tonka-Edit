//=============================================================================
// FNG_Learning.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 青魔法をラーニングします
  * @author finga
  * @help 青魔法をラーニングします
*/

//ラーニングしたスキルIDを保存する
Game_Party.prototype.learnedSkills = function() {
    if(!this._learnedSkills){
        this._learnedSkills = [];
    }
    return this._learnedSkills;
};

Game_Party.prototype.isLearned = function(skillId) {
    return this.learnedSkills().includes(skillId);
};

Game_Party.prototype.addLearnedSkill = function(skillId) {
    this._learnedSkills.push(skillId);
};

Game_Actor.prototype.isLearnable = function(skillId){
    const failedState = [1,5,7,8,10,11,23,37];
    for(stateId of failedState){
        if(this.isStateAffected(stateId)){
            return false;
        }
    }
    //習得済みはラーニングできない
    if($gameParty.isLearned(skillId)){
        return false;
    }
    //青魔法以外はラーニングできない
    if($dataSkills[skillId].stypeId != 8){
        return false;
    }
    //スキル293…ラーニング
    if(this.hasSkill(293)){
        return true;
    }
    //スキルタイプ8…青魔法
    if(this.skillTypes().includes(8)){
        return true;
    }
    return false;
}

Game_Enemy.prototype.isLearnable = function(skillId){
    const failedState = [1,5,7,8,10,11,23,37];
    for(stateId of failedState){
        if(this.isStateAffected(stateId)){
            return false;
        }
    }
    //習得済みはラーニングできない
    if($gameTroop.isLearned(skillId)){
        return false;
    }
    //青魔法以外はラーニングできない
    if($dataSkills[skillId].stypeId != 8){
        return false;
    }
    //metaラーニング
    if(this.enemy().meta.learning){
        return true;
    }
    console.log(this.enemy().meta);
    return false;
}

const _Game_Troop_clear = Game_Troop.prototype.clear;
Game_Troop.prototype.clear = function() {
    _Game_Troop_clear.apply(this,arguments);
    this._learnedSkills = [];
};

//ラーニングしたスキルIDを保存する
Game_Troop.prototype.learnedSkills = function() {
    if(!this._learnedSkills){
        this._learnedSkills = [];
    }
    return this._learnedSkills;
};

Game_Troop.prototype.isLearned = function(skillId) {
    return this.learnedSkills().includes(skillId);
};

Game_Troop.prototype.addLearnedSkill = function(skillId) {
    if(!this._learnedSkills){
        this._learnedSkills = [];
    }
    this._learnedSkills.push(skillId);
};

//ついでに召喚もここで定義
const _game_actor_skills2 = Game_Actor.prototype.skills
Game_Actor.prototype.skills = function() {
    var list = _game_actor_skills2.apply(this,arguments);
    if(!$gameParty){
        return list;
    }
    for(skillId of $gameParty.learnedSkills()){
        list.push($dataSkills[skillId]);
    }
    for(var i = 61;i <= 84;i++){
        if($gameSwitches.value(i)){
            list.push($dataSkills[i+423]);
            //マスター召喚
            if(list.includes($dataSkills[329])){
                list.push($dataSkills[i+803]);
            }
        }
    }
    return list;
}

BattleManager.applyLearning = function(target) {
    if(target.isLearnable(this._action.item().id)){
        var learnId = this._action.item().id;
        if(this._action.item().meta.learnAs){
            learnId = Number(this._action.item().meta.learnAs)
        }
        AudioManager.playSe({"name":"FF5 item","volume":100,"pitch":100,"pan":0});
        BattleManager.pushActiveMessage(this._action.item().name + "をラーニング");
        if(target.isActor()){
            $gameParty.addLearnedSkill(this._action.item().id);
        }else{
            $gameTroop.addLearnedSkill(this._action.item().id);
        }
    }
}