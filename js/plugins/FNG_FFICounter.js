//=============================================================================
// FNG_FFICounter.js
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc FFIでカウンター
 * @author finga
 * @url
 *
 * @help FFIオリジナルのカウンターを実装する
 * 
 */

//"el","属性番号"…特定の属性に対しカウンター
//"ph"…物理攻撃に対してカウンター
//"mg"…魔法攻撃に対してカウンター
//指定なし…すべての行動に対してカウンター

Game_Enemy.prototype.setCounter = function(action){
    if(this.isCountering()){
        return;
    }
    const obj = $dataEnemies[this._enemyId];
    const item = action.item();
    const counter = new Game_Action(this, true);
    if(!obj.meta['counter']){
        return;
    }
    
    for(block of obj.meta['counter'].split('|')){
        const type = block.split(',')[0];        
        
        //属性カウンター
        if(type == "element"){
            console.log("Element Counter")
            var element;
            if(block.split(',')[1]=="weak"){
                element = block.split(',')[1];
            }else{
                element = Number(block.split(',')[1]);
            }
            const skillId = block.split(',')[2];
			if(block.split(',').length>=5){
				if(!this.isStatesAffected(block.split(',')[4].split('&'))){
					continue;
				}
			}
            var targetType = "subject";
            if(block.split(',').length >= 4){
                targetType = block.split(',')[3];
            }
            console.log("Element Counter:",element," skillId:",skillId," targetType:",targetType);
            if(element == "weak"){
                console.log("Weak Judgement")
                for(elementId of action.getElements(item,"both")){
                    if(elementId >= 2 && elementId <= 10 && this.elementRate(elementId) > 1 ){
                        counter.setSkill(skillId);
                        counter.setTarget(this.counterTarget(targetType));
                        counter.setTargetReverse(targetType,this);
                        this.pushCounterAction(counter);
                        this._countering = true;
                        return;
                    }
                }
				continue;
            }
            if(action.getElements(item,"both").includes(element)&&this.meetsSkillConditions($dataSkills[skillId])){
                counter.setSkill(skillId);
                counter.setTarget(this.counterTarget(targetType));
                counter.setTargetReverse(targetType,this);
                this.pushCounterAction(counter);
                this._countering = true;
                return;
            }
        }
        
        //魔法カウンター
        if(type == "magic"){
            if(item.damage.elementId > 1){
                var skillId = 1
                if(block.split(',')[1] == "black"){
                    if(DataManager.isSkill(item)&&item.stypeId == 6){
                        skillId = item.id
                    }else{
                        return;
                    }
                }else if(block.split(',')[1] == "white"){
                    if(DataManager.isSkill(item)&&item.stypeId == 5){
                        skillId = item.id
                    }else{
                        return;
                    }
                }else if(block.split(',')[1] == "time"){
                    if(DataManager.isSkill(item)&&item.stypeId == 7){
                        skillId = item.id
                    }else{
                        return;
                    }
                }else if(block.split(',')[1] == "blue"){
                    if(DataManager.isSkill(item)&&item.stypeId == 8){
                        skillId = item.id
                    }else{
                        return;
                    }
                }else{
                    skillId = block.split(',')[1];
                }
                var targetType = "subject";
                if(block.split(',').length >= 3){
                    targetType = block.split(',')[2];
                }
				if(block.split(',').length>=4){
					if(!this.isStatesAffected(block.split(',')[3].split('&'))){
						return;
					}
				}
                console.log("koko",this.meetsSkillConditions($dataSkills[skillId],skillId))
                if(this.meetsSkillConditions($dataSkills[skillId])){
                    counter.setSkill(skillId);
                    counter.setTarget(this.counterTarget(targetType));
                    counter.setTargetReverse(targetType,this);
                    this.pushCounterAction(counter);
                    this._countering = true;
                    return;
                }
            }
        }
        
        //物理カウンター
        if(type == "physical"){
            if(item.damage.elementId == -1 || item.damage.elementId == 1 ){
                const skillId = block.split(',')[1];
                var targetType = "subject";
                if(block.split(',').length >= 3){
                    targetType = block.split(',')[2];
                }
				if(block.split(',').length>=4){
					if(!this.isStatesAffected(block.split(',')[3].split('&'))){
						return;
					}
				}
                if(this.meetsSkillConditions($dataSkills[skillId])){
                    counter.setSkill(skillId);
                    counter.setTarget(this.counterTarget(targetType));
                    counter.setTargetReverse(targetType,this);
                    this.pushCounterAction(counter);
                    this._countering = true;
                    return;
                }
            }
        }
        
        //アイテムカウンター
        if(type == "item"){
            if(DataManager.isItem(item) && item.id == Number(block.split(',')[1])){
                const skillId = block.split(',')[2];
                var targetType = "subject";
                if(block.split(',').length >= 4){
                    targetType = block.split(',')[3];
                }
				if(block.split(',').length>=5){
					if(!this.isStatesAffected(block.split(',')[4].split('&'))){
						return;
					}
				}
                if(this.meetsSkillConditions($dataSkills[skillId])){
                    counter.setSkill(skillId);
                    counter.setTarget(this.counterTarget(targetType));
                    counter.setTargetReverse(targetType,this);
                    this.pushCounterAction(counter);
                    this._countering = true;
                    return;
                }           
            }
        }
        
        //スキルカウンター
        if(type == "skill"){
            console.log("itemname:",item.name,"itemId:",item.id,"metaId:",block.split(',')[1],"item",item);
            if(DataManager.isSkill(item) && item.id == Number(block.split(',')[1])){
                const skillId = block.split(',')[2];
                var targetType = "subject";
                if(block.split(',').length >= 4){
                    targetType = block.split(',')[3];
                }
				if(block.split(',').length>=5){
					if(!this.isStatesAffected(block.split(',')[4].split('&'))){
						return;
					}
				}
                if(this.meetsSkillConditions($dataSkills[skillId])){
                    counter.setSkill(skillId);
                    counter.setTarget(this.counterTarget(targetType));
                    counter.setTargetReverse(targetType,this);
                    this.pushCounterAction(counter);
                    this._countering = true;
                    return;
                }             
            }
        }
    }
}

Game_Enemy.prototype.setFinalAttack = function(){
    const obj = $dataEnemies[this._enemyId];
    console.log(this._enemyId,"setfinalattack")
    if(!obj.meta['finalattack']){
        return;
    }
    const skillId = Number(obj.meta['finalattack'].split(',')[0]);
    this.removeState(1);
    this.setHp(1);
    if(this._finalAttacking){
        return;
    }
    this._finalAttacking = true;
    if(this.meetsSkillConditions($dataSkills[skillId])){
        this.setFinalAttackSkill();
    }    
}

Game_Enemy.prototype.resetFinalAttack = function(){
    this._finalAttacking = false;
    this._countering = false;
    this._counterActions = []; 
}

Game_Enemy.prototype.setFinalAttackSkill = function(){
    const obj = $dataEnemies[this._enemyId];
    const counter = new Game_Action(this, true);
    const skillId = Number(obj.meta['finalattack'].split(',')[0]);
    var targetType = "subject";
    counter.setSkill(skillId);
    if(obj.meta['finalattack'].split(',').length > 1){
        targetType = obj.meta['finalattack'].split(',')[1];
    }
    counter.setTarget(this.counterTarget(targetType));
    counter.setTargetReverse(targetType,this);
    this.pushCounterAction(counter);
    console.log("pushCounterAction skillId:",skillId)
    this._countering = true;  
}

Game_Battler.prototype.counterTarget = function(type){
    if(type == "subject"){
        return BattleManager._subject.index();
    }else if(type == "self"){
        return this.index();
    }else if(type == "friend"){
        return -1;
    }
}

Game_Actor.prototype.setCounter = function(action){
    if(this.isCountering() || BattleManager._subject.isActor()){
        return;
    }
    const item = action.item();
    const counter = new Game_Action(this, true);

    if(item.meta.noCounter){ //カウンター対象外の行動なら終了
        return;
    }

    const wolfed = this._result.wolfed;



    //ウルフカウンター
    if(wolfed && this.hasSkill(296)){
        const skillId = 102;
        var targetType = "subject";
        counter.setSkill(skillId);
        counter.setTarget(this.counterTarget(targetType));
        counter.setTargetReverse(targetType,this);
        this.pushCounterAction(counter);
        this._countering = true;
        return;
    }    
    
    //必殺剣空カウンター
    if(this.isStateAffected(72) && item.damage.elementId == -1){
        const skillId = 941;
        var targetType = "subject";
        counter.setSkill(skillId);
        counter.setTarget(this.counterTarget(targetType));
        counter.setTargetReverse(targetType,this);
        this.pushCounterAction(counter);
        this._countering = true;
        return;
    }    
    
    //物理カウンター
    if((this.hasSkill(290) || this.isStateAffected(72)) && item.damage.elementId == -1){
        const skillId = 19;
        var targetType = "subject";
        counter.setSkill(skillId);
        counter.setTarget(this.counterTarget(targetType));
        counter.setTargetReverse(targetType,this);
        console.log(counter._targetIndex);
        this.pushCounterAction(counter);
        this._countering = true;
        return;
    }
    
    //魔法返し
    if(this.hasSkill(291) && item.damage.elementId > 1){
        const skillId = item.id;
        var targetType = "subject";
        
        if(this.meetsSkillConditions($dataSkills[skillId])){
            counter.setSkill(skillId);
            counter.setTarget(this.counterTarget(targetType));
            counter.setTargetReverse(targetType,this);
            this.pushCounterAction(counter);
            this._countering = true;
            return;
        }
    }
}

Game_Actor.prototype.setAutoPotion = function(){
    const counter = new Game_Action(this, true);
    var itemId;
    for(let i = 3;i>0;i--){
        if($gameParty.hasItem($dataItems[i])){
            itemId = i;
        }        
    }
    if(itemId){
        counter.setItem(itemId);
        counter.setTarget(this.counterTarget("self"));
        this.pushCounterAction(counter);
        this._countering = true;
        return;        
    }
}

Game_Action.prototype.setTargetReverse = function(type,battler){
    if(this.isForOpponent()){
        if(type == "subject"){
            if(battler.isEnemy() && BattleManager._subject.isEnemy()){
                this.setReverseTargetSide();
            }
        }else if(type == "self"){
            this.setReverseTargetSide();          
        }else if(type == "friend"){
            this.setReverseTargetSide();                 
        }
    }else if(this.isForFriend()){
        if(type == "subject"){
            if(BattleManager._subject.isActor()){
                this.setReverseTargetSide();
            }else if(battler.isActor() && BattleManager._subject.isEnemy()){
                this.setReverseTargetSide();
            }
        }        
    }
}

Game_Battler.prototype.counterActions = function(){
    if(!this._counterActions){
       this._counterActions = []; 
    }
    return this._counterActions;
}

Game_Battler.prototype.pushCounterAction = function(action){
    if(!this._counterActions){
       this._counterActions = []; 
    }
    this._counterActions.push(action);
}

Game_Battler.prototype.shiftCounterAction = function(){
    if(!this._counterActions){
        this._counterActions = [];
        return null;
    }
    return this._counterActions.shift();
}

Game_Battler.prototype.resetCounter = function(){
    this._countering = false;
}

Game_Battler.prototype.isCountering = function(){
    return this._countering;
}

BattleManager.readyCounterBattlers = function(){
    var members = [];
    for(enemy of $gameTroop.members()){
        //console.log(enemy.name(),enemy.canMove(),enemy.isCountering(),enemy.states());
        if(enemy.canMove()||enemy._finalAttacking){
            if(enemy.isCountering()){
                if(enemy._finalAttacking){
                    console.log("push finalattack enemy:",enemy.name())
                }
               members.push(enemy);
            }
        }else{
            enemy.resetCounter();
        }    
    }
    for(actor of $gameParty.members()){
        if(actor.canMove()){
            if(actor.isCountering()){
               members.push(actor);
            }
        }else{
            actor.resetCounter();
        }    
    }
    return members;
}

//カウンターがあるなら優先的に行動
Game_Battler.prototype.currentAction = function() {
    if(this.counterActions().length > 0){
        return this.counterActions()[0];
    }
    if(this.isCountering()){
        return null;
    }
    return this._actions[0];
};

//カウンターから優先的に削除
Game_Battler.prototype.removeCurrentAction = function() {
    if(this.counterActions().length > 0){
        console.log(this.name(),"がremoveCounterAction",this.counterActions()[0].name);
        this.shiftCounterAction();
        console.log(this._counterActions)
        return;
    }
    this._actions.shift();
};

//スタイナーの突撃
Game_Party.prototype.setChargeOrder = function(){
    for(member of this.aliveMembers()){
        if(member.canMove()&&member!=BattleManager.subject()){
            member.setChargeOrder();
        }
    }
}

Game_Actor.prototype.setChargeOrder = function(){
    const item = action.item();
    const counter = new Game_Action(this, true);
    const targets = $gameTroop.targetableMembers()
    
    const skillId = 1;
    //var targetType = "subject";
    counter.setSkill(skillId);
    counter.setTarget(BattleManager.indexTarget(0).index());
    //counter.setTargetReverse(targetType,this);
    this.pushCounterAction(counter);
    this._countering = true;
}

Game_Battler.prototype.isStatesAffected = function(states){
	for(state of states){
		const stateId = Number(state);
		console.log(stateId,this.isStateAffected(stateId),this.states())
		if(!this.isStateAffected(stateId)){
			return false;	
		}
	}
	return true;
}

Game_Actor.prototype.inputtingAction = function() {
    if(this._actions.length == 0){
        this._actions.push(new Game_Action(this))
    }
    if(!this._actionInputIndex){
        this._actionInputIndex = 0
    }
    return this.action(this._actionInputIndex);
};