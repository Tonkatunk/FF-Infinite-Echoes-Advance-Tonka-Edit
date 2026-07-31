//=============================================================================
// FNG_Cover.js
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc かばうを実装します
 * @author finga
 * @url
 *
 * @help かばうを実装します
 * 
 */

Game_Party.prototype.coverableMembers = function(){
    const party = $gameParty.aliveMembers();
    var members = [];
    for(actor of party){
        if(actor.coverable(0)){
            members.push(actor);
        }
    }
    return members;
}

Game_Troop.prototype.coverableMembers = function(coveredBattler){
    const troop = $gameTroop.aliveMembers();
    const hpRate = coveredBattler.hp / coveredBattler.mhp
    var members = [];
    for(enemy of troop){
        if(enemy.coverable(hpRate)){
            members.push(enemy);
        }
    }
    return members;
}

Game_Battler.prototype.coverable = function(hpRate){
    //特定のステートにかかっているとかばわない
    const disableStates = [5,7,8,10,11,12,14,17,21,23,34,35,37];
    
    for(stateId of disableStates){
        if(this.isStateAffected(stateId)){
            return false;
        }
    }
    //アクターの場合、かばうスキルがなければかばわない
    if(this.isActor()&&!this.hasSkill(281)){
        return false;
    }
    //敵の場合、指定HP割合以下じゃないとかばわない
    if(this.isEnemy()&&(!this.enemy().meta.cover||hpRate > Number(this.enemy().meta.cover))){
        return false;
    }
    return true;
}

Game_Battler.prototype.performCoverStart = function(){
    if(this.isEnemy()){
        BattleManager.pushActiveMessage(this.enemy().name+"Covering!");
        //かばうの行動を示すアニメーション
        $gameTemp.requestAnimation([this], 130);
        BattleManager.addWaitCount(30);
    }
    this._performCovering = true;
}

Game_Battler.prototype.performCoverEnd = function(){
    this._performCovering = false;
}

Game_Battler.prototype.coverPerforming = function(){
    return this._performCovering;
}

Game_Battler.prototype.coveringIndex = function(){
    return this._coveringIndex;
}

//かばう対象をセットし、
Game_Battler.prototype.setCovering = function(index){
    this._coveringIndex = index;
    this.addState(19);
}

//かばうの実行をリセット
Game_Battler.prototype.resetCovering = function(){
    this._coveringIndex = null;
    this.removeState(19);
}

//ターゲットをかばうことが可能かどうか
BattleManager.coverableTargets = function(targets){
    if(targets.length == 0){
        return false;
    }
    //対象が2人以上だとかばうを実行しない
    var firstTarget = targets[0];
    for(target of targets){
        if(target!=firstTarget){
            return false;
        }
    }
    //対象者がアクターの場合、瀕死ならかばう
    if(firstTarget.isActor() && firstTarget.isDying()){
        return true;
    }
    //対象者が敵の場合はかばうバトラー側で判定するためここではかばうを許可
    if(firstTarget.isEnemy()){
        return true;
    }
    return false;
}

BattleManager.applyCovering = function(targets){
    console.log("applycovering");
    //かばわれはターゲットの先頭
    const coveredBattler = targets[0];
    //かばうが実行可能なメンバーを収集
    var coverableMembers = [];
    if(coveredBattler.isActor()){
        coverableMembers = $gameParty.coverableMembers();
    }else{
        coverableMembers = $gameTroop.coverableMembers(coveredBattler);
    }
    //かばわれる本人をかばう実行者リストから除外
    coverableMembers = coverableMembers.filter(member => member!= coveredBattler);
    //かばえる人が居なければ元のターゲットを返す
    if(coverableMembers.length == 0){
        return targets;
    }
    //かばわれが適用された後のターゲット
    var changedTargets = [];
    var coveringActor = coverableMembers[Math.floor(Math.random() * (coverableMembers.length - 1))];
    coveringActor.setCovering(coveredBattler.index());
    for(target of targets){
        changedTargets.push(coveringActor);
    }
    return changedTargets;
}