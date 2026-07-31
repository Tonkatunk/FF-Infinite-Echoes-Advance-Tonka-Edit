//=============================================================================
// FNG_CustomConfuse.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 敵の混乱時、従来の行動ではなく対象を反対側にするようにする
  * @author finga
  * @help 敵の混乱時、従来の行動ではなく対象を反対側にするようにする
*/

//混乱時、敵は攻撃をセットにしない
Game_Action.prototype.prepare = function() {
    if (this.subject().isActor() && this.subject().restriction() == 3 && !this._forcing) {
        this.setConfusion();
    }
};

Game_Battler.prototype.forcedTargets = function(){
    return this._forcedTargets;
}

Game_Battler.prototype.setForcedTargets = function(targets){
    this._forcedTargets = targets;
}

Game_Action.prototype.makeTargets = function() {
    var targets = [];
	//自分自身をtargetとする場合
	if(this.item().scope == 11){
	   return [this.subject()];
	}
    //console.log(this.subject().name(),"restrict level:",this.subject().restriction(),"countering:",this.subject().isCountering(),"targetindex",this._targetIndex,"forced?:",this._forcing)
    if(!this.subject().isConfused()&&this.subject().forcedTargets()&&!this.subject().isStateAffected(7)){
        targets = this.subject().forcedTargets();
        this.subject().setForcedTargets(null);
        return targets;
    }
    if(this.subject().landingTargets()&&this.item()&&this.item().meta.landing){
        //ターゲットが複数か単数かでジャンプのターゲットを変える
        //複数の場合、戦闘不能バトラーを対象から除外
        if(this.subject().landingTargets().length > 1){
            for(target of this.subject().landingTargets()){
                if(!target.isDead()){
                    targets.push(target);
                }
            }            
        }else{
        //単数の場合、他の対象に移し替える
            if(this.subject().landingTargets()[0] && !this.subject().landingTargets()[0].isDead()){
                targets.push(this.subject().landingTargets()[0]);
            }else{
                targets.push(...this.targetsForOpponents());
            }
        }
       this.subject().resetlandingTargets();
    }else if (this.subject().isConfused() && this.subject().isActor()) {
        if(this.subject().restriction() == 1 && this.subject().isCountering()){
            //アクター、かつバーサクの場合
            targets.push(this.subject().opponentsUnit().members()[this._targetIndex]);
        }else{
            //アクター、かつ混乱の場合
            targets.push(this.confusionTarget());
        }
    } else if (this.subject().isConfused() && this.subject().isEnemy()) {
        //エネミー、かつバーサクの場合
        if(this.subject().restriction() == 1){
            targets.push(...this.targetsForOpponents());
        }else{
            //アクター、かつ混乱の場合
            targets.push(this.confusionTarget());
        }
    } else if (this.isForEveryone()) {
        //全員が対象の場合
        targets.push(...this.targetsForEveryone());
    } else if ((this.isForOpponent() && !this.subject().isConfused())||(this.isForFriend() && this.subject().isConfused())) {
        targets.push(...this.targetsForOpponents());
    } else if ((this.isForFriend() && !this.subject().isConfused())||(this.isForOpponent() && this.subject().isConfused())) {
        targets.push(...this.targetsForFriends());
    }
    //ジャンプなどのターゲットにできないメンバーの除外
    targets = targets.filter(member => member&&!member.isStateAffected(34)); //除外
    targets = targets.filter(member => member&&!member.isStateAffected(23)); //ジャンプｗ
    if(!this.subject().cantSelect()&&!this.item().meta.CallEnemy){
        targets = targets.filter(member => member&&!member.cantSelect()&&!this.item().meta.CallEnemy); //選択不可能設定
    }
    var repeatedTargets = this.repeatTargets(targets);
    //拡散ターゲットの追加
    if(repeatedTargets.length > 0 && this.item().meta.diffusionTarget){
        var members;
        if(repeatedTargets[0].isEnemy()){
            members = $gameTroop.aliveMembers();
        }else{
            members = $gameParty.aliveMembers();            
        }
        for(member of members){
            if(member != repeatedTargets[0]&&!member.cantSelect()){
                repeatedTargets.push(member);
            }
        }
    }
    //自分以外を対象とするスキルは対象から自分を抜く
    if(this.item().meta.withoutSelf){
        var members = [];
        for(member of repeatedTargets){
            if(member != this.subject()){
                members.push(member);
            }
        }
        repeatedTargets = members;
    }
    //死の宣告のターゲット処理
    if(this.item().meta.doomtarget){
        var members = [];
        for(member of repeatedTargets){
            console.log(repeatedTargets)
            if(member.isStateAffected(39) && member._deathCount <= 0){
                members.push(member);
            }
        }
        repeatedTargets = members;
    }
    //天使のおやつのターゲット処理
    if(this.subject().isActor() && this.item().meta.angelsnack){
        var members = [];
        for(member of repeatedTargets){
            if(member != this.subject()){
                members.push(member);
            }
        }
        repeatedTargets = members;
    }
    return repeatedTargets;
};

Game_Action.prototype.makeAngelSnackTargets = function(members) {
    var tempTargets = []
    var targets = []
    var amountRemedy = $gameParty.numItems($dataItem[21]) //万能薬の数

    for(member of members){
        if(member.needAngelSnack()){
            tempTargets.push(member)
        }
    }

    for(let i=0;i<Math.min(amountRemedy,tempTargets);i++){
        targets.push(tempTargets[i])
    }

    return targets
}

Game_Battler.prototype.needAngelSnack = function() {
    var needStateId = [4,5,6,7,8,10,11,12,14,35,55,56]; //天使のおやつの対象ステートにかかっているか
    for(id of needStateId){
        if(this.isStateAffected(id)){
            return true
        }
    }
    return false
}

const _Game_Action_targetsForFriends = Game_Action.prototype.targetsForFriends;
Game_Action.prototype.targetsForFriends = function() {
    if(this.subject().isConfused()){
        const unit = this.friendsUnit().filter(target => target.isTargetable());
        if (this.isForRandom()) {
            return this.randomTargets(unit);
        } else {
            return this.targetsForAlive(unit);
        }     
    }else{
        if(this.isExpandedScope()){
            const unit = this.friendsUnit();
            return this.targetsForAlive(unit);            
        }
        return _Game_Action_targetsForFriends.apply(this,arguments);
    }
};

const _Game_Action_targetsForOpponents = Game_Action.prototype.targetsForOpponents;
Game_Action.prototype.targetsForOpponents = function() {
    if(this.subject().restriction() >= 2){
        const unit = this.opponentsUnit();
        if (this.isForUser()) {
            //return this.randomTargets(unit);
            return [this.subject()];
        } else if (this.isForDeadFriend()) {
            return this.targetsForDead(unit);
        } else if (this.isForAliveFriend()) {
            return this.targetsForAlive(unit);
        } else {
            return this.targetsForDeadAndAlive(unit);
        }
    }else{
        if(this.isExpandedScope()&&!this.isForRandom()){
            const unit = this.opponentsUnit();
;            return this.targetsForAlive(unit);            
        }
        //挑発されていたら対象を変更
        if(this.subject().isStateAffected(20)&&this.subject().decoy()){
            if(this.subject().decoy().isTargetable()){
                this.subject().setDecoyResetFlag();
                return [this.subject().decoy()];
            }
        }
        return _Game_Action_targetsForOpponents.apply(this,arguments);
    }
};

Game_Unit.prototype.targetableMembers = function() {
    return this.members().filter(member => member.isTargetable());
};

Game_Battler.prototype.isTargetable = function(){
    if(this.isStateAffected(21)||this.isStateAffected(23)||this.isStateAffected(11)){
        return false;
    }
    if(this.isDead()){
        return false;
    }
    if(this.isHidden()){
        return false;
    }
	   
    return true;
	   
}

Game_Battler.prototype.isDeadTargetable = function(){
    if(this.isStateAffected(21)||this.isStateAffected(23)||this.isStateAffected(11)||this.isStateAffected(34)){
        return false;
    }
    if(!this.isStateAffected(1)){
        return false;
    }
    if(this.isHidden()){
        return false;
    }
	   
    return true;
	   
}

Game_Action.prototype.targetsForAlive = function(unit) {

    if (this.isForOne()) {
        var target = [];
        if (this._targetIndex < 0) {
            target.push(unit.randomTarget());
        } else {
            target.push(unit.smoothTarget(this._targetIndex));
        }
        if(target.length > 0){
            if(!target[0]||!target[0].isTargetable()){
                return [];
            }
        }
        return target;
    } else {
        members = unit.aliveMembers();
        //石化状態にも効果のあるスキルの場合、対象を含める
        if(this.item().meta.stona){
            for(member of unit.members()){
                if(member.isStateAffected(11)){
                    members.push(member);
                };
            }
        }
        //捕らわれ状態を反映する
        //味方全体が対象なら対象から除外
        if(members[0]&&members[0].isActor()){
            members = members.filter(function(a){
                return !a.isStateAffected(62);
            });
        }
        //敵全体が対象なら対象に追加
        if(members[0]&&members[0].isEnemy()){
            for(actor of $gameParty.members()){
                if(actor.isStateAffected(62)){
                    members.push(actor);
                }
            }
        }
        return members;
    }
};

const _Game_Unit_randomTarget = Game_Unit.prototype.randomTarget;
Game_Unit.prototype.randomTarget = function() {
    let target = _Game_Unit_randomTarget.apply(this,arguments);
    if(!target){
        return target;
    }
    if(target.cantSelect){ //選択できない敵の場合再抽選
        let index;
        let targets;
        if(target.isEnemy()){
            index = Math.floor(Math.random()*$gameTroop.selectableMembers().length);
            targets = $gameTroop.selectableMembers();
        }else{
            index = Math.floor(Math.random()*$gameParty.aliveMembers().length);
            targets = $gameParty.aliveMembers();
        }
        target = targets[index];
    }
    if(target.isStateAffected(62)){ //元処理で選出したターゲットがとらわれていた場合は再抽選       
        let tgrRand = Math.random() * this.tgrSum();
        let target = null;
        for (const member of this.aliveMembers()) {
            tgrRand -= member.tgr;
            if(member.isStateAffected(62)){
                continue;
            }
            if (tgrRand <= 0 && !target) {
                target = member;
            }
        }
        return target;
    }
    return target;
};

//ランダム4回以上を可能にする
const _Game_Action_numTargets = Game_Action.prototype.numTargets;
Game_Action.prototype.numTargets = function() {
    var amount = _Game_Action_numTargets.apply(this,arguments);
    if(this.item().meta.targetRandamPlus){
        amount += Number(this.item().meta.targetRandamPlus);
    }
    if(this.item().meta.targetRandamPlusBow){
        const subject = this.subject();
        const weapons = subject.weapons()
        let weapon;
        if(weapons.length > 0){
            weapon = weapons[0];
            if(weapon.wtypeId == 9){
                amount += 2;       
            }
        }
    }
    return amount;
};

Game_Enemy.prototype.selectAction = function(actionList, ratingZero) {
    this.removeState(61); //魔封剣を解除
    const sum = actionList.reduce((r, a) => r + a.rating - ratingZero, 0);
    if (sum > 0) {
        let value = Math.randomInt(sum);
        for (const action of actionList) {
            value -= action.rating - ratingZero;
			if(this.restriction() == 1){
				action.skillId = 1;
			}
            if (value < 0) {
                return action;
            }
        }
    } else {
        return null;
    }
};